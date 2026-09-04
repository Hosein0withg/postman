import { useState } from "react";
import Sidebar from "./components/sidebar/sidebar.tsx";
import Tabs from "./components/main/tab/tab.tsx";
import RequestDiv from "./components/main/request/RequestDiv.tsx";
import ResponseViewer from "./components/main/response/ResponstViewer.tsx";
import type { Request as RequestObj, ResponseData } from "./type.ts";
import { sendApiRequest } from "./services/apiService.ts";

function App() {
    const [response, setResponse] = useState<ResponseData | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async (requestData: RequestObj) => {
        setIsLoading(true);
        setResponse(undefined);
        try {
            setResponse(await sendApiRequest(requestData));
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

    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Tabs />

                <div className="flex min-h-0 flex-1 flex-col">
                    <RequestDiv onSendRequest={sendRequest} />
                    <ResponseViewer response={response} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default App;
