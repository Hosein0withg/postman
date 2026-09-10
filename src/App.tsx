import { useState, useEffect, useRef } from "react";
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
    Collection,
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
        const loaded = loadAppData();
        return {
            ...loaded,
            tabs: [
                {
                    id: "tab_1",
                    title: "Tab 1",
                    request: {
                        method: "GET",
                        fullUrl: "",
                        params: [],
                        headers: [],
                        body: "",
                    },
                },
            ],
            activeTabId: "tab_1",
        };
    });
    const [tabResponses, setTabResponses] = useState<
        Record<string, ResponseData | undefined>
    >({});
    useEffect(() => {
        autoSave.schedule(appData);
        return () => {
            autoSave.flush();
        };
    }, [appData]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    const updateAppData = (newData: Partial<AppData>) => {
        setAppData((prevData) => ({ ...prevData, ...newData }));
    };

    const sendRequest = async (requestData: RequestObj) => {
        setIsLoading(true);
        setResponse(undefined);
        try {
            const result = await sendApiRequest(requestData);
            setResponse(result);
            setTabResponses((prev) => ({
                ...prev,
                [appData.activeTabId]: result,
            }));
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
        setTabResponses((prev) => ({
            ...prev,
            [appData.activeTabId]: undefined,
        }));
        autoSave.cancel();
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
        const index =
            parseInt(
                appData.tabs[appData.tabs.length - 1]?.title.split(" ")[1],
            ) + 1;
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
        updateAppData({
            tabs: [...appData.tabs, newTab],
            activeTabId: newTab.id,
        });
        setResponse(undefined);
    };

    const switchTab = (tabId: string) => {
        if (appData.activeTabId) {
            setTabResponses((prev) => ({
                ...prev,
                [appData.activeTabId]: response,
            }));
        }
        updateAppData({ activeTabId: tabId });
        setResponse(tabResponses[tabId] ?? undefined);
    };

    const closeTab = (tabId: string) => {
        if (appData.tabs.length === 1) return;
        setTabResponses((prev) => {
            const newResponses = { ...prev };
            delete newResponses[tabId];
            return newResponses;
        });
        let index = appData.tabs.findIndex((tab) => tab.id === tabId) - 1;
        index = index < 0 ? 0 : index;
        const updatedTabs = appData.tabs.filter((tab) => tab.id !== tabId);
        updateAppData({
            tabs: updatedTabs,
            activeTabId: updatedTabs[index].id,
        });
    };

    const updateActiveTabRequest = (request: RequestObj) => {
        const updatedTabs = appData.tabs.map((tab) =>
            tab.id === appData.activeTabId ? { ...tab, request } : tab,
        );
        updateAppData({ tabs: updatedTabs });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportCollections = () => {
        const exportData = {
            version: "1.0",
            collections: appData.collections,
        };
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `collections_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importCollections = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (!isValidImportData(data)) {
                    alert("Invalid import data");
                    return;
                }
                const mergedCollections = mergeCollections(
                    appData.collections,
                    data.collections,
                );
                updateAppData({ collections: mergedCollections });
                alert(
                    `imported ${data.collections.length} collections successfully!`,
                );
            } catch (error) {
                alert("Failed to import collections");
                console.error(error);
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    };

    const mergeCollections = (
        existing: Collection[],
        imported: Collection[],
    ): Collection[] => {
        const existingMap = new Map(existing.map((coll) => [coll.id, coll]));
        for (const importedColl of imported) {
            if (!existingMap.has(importedColl.id)) {
                existingMap.set(importedColl.id, importedColl);
            }
        }
        return Array.from(existingMap.values());
    };

    const isValidImportData = (
        data: unknown,
    ): data is { version: string; collections: Collection[] } => {
        if (!data || typeof data !== "object") return false;

        const obj = data as Record<string, unknown>;

        // Check version
        if (typeof obj.version !== "string") return false;

        // Check collections
        if (!Array.isArray(obj.collections)) return false;

        // Check each collection
        return obj.collections.every((coll) => {
            if (!coll || typeof coll !== "object") return false;

            const c = coll as Record<string, unknown>;

            // Check basic collection fields
            if (typeof c.id !== "string") return false;
            if (typeof c.name !== "string") return false;
            if (!Array.isArray(c.requests)) return false;

            // Check each request
            return c.requests.every((req) => {
                if (!req || typeof req !== "object") return false;

                const r = req as Record<string, unknown>;

                // Check basic request fields
                if (typeof r.method !== "string") return false;
                if (typeof r.fullUrl !== "string") return false;
                if (!Array.isArray(r.params)) return false;
                if (!Array.isArray(r.headers)) return false;
                if (typeof r.body !== "string") return false;

                // Check params
                const allParamsValid = r.params.every((param) => {
                    if (!param || typeof param !== "object") return false;
                    const p = param as Record<string, unknown>;
                    return (
                        typeof p.id === "string" &&
                        typeof p.key === "string" &&
                        typeof p.value === "string" &&
                        typeof p.enabled === "boolean"
                    );
                });

                // Check headers
                const allHeadersValid = r.headers.every((header) => {
                    if (!header || typeof header !== "object") return false;
                    const h = header as Record<string, unknown>;
                    return (
                        typeof h.id === "string" &&
                        typeof h.key === "string" &&
                        typeof h.value === "string" &&
                        typeof h.enabled === "boolean"
                    );
                });

                return allParamsValid && allHeadersValid;
            });
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-(--bg-primary)">
            <Sidebar
                history={appData.history}
                collections={appData.collections}
                onRestore={updateActiveTabRequest}
                onClear={clearHistory}
                onResetResponse={resetResponse}
                onCreateCollection={createCollection}
                onRenameCollection={renameCollection}
                onDeleteCollection={deleteCollection}
                onRemoveRequestFromCollection={removeRequestFromCollection}
                onExportCollections={exportCollections}
                onImportCollections={importCollections}
                fileInputRef={fileInputRef}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <TabDiv
                    tabs={appData.tabs}
                    activeTabId={appData.activeTabId}
                    onAddTab={addNewTab}
                    onSwitchTab={switchTab}
                    onCloseTab={closeTab}
                    onToggleSidebar={toggleSidebar}
                />

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <RequestDiv
                        onSendRequest={sendRequest}
                        onResetResponse={resetResponse}
                        activeRequest={activeRequest}
                        onSaveToCollection={addRequestToCollection}
                        collections={appData.collections}
                        onUpdateActiveTabRequest={updateActiveTabRequest}
                    />
                    <ResponseViewer response={response} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default App;
