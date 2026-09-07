import { useState } from "react";
import type { Collection, Request } from "../../type";

interface CollectionDivProps {
    collections: Collection[];
    onCreate: (name: string) => void;
    onRename: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onRemoveRequest: (collectionId: string, requestIndex: number) => void;
    onLoadRequest: (request: Request) => void;
}

export default function CollectionDiv({
    collections,
    onCreate,
    onRename,
    onDelete,
    onRemoveRequest,
    onLoadRequest,
}: CollectionDivProps) {
    const [newCollectionName, setNewCollectionName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleCreate = () => {
        if (newCollectionName.trim()) {
            onCreate(newCollectionName);
            setNewCollectionName("");
        }
    };

    const handleRenameStart = (collection: Collection) => {
        setEditingId(collection.id);
        setEditingName(collection.name);
    };

    const handleRenameSave = (id: string) => {
        if (editingName.trim()) {
            onRename(id, editingName.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="flex flex-col h-full p-2">
            <div className="flex gap-1 mb-2">
                <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="New collection name"
                    className="flex-1 bg-[#1e1e1e] text-white text-sm px-2 py-1 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff]"
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <button
                    onClick={handleCreate}
                    className="px-3 py-1 bg-[#6c63ff] text-white text-sm rounded hover:bg-[#5a52e0]"
                >
                    Create
                </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
                {collections.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">
                        No collections yet
                    </div>
                )}
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className="border border-[#2a2a2a] rounded"
                    >
                        <div className="flex items-center justify-between p-2 hover:bg-[#252525] cursor-pointer">
                            <div className="flex items-center gap-2 flex-1">
                                <button
                                    onClick={() =>
                                        setExpandedId(
                                            expandedId === collection.id
                                                ? null
                                                : collection.id,
                                        )
                                    }
                                    className="text-gray-400 hover:text-white"
                                >
                                    {expandedId === collection.id ? "▼" : "▶"}
                                </button>
                                {editingId === collection.id ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)
                                        }
                                        onBlur={() =>
                                            handleRenameSave(collection.id)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleRenameSave(collection.id)
                                        }
                                        className="bg-[#1e1e1e] text-white text-sm px-1 py-0.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff]"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-sm text-gray-300 truncate flex-1">
                                        {collection.name}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        handleRenameStart(collection)
                                    }
                                    className="text-xs text-gray-400 hover:text-white px-1"
                                    title="Rename"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(collection.id)}
                                    className="text-xs text-gray-400 hover:text-red-400 px-1"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {expandedId === collection.id && (
                            <div className="p-2 pt-0 border-t border-[#2a2a2a] space-y-1">
                                {collection.requests.length === 0 && (
                                    <div className="text-gray-500 text-xs py-1">
                                        No requests
                                    </div>
                                )}
                                {collection.requests.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between hover:bg-[#1a1a1a] p-1 rounded"
                                    >
                                        <button
                                            onClick={() => onLoadRequest(req)}
                                            className="flex-1 text-left text-xs text-gray-300 truncate"
                                        >
                                            {req.method} {req.fullUrl}
                                        </button>
                                        <button
                                            onClick={() =>
                                                onRemoveRequest(
                                                    collection.id,
                                                    index,
                                                )
                                            }
                                            className="text-xs text-gray-500 hover:text-red-400"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
