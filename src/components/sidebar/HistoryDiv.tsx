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
    const getMethodColors = (method: string) => {
        switch (method) {
            case "GET":
                return "bg-(--method-get)/20 text-(--method-get)";
            case "POST":
                return "bg-(--method-post)/20 text-(--method-post)";
            case "PUT":
                return "bg-(--method-put)/20 text-(--method-put)";
            case "DELETE":
                return "bg-(--method-delete)/20 text-(--method-delete)";
            case "PATCH":
                return "bg-(--method-patch)/20 text-(--method-patch)";
            default:
                return "bg-(--text-muted)/20 text-(--text-muted)";
        }
    };

    if (history.length === 0) {
        return (
            <div className="p-4 text-(--text-muted) text-sm">
                No history yet
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-center p-2 border-b border-(--border-color)">
                <button
                    onClick={onClear}
                    className="text-xs text-(--danger) hover:text-(--danger-hover)"
                >
                    Clear History
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => (
                            onRestore(item.request),
                            onResetResponse()
                        )}
                        className="cursor-pointer hover:bg-(--bg-hover) p-2 rounded text-sm transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-mono text-xs px-1.5 py-0.5 rounded ${getMethodColors(
                                    item.request.method,
                                )}`}
                            >
                                {item.request.method}
                            </span>
                            <span className="text-(--text-secondary) truncate flex-1">
                                {item.request.fullUrl}
                            </span>
                        </div>
                        <div className="text-xs text-(--text-muted) mt-0.5">
                            {new Date(item.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
