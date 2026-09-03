import { useState } from "react";
import type { ResponseData, ResponseBody } from "../../../app/type";

interface ResponseViewerProps {
    response?: ResponseData;
    isLoading?: boolean;
}

function ResponseViewer({ response, isLoading = false }: ResponseViewerProps) {
    const [activeTab, setActiveTab] = useState<"body" | "headers">("body");

    const formatBody = (body: ResponseBody): string => {
        if (body === null || body === undefined) return "No response body";
        if (typeof body === "string") return body;
        if (typeof body === "object") {
            try {
                return JSON.stringify(body, null, 2);
            } catch {
                return String(body);
            }
        }
        return String(body);
    };

    const formatHeaders = (headers: Record<string, string>) => {
        if (response === undefined) return null;
        return Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex gap-4 text-sm">
                <span className="w-32 text-gray-400 font-mono">{key}</span>
                <span className="text-gray-300 break-all">{value}</span>
            </div>
        ));
    };

    if (isLoading) {
        return (
            <section className="flex flex-col bg-[#0d0d0d] border-t border-[#2a2a2a] h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-[#141414] border-b border-[#2a2a2a] shrink-0">
                    <span className="text-sm font-medium text-gray-300">
                        Response
                    </span>
                    <span className="ml-3 text-sm text-yellow-400">
                        Loading...
                    </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin"></div>
                        <p>Sending request...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!response) {
        return (
            <section className="flex flex-col bg-[#0d0d0d] border-t border-[#2a2a2a] h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-[#141414] border-b border-[#2a2a2a] shrink-0">
                    <span className="text-sm font-medium text-gray-300">
                        Response
                    </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>Send a request to see the response.</p>
                </div>
            </section>
        );
    }
    if (response.error) {
        return (
            <section className="flex flex-col bg-[#0d0d0d] border-t border-[#2a2a2a] h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-[#141414] border-b border-[#2a2a2a] shrink-0">
                    <span className="text-sm font-medium text-gray-300">
                        Response
                    </span>
                    <span className="ml-3 text-sm text-red-400">Error</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-red-400 p-4">
                    <p className="text-center">{response.error}</p>
                </div>
            </section>
        );
    }

    const statusColor =
        response.status >= 200 && response.status < 300
            ? "text-green-400"
            : response.status >= 400
              ? "text-red-400"
              : "text-yellow-400";

    return (
        <section className="flex flex-col bg-[#0d0d0d] border-t border-[#2a2a2a] h-65 shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#2a2a2a] shrink-0">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium text-gray-300">
                        Response
                    </span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                        {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-gray-500">
                        {response.time} ms
                    </span>
                    <span className="text-xs text-gray-500">
                        {response.size < 1024
                            ? `${response.size} B`
                            : `${(response.size / 1024).toFixed(1)} KB`}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab("body")}
                        className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                            activeTab === "body"
                                ? "text-white bg-[#2a2a2a]"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Body
                    </button>
                    <button
                        onClick={() => setActiveTab("headers")}
                        className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                            activeTab === "headers"
                                ? "text-white bg-[#2a2a2a]"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Headers
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "body" ? (
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-all">
                        {formatBody(response.body)}
                    </pre>
                ) : (
                    <div className="space-y-1">
                        {formatHeaders(response.headers)}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ResponseViewer;
