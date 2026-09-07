import { useState } from "react";
import HistoryDiv from "./HistoryDiv";
import CollectionDiv from "./CollectionDiv";
import type { HistoryItem, Request, Collection } from "../../type";

interface SidebarProps {
    history: HistoryItem[];
    collections: Collection[];
    onRestore: (request: Request) => void;
    onClear: () => void;
    onResetResponse: () => void;
    onCreateCollection: (name: string) => void;
    onRenameCollection: (id: string, name: string) => void;
    onDeleteCollection: (id: string) => void;
    onRemoveRequestFromCollection: (
        collectionId: string,
        requestIndex: number,
    ) => void;
}

function Sidebar({
    history,
    collections,
    onRestore,
    onClear,
    onResetResponse,
    onCreateCollection,
    onRenameCollection,
    onDeleteCollection,
    onRemoveRequestFromCollection,
}: SidebarProps) {
    const [activeView, setActiveView] = useState<"history" | "collections">(
        "collections",
    );

    return (
        <aside className="w-70 bg-[#141414] border-r border-[#2a2a2a] flex flex-col shrink-0">
            <nav className="flex p-3 space-y-1">
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
            </nav>
            <div className="flex-1 overflow-hidden">
                {activeView === "history" ? (
                    <HistoryDiv
                        history={history}
                        onRestore={onRestore}
                        onClear={onClear}
                        onResetResponse={onResetResponse}
                    />
                ) : (
                    <CollectionDiv
                        collections={collections}
                        onCreate={onCreateCollection}
                        onRename={onRenameCollection}
                        onDelete={onDeleteCollection}
                        onRemoveRequest={onRemoveRequestFromCollection}
                        onLoadRequest={onRestore}
                    />
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
