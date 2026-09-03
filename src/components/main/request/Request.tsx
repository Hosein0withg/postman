import { useState } from "react";
import RequestBar from "./RequestBar";
import RequestConfig from "./RequestConfig";
import { type Request as RequestType, type Header, type Parameter, type HttpMethod } from "../../../app/type";

interface RequestProps {
    onSendRequest: (request: RequestType) => void;
}

function Request({ onSendRequest }: RequestProps) {
    const [activeConfigTab, setActiveConfigTab] = useState<
        "params" | "headers" | "body"
    >("headers");

    const [method, setMethod] = useState<HttpMethod>("GET");
    const [url, setUrl] = useState<string>("");
    const [params, setParams] = useState<Parameter[]>([{ id: "1", key: "", value: "", enabled: true }]);
    const [headers, setHeaders] = useState<Header[]>([{ id: "1", key: "", value: "", enabled: true }]);
    const [body, setBody] = useState<string>("");

    const handleSendRequest = () => {
        onSendRequest({
            method,
            url,
            params: params,
            headers,
            body,
        });
    };

    return (
        <main className="flex min-h-0 flex-1 flex-col bg-[#0d0d0d]">
            <RequestBar
                method={method}
                setMethod={setMethod}
                url={url}
                setUrl={setUrl}
                onSend={handleSendRequest}
            />

            <RequestConfig
                activeTab={activeConfigTab}
                onTabChange={setActiveConfigTab}
                params={params}
                setParams={setParams}
                headers={headers}
                setHeaders={setHeaders}
                body={body}
                setBody={setBody}
            />
        </main>
    );
}

export default Request;
