import { useState } from "react";
import type { ResponseData, ResponseBody } from "../../../type";

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
                <span className="w-32 text-(--text-muted) font-mono">
                    {key}
                </span>
                <span className="text-(--text-secondary) break-all">
                    {value}
                </span>
            </div>
        ));
    };

    if (isLoading) {
        return (
            <section className="flex flex-col bg-(--bg-primary) border-t border-(--border-color) h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-(--bg-secondary) border-b border-(--border-color) shrink-0">
                    <span className="text-sm font-medium text-(--text-secondary)">
                        Response
                    </span>
                    <span className="ml-3 text-sm text-(--status-warning)">
                        Loading...
                    </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-(--text-muted)">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
                        <p>Sending request...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!response) {
        return (
            <section className="flex flex-col bg-(--bg-primary) border-t border-(--border-color) h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-(--bg-secondary) border-b border-(--border-color) shrink-0">
                    <span className="text-sm font-medium text-(--text-secondary)">
                        Response
                    </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-(--text-muted)">
                    <p>Send a request to see the response.</p>
                </div>
            </section>
        );
    }

    const statusColor =
        response.status >= 200 && response.status < 300
            ? "text-(--status-success)"
            : response.status >= 400
              ? "text-(--status-error)"
              : "text-(--status-warning)";
    const badgeColor =
        response.status >= 200 && response.status < 300
            ? "bg-(--status-success)/20 text-(--status-success) border-(--status-success)/30"
            : response.status >= 400
              ? "bg-(--status-error)/20 text-(--status-error) border-(--status-error)/30"
              : "bg-(--status-warning)/20 text-(--status-warning) border-(--status-warning)/30";

    if (response.error) {
        return (
            <section className="flex flex-col bg-(--bg-primary) border-t border-(--border-color) h-65 shrink-0">
                <div className="flex items-center px-4 py-2 bg-(--bg-secondary) border-b border-(--bg-hover) shrink-0">
                    <span className="text-sm font-medium text-(--text-secondary)">
                        Response
                    </span>

                    {response.status > 0 && (
                        <div
                            className={`ml-3 flex items-center gap-2 px-2.5 py-0.5 rounded border ${badgeColor}`}
                        >
                            <span
                                className={`text-sm font-medium ${statusColor}`}
                            >
                                {response.status} {response.statusText}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-center text-(--status-error) p-4">
                    <p className="text-center">{response.error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col bg-(--bg-primary) border-t border-(--bg-hover) h-65 shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-(--bg-secondary) border-b border-(--border-color) shrink-0">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium text-(--text-secondary)">
                        Response
                    </span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                        {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-(--text-muted)">
                        {response.time} ms
                    </span>
                    <span className="text-xs text-(--text-muted)">
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
                                ? "text-(--text-primary) bg-(--bg-hover)"
                                : "text-(--text-muted) hover:text-(--text-secondary)"
                        }`}
                    >
                        Body
                    </button>
                    <button
                        onClick={() => setActiveTab("headers")}
                        className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                            activeTab === "headers"
                                ? "text-(--text-primary) bg-(--bg-hover)"
                                : "text-(--text-muted) hover:text-(--text-secondary)"
                        }`}
                    >
                        Headers
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "body" ? (
                    <pre className="text-sm text-(--text-secondary) font-mono whitespace-pre-wrap break-all">
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
