import { useState } from "react";
import type { RefObject } from "react";
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
    onExportCollections: () => void;
    onImportCollections: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
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
    onExportCollections,
    onImportCollections,
    fileInputRef,
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
            {activeView === "collections" && (
                <div className="flex gap-2 px-3 py-2 border-b border-[#2a2a2a] shrink-0">
                    <button
                        onClick={onExportCollections}
                        className="flex-1 bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                    >
                        Export
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                    >
                        Import
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        onChange={onImportCollections}
                        className="hidden"
                    />
                </div>
            )}
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
