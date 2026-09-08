import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/sidebar.tsx";
import TabDiv from "./components/main/tab/TabDiv.tsx";
import RequestDiv from "./components/main/request/RequestDiv.tsx";
import ResponseViewer from "./components/main/response/ResponstViewer.tsx";
import type {
    Request as RequestObj,
    ResponseData,
    AppData,
    HistoryItem,
    Tab,
} from "./type.ts";
import { sendApiRequest } from "./services/apiService.ts";
import { loadAppData, createAutoSave } from "./utils/storage.ts";

const autoSave = createAutoSave();

function App() {
    const [response, setResponse] = useState<ResponseData | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [appData, setAppData] = useState<AppData>(() => {
        return loadAppData();
    });
    useEffect(() => {
        autoSave.schedule(appData);
        return () => {
            autoSave.flush();
        };
    }, [appData]);

    const updateAppData = (newData: Partial<AppData>) => {
        setAppData((prevData) => ({ ...prevData, ...newData }));
    };

    const sendRequest = async (requestData: RequestObj) => {
        setIsLoading(true);
        setResponse(undefined);
        try {
            setResponse(await sendApiRequest(requestData));
            const historyItem: HistoryItem = {
                id: crypto.randomUUID(),
                request: requestData,
                timestamp: Date.now(),
            };
            const isDuplicate =
                JSON.stringify(appData.history[0]?.request) ===
                JSON.stringify(requestData);
            if (!isDuplicate) {
                updateAppData({ history: [historyItem, ...appData.history] });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setResponse({
                status: 500,
                statusText: "Internal Server Error",
                headers: {},
                body: null,
                time: 0,
                size: 0,
                error: "An error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetResponse = () => {
        setResponse(undefined);
        setIsLoading(false);
        autoSave.cancel();
    };

    const restoreRequest = (request: RequestObj) => {
        const index = parseInt(appData.tabs[appData.tabs.length - 1]?.title.split(" ")[1]) + 1;
        const newTab: Tab = {
            id: crypto.randomUUID(),
            title: `Tab ${index}`,
            request: request,
        };
        updateAppData({ tabs: [...appData.tabs, newTab], activeTabId: newTab.id });
    };

    const clearHistory = () => {
        updateAppData({ history: [] });
    };

    const activeTab = appData.tabs.find(
        (tab) => tab.id === appData.activeTabId,
    );
    const activeRequest = activeTab?.request;

    const createCollection = (name: string) => {
        const newCollection = {
            id: crypto.randomUUID(),
            name: name,
            requests: [],
        };
        updateAppData({ collections: [...appData.collections, newCollection] });
    };

    const renameCollection = (id: string, name: string) => {
        const updatedCollections = appData.collections.map((collection) =>
            collection.id === id ? { ...collection, name: name } : collection,
        );
        updateAppData({ collections: updatedCollections });
    };

    const deleteCollection = (id: string) => {
        const updatedCollections = appData.collections.filter(
            (collection) => collection.id !== id,
        );
        updateAppData({ collections: updatedCollections });
    };

    const addRequestToCollection = (
        collectionId: string,
        request: RequestObj,
    ) => {
        const updatedCollections = appData.collections.map((collection) =>
            collection.id === collectionId
                ? { ...collection, requests: [...collection.requests, request] }
                : collection,
        );
        updateAppData({ collections: updatedCollections });
    };

    const removeRequestFromCollection = (
        collectionId: string,
        requestIndex: number,
    ) => {
        const updatedCollections = appData.collections.map((collection) =>
            collection.id === collectionId
                ? {
                      ...collection,
                      requests: collection.requests.filter(
                          (_, index) => index !== requestIndex,
                      ),
                  }
                : collection,
        );
        updateAppData({ collections: updatedCollections });
    };

    const addNewTab = () => {
        const index = parseInt(appData.tabs[appData.tabs.length - 1]?.title.split(" ")[1]) + 1;
        const newTab: Tab = {
            id: crypto.randomUUID(),
            title: `Tab ${index}`,
            request: {
                method: "GET",
                fullUrl: "",
                params: [{ id: "1", key: "", value: "", enabled: false }],
                headers: [{ id: "1", key: "", value: "", enabled: false }],
                body: "",
            },
        };
        updateAppData({ tabs: [...appData.tabs, newTab], activeTabId: newTab.id });
    };

    const switchTab = (tabId: string) => {
        updateAppData({ activeTabId: tabId });
        resetResponse();
    };

    const closeTab = (tabId: string) => {
        if (appData.tabs.length === 1) return;
        let index = ((appData.tabs.findIndex((tab) => tab.id === tabId)) - 1);
        index = index < 0 ? 0 : index;
        const updatedTabs = appData.tabs.filter((tab) => tab.id !== tabId);
        updateAppData({ tabs: updatedTabs, activeTabId: updatedTabs[index].id });
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                history={appData.history}
                collections={appData.collections}
                onRestore={restoreRequest}
                onClear={clearHistory}
                onResetResponse={resetResponse}
                onCreateCollection={createCollection}
                onRenameCollection={renameCollection}
                onDeleteCollection={deleteCollection}
                onRemoveRequestFromCollection={removeRequestFromCollection}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <TabDiv
                    tabs={appData.tabs}
                    activeTabId={appData.activeTabId}
                    onAddTab={addNewTab}
                    onSwitchTab={switchTab}
                    onCloseTab={closeTab}
                />

                <div className="flex min-h-0 flex-1 flex-col">
                    <RequestDiv
                        onSendRequest={sendRequest}
                        onResetResponse={resetResponse}
                        activeRequest={activeRequest}
                        onRestore={restoreRequest}
                        onSaveToCollection={addRequestToCollection}
                        collections={appData.collections}
                    />
                    <ResponseViewer response={response} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default App;
