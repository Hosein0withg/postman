import { useState } from "react";
import type { HttpMethod, Request, Collection } from "../../../type";

interface RequestBarProps {
    method: HttpMethod;
    setMethod: (method: HttpMethod) => void;
    fullUrl: string;
    setUrl: (url: string) => void;
    onSend: () => void;
    onReset: () => void;
    collections: Collection[];
    localRequest: Request;
    onSaveToCollection: (collectionId: string, request: Request) => void;
}

function RequestBar({
    method,
    setMethod,
    fullUrl,
    setUrl,
    onSend,
    onReset,
    collections,
    localRequest,
    onSaveToCollection,
}: RequestBarProps) {
    const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    const [selectedCollectionId, setSelectedCollectionId] =
        useState<string>("");

    const handleSaveToCollection = () => {
        if (!selectedCollectionId) {
            alert("Please select a collection");
            return;
        }
        onSaveToCollection(selectedCollectionId, localRequest);
    };

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-(--bg-secondary) border-b border-(--border-color) shrink-0 overflow-x-auto overflow-y-hidden">            <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="bg-(--bg-tertiary) text-(--text-secondary) text-sm px-3 py-1.5 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) appearance-none cursor-pointer min-w-22.5"
            >
                {methods.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={fullUrl}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Enter request URL"
                className="flex-1 min-w-50 bg-(--bg-input) text-(--text-secondary) text-sm px-3 py-1.5 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) placeholder:text-(--text-muted)"            />

            <button
                onClick={onSend}
                className="flex items-center gap-2 bg-(--accent) hover:bg-(--accent-hover) text-(--text-on-accent) text-sm font-medium px-4 py-1.5 rounded transition-colors shrink-0"
            >
                Send
            </button>

            <button
                onClick={onReset}
                className="flex items-center gap-2 bg-(--danger) hover:bg-(--danger-hover) text-(--text-on-accent) text-sm font-medium px-4 py-1.5 rounded transition-colors shrink-0"
            >
                Reset
            </button>

            <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="bg-(--bg-tertiary) text-(--text-secondary) w-fit text-sm px-2 py-1 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) shrink-0"
            >
                <option value="">Save to Collection</option>
                {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                        {col.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleSaveToCollection}
                className="flex items-center gap-2 bg-(--accent) hover:bg-(--accent-hover) text-(--text-on-accent) text-sm font-medium px-4 py-1.5 rounded transition-colors shrink-0"
            >
                Save
            </button>
        </div>
    );
}

export default RequestBar;
