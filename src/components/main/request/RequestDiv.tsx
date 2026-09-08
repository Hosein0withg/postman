import { useMemo, useEffect, useReducer, useState } from "react";
import RequestBar from "./RequestBar";
import RequestConfig from "./RequestConfig";
import {
    type Request,
    type Header,
    type Parameter,
    type HttpMethod,
    type Collection,
} from "../../../type";

interface RequestProps {
    onSendRequest: (request: Request) => void;
    onResetResponse: () => void;
    activeRequest?: Request | undefined;
    onSaveToCollection: (collectionId: string, request: Request) => void;
    collections: Collection[];
    onUpdateActiveTabRequest: (request: Request) => void;
}

type State = Request;

type Action = { type: "SET_REQUEST"; payload: Request } | { type: "RESET" };

const defaultRequest: Request = {
    method: "GET",
    fullUrl: "",
    params: [{ id: "1", key: "", value: "", enabled: false }],
    headers: [{ id: "1", key: "", value: "", enabled: false }],
    body: "",
};

function requestReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_REQUEST":
            return action.payload;
        case "RESET":
            return defaultRequest;
        default:
            return state;
    }
}

function RequestDiv({
    onSendRequest,
    onResetResponse,
    activeRequest,
    onSaveToCollection,
    collections,
    onUpdateActiveTabRequest,
}: RequestProps) {
    const [activeConfigTab, setActiveConfigTab] = useState<
        "params" | "headers" | "body"
    >("headers");
    const [localRequest, dispatch] = useReducer(
        requestReducer,
        activeRequest || defaultRequest,
    );

    useEffect(() => {
        if (activeRequest) {
            dispatch({ type: "SET_REQUEST", payload: activeRequest });
        }
    }, [activeRequest]);
    const { method, fullUrl: url, params, headers, body } = localRequest;

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

    const updateRequest = (updates: Partial<Request>) => {
        const newRequest = { ...localRequest, ...updates };
        dispatch({ type: "SET_REQUEST", payload: newRequest });
        onUpdateActiveTabRequest(newRequest);
    };

    const handleMethodChange = (newMethod: HttpMethod) =>
        updateRequest({ method: newMethod });
    const handleUrlChange = (newUrl: string) =>
        updateRequest({ fullUrl: newUrl });
    const handleParamsChange = (newParams: Parameter[]) =>
        updateRequest({ params: newParams });
    const handleHeadersChange = (newHeaders: Header[]) =>
        updateRequest({ headers: newHeaders });
    const handleBodyChange = (newBody: string) =>
        updateRequest({ body: newBody });

    const handleSendRequest = () => {
        if (
            url.toLocaleLowerCase().startsWith("http:") ||
            url.toLocaleLowerCase().startsWith("https:")
        ) {
            const requestData: Request = {
                method,
                fullUrl,
                params: params,
                headers,
                body,
            };
            onSendRequest(requestData);
        } else {
            alert("Invalid URL");
        }
    };

    const handleResetRequest = () => {
        dispatch({ type: "RESET" });
        onUpdateActiveTabRequest(defaultRequest);
        onResetResponse();
    };

    return (
        <main className="flex min-h-0 flex-1 flex-col bg-[#0d0d0d]">
            <RequestBar
                method={method}
                setMethod={handleMethodChange}
                fullUrl={fullUrl}
                setUrl={handleUrlChange}
                onSend={handleSendRequest}
                onReset={handleResetRequest}
                collections={collections}
                localRequest={localRequest}
                onSaveToCollection={onSaveToCollection}
            />

            <RequestConfig
                activeTab={activeConfigTab}
                onTabChange={setActiveConfigTab}
                params={params}
                setParams={handleParamsChange}
                headers={headers}
                setHeaders={handleHeadersChange}
                body={body}
                setBody={handleBodyChange}
            />
        </main>
    );
}

export default RequestDiv;
