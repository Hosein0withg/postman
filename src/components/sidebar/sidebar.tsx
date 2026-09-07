import { useState } from "react";
import HistoryDiv from "./HistoryDiv";
import type { HistoryItem, Request } from "../../type";

interface SidebarProps {
    history: HistoryItem[];
    onRestore: (request: Request) => void;
    onClear: () => void;
    onResetResponse: () => void;
}

// const MIN_WIDTH = 150;
// const MAX_WIDTH = 350;
// const DEFAULT_WIDTH = 250;

function Sidebar({ history, onRestore, onClear, onResetResponse }: SidebarProps) {
    const [activeView, setActiveView] = useState<"history" | "collections">(
        "history",
    );
    // const [isDragging, setIsDragging] = useState(false);
    // const sidebarRef = useRef<HTMLDivElement>(null);

    // const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     setIsDragging(true);
    // };

    return (
        <aside className="w-60 bg-[#141414] border-r border-[#2a2a2a] flex flex-col shrink-0">
            <nav className="flex-1 p-3 space-y-1">
                <button
                    onClick={() => setActiveView("history")}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                        activeView === "history"
                            ? "text-white border-b-2 border-[#6c63ff]"
                            : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveView("collections")}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                        activeView === "collections"
                            ? "text-white border-b-2 border-[#6c63ff]"
                            : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                    Collections
                </button>
            </nav>
            {activeView === "history" && (
                <HistoryDiv
                    history={history}
                    onRestore={onRestore}
                    onClear={onClear}
                    onResetResponse={onResetResponse}
                />
            )}
            {activeView === "collections" && <div></div>}
        </aside>
    );
}

export default Sidebar;
