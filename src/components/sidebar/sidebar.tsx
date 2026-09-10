import { useState } from "react";
import type { RefObject } from "react";
import HistoryDiv from "./HistoryDiv";
import CollectionDiv from "./CollectionDiv";
import type { HistoryItem, Request, Collection } from "../../type";
import { useTheme } from "../../hooks/useTheme";

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
    isSidebarOpen: boolean;
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
    isSidebarOpen,
}: SidebarProps) {
    const [activeView, setActiveView] = useState<"history" | "collections">(
        "collections",
    );
    const { theme, toggleTheme } = useTheme();

    return (
        <aside
            className={`bg-(--bg-secondary) flex flex-col shrink-0 overflow-hidden
                transition-[width] duration-300 ease-in-out
                ${
                    isSidebarOpen
                        ? "w-[min(280px,80vw)] border-r border-(--border-color)"
                        : "w-0 border-r-0"
                }`}
        >
            <div className="w-[min(280px,80vw)] h-full flex flex-col">
                <button
                    onClick={toggleTheme}
                    className="mx-auto flex justify-around p-2 w-fit rounded hover:bg-(--bg-hover) transition-colors text-(--text-secondary)"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>
                <nav className="flex p-3 space-y-1">
                    <button
                        onClick={() => setActiveView("collections")}
                        className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                            activeView === "collections"
                                ? "text-(--text-primary) border-b-2 border-(--accent)"
                                : "text-(--text-muted) hover:text-(--text-secondary)"
                        }`}
                    >
                        Collections
                    </button>
                    <button
                        onClick={() => setActiveView("history")}
                        className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                            activeView === "history"
                                ? "text-(--text-primary) border-b-2 border-(--accent)"
                                : "text-(--text-muted) hover:text-(--text-secondary)"
                        }`}
                    >
                        History
                    </button>
                </nav>
                {activeView === "collections" && (
                    <div className="flex gap-2 px-3 py-2 border-b border-(--border-color) shrink-0">
                        <button
                            onClick={onExportCollections}
                            className="flex-1 bg-(--accent) hover:bg-(--accent-hover) text-(--text-on-accent) text-xs font-medium px-2 py-1 rounded transition-colors"
                        >
                            Export
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-(--bg-tertiary) hover:bg-(--bg-hover) text-(--text-secondary) text-xs font-medium px-2 py-1 rounded transition-colors border border-(--border-color)"
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
            </div>
        </aside>
    );
}

export default Sidebar;
