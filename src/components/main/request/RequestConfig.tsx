import { useState } from "react";
import type { Header, Parameter } from "../../../types/type";

interface RequestConfigProps {
    activeTab: "params" | "headers" | "body";
    onTabChange: (tab: "params" | "headers" | "body") => void;
}

interface ConfigItem {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

function RequestConfig({ activeTab, onTabChange }: RequestConfigProps) {
    const [headers, setHeaders] = useState<Header[]>([
        { id: "1", key: "", value: "", enabled: true },
    ]);

    const [params, setParams] = useState<Parameter[]>([
        { id: "1", key: "", value: "", enabled: true },
    ]);

    const addItem = <T extends ConfigItem>(
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
        setItems((prevItems) => [
            ...prevItems,
            {
                id: Date.now().toString(),
                key: "",
                value: "",
                enabled: true,
            } as T,
        ]);
    };

    const updateItem = <T extends ConfigItem>(
        id: string,
        field: keyof T,
        value: string | boolean,
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item,
            ),
        );
    };

    const removeItem = <T extends ConfigItem>(
        id: string,
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleItem = <T extends ConfigItem>(
        id: string,
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, enabled: !item.enabled } : item,
            ),
        );
    };

    const renderItems = <T extends ConfigItem>(
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        placeholder: string,
        addLabel: string,
    ) => (
        <div className="p-3 space-y-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-[64px,1fr,1fr] gap-2 items-center"
                >
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => toggleItem(item.id, items, setItems)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                item.enabled
                                    ? "border-[#6c63ff] bg-[#6c63ff] text-white"
                                    : "border-[#3a3a3a] text-transparent"
                            }`}
                        >
                            {item.enabled ? "✔" : ""}
                        </button>

                        <button
                            onClick={() => removeItem(item.id, items, setItems)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded text-base"
                            title={`Remove ${placeholder}`}
                        >
                            🗑️
                        </button>
                    </div>

                    <input
                        type="text"
                        value={item.key}
                        onChange={(e) =>
                            updateItem(
                                item.id,
                                "key",
                                e.target.value,
                                items,
                                setItems,
                            )
                        }
                        placeholder={placeholder}
                        className="bg-[#1e1e1e] text-white text-sm px-2 py-1.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] placeholder:text-gray-500"
                    />

                    <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                            updateItem(
                                item.id,
                                "value",
                                e.target.value,
                                items,
                                setItems,
                            )
                        }
                        placeholder={placeholder}
                        className="bg-[#1e1e1e] text-white text-sm px-2 py-1.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] placeholder:text-gray-500"
                    />
                </div>
            ))}

            <button
                onClick={() => addItem(setItems)}
                className="flex items-center gap-1.5 text-sm text-[#6c63ff] hover:text-[#8a84ff] transition-colors mt-1"
            >
                + {addLabel}
            </button>
        </div>
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-0.5 px-3 pt-2 shrink-0 bg-[#0d0d0d]">
                {(["params", "headers", "body"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`px-3 py-1.5 text-xs font-medium capitalize rounded-t transition-colors ${
                            activeTab === tab
                                ? "text-white bg-[#1e1e1e]"
                                : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-b border-t-0 overflow-y-auto">
                {activeTab === "params" &&
                    renderItems(params, setParams, "key", "Add parameter")}
                {activeTab === "headers" &&
                    renderItems(headers, setHeaders, "key", "Add header")}
                {activeTab === "body" && (
                    <div className="p-3">
                        <textarea
                            placeholder="request body"
                            className="w-full h-32 bg-[#1e1e1e] text-white text-sm px-3 py-2 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] placeholder:text-gray-500 resize-none font-mono"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RequestConfig;
