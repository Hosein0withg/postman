import type { HistoryItem, Request } from "../../type.ts";

interface HistoryDivProps {
    history: HistoryItem[];
    onRestore: (request: Request) => void;
    onClear: () => void;
    onResetResponse: () => void;
}

export default function HistoryDiv({
    history,
    onRestore,
    onClear,
    onResetResponse,
}: HistoryDivProps) {
    if (history.length === 0) {
        return <div className="p-4 text-gray-500 text-sm">No history yet</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-center p-2 border-b border-[#2a2a2a]">
                <button
                    onClick={onClear}
                    className="text-xs text-red-400 hover:text-red-300"
                >
                    Clear History
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => (onRestore(item.request), onResetResponse())}
                        className="cursor-pointer hover:bg-[#252525] p-2 rounded text-sm transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                                    item.request.method === "GET"
                                        ? "bg-blue-500/20 text-blue-400"
                                        : item.request.method === "POST"
                                          ? "bg-green-500/20 text-green-400"
                                          : item.request.method === "PUT"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : item.request.method === "DELETE"
                                              ? "bg-red-500/20 text-red-400"
                                              : "bg-gray-500/20 text-gray-400"
                                }`}
                            >
                                {item.request.method}
                            </span>
                            <span className="text-gray-300 truncate flex-1">
                                {item.request.fullUrl}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
