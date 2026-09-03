import { useState } from "react";
import Sidebar from "../components/sidebar/sidebar.tsx";
import Tabs from "../components/main/tab/tab.tsx";
import Request from "../components/main/request/Request.tsx";
import ResponseViewer from "../components/main/response/ResponstViewer.tsx";
import type { Request as RequestType, ResponseData } from "../app/type";

function App() {
    const [response, setResponse] = useState<ResponseData | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(false);
    const sendRequest = async (requestData: RequestType) => {
        setIsLoading(true);
        setResponse(undefined);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setResponse({
                status: 300,
                statusText: "OK",
                headers: { "content-type": "application/json" },
                body: {
                    message: "Request received!",
                    data: requestData,
                },
                time: 123,
                size: 456,
            });
        } catch (error) {
            console.log(error);
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
                    <Request onSendRequest={sendRequest} />
                    <ResponseViewer response={response} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default App;
