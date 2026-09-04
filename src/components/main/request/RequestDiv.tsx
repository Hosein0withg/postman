import { useState, useMemo } from "react";
import RequestBar from "./RequestBar";
import RequestConfig from "./RequestConfig";
import {
    type Request,
    type Header,
    type Parameter,
    type HttpMethod,
} from "../../../type";

interface RequestProps {
    onSendRequest: (request: Request) => void;
}

function RequestDiv({ onSendRequest }: RequestProps) {
    const [activeConfigTab, setActiveConfigTab] = useState<
        "params" | "headers" | "body"
    >("headers");

    const [method, setMethod] = useState<HttpMethod>("GET");
    const [url, setUrl] = useState<string>("");
    const [params, setParams] = useState<Parameter[]>([
        { id: "1", key: "", value: "", enabled: false },
    ]);
    const [headers, setHeaders] = useState<Header[]>([
        { id: "1", key: "", value: "", enabled: false },
    ]);
    const [body, setBody] = useState<string>("");

    const fullUrl: string = useMemo(() => {
        if (!url) return "";

        const enabledParams = params.filter((p) => p.enabled && p.key.trim());
        if (enabledParams.length === 0) return url;

        try {
            const urlObj = new URL(url);
            enabledParams.forEach((p) => {
                urlObj.searchParams.append(p.key, p.value);
            });
            return urlObj.toString();
        } catch {
            return url;
        }
    }, [url, params]);

    const handleSendRequest = () => {
        if (
            url.toLocaleLowerCase().startsWith("http:") ||
            url.toLocaleLowerCase().startsWith("https:")
        ) {
            onSendRequest({
                method,
                fullUrl,
                params: params,
                headers,
                body,
            });
        } else {
            alert("Invalid URL");
        }
    };

    return (
        <main className="flex min-h-0 flex-1 flex-col bg-[#0d0d0d]">
            <RequestBar
                method={method}
                setMethod={setMethod}
                fullUrl={fullUrl}
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

export default RequestDiv;
