import type { Header, Parameter } from "../../../type";

interface RequestConfigProps {
    activeTab: "params" | "headers" | "body";
    onTabChange: (tab: "params" | "headers" | "body") => void;
    params: Parameter[];
    setParams: (params: Parameter[]) => void;
    headers: Header[];
    setHeaders: (headers: Header[]) => void;
    body: string;
    setBody: (body: string) => void;
}

interface ConfigItem {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

function RequestConfig({
    activeTab,
    onTabChange,
    params,
    setParams,
    headers,
    setHeaders,
    body,
    setBody,
}: RequestConfigProps) {
    const addItem = <T extends ConfigItem>(
        setItems: (items: T[]) => void,
        currentItems: T[],
    ) => {
        const newItem = {
            id: crypto.randomUUID().toString(),
            key: "",
            value: "",
            enabled: true,
        } as T;
        setItems([...currentItems, newItem]);
    };

    const updateItem = <T extends ConfigItem>(
        id: string,
        field: keyof T,
        value: string | boolean,
        items: T[],
        setItems: (items: T[]) => void,
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
        setItems: (items: T[]) => void,
    ) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleItem = <T extends ConfigItem>(
        id: string,
        items: T[],
        setItems: (items: T[]) => void,
    ) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, enabled: !item.enabled } : item,
            ),
        );
    };

    const renderItems = <T extends ConfigItem>(
        items: T[],
        setItems: (items: T[]) => void,
        label: string,
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
                                    ? "border-(--accent) bg-(--accent) text-(--text-on-accent)"
                                    : "border-(--border-color) text-transparent"
                            }`}
                        >
                            {item.enabled ? "✔" : ""}
                        </button>

                        <button
                            onClick={() => removeItem(item.id, items, setItems)}
                            className="w-5 h-5 flex items-center justify-center text-(--text-muted) hover:text-(--danger) transition-colors rounded text-base"
                            title={`Remove ${label}`}
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
                        placeholder="key"
                        className="bg-(--bg-input) text-(--text-primary) text-sm px-2 py-1.5 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) placeholder:text-(--text-muted)"
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
                        placeholder="value"
                        className="bg-(--bg-input) text-(--text-primary) text-sm px-2 py-1.5 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) placeholder:text-(--text-muted)"
                    />
                </div>
            ))}

            <button
                onClick={() => addItem(setItems, items)}
                className="flex items-center gap-1.5 text-sm text-(--accent) hover:text-(--accent-light) transition-colors mt-1"
            >
                + add {label}
            </button>
        </div>
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-0.5 px-3 pt-2 shrink-0 bg-(--bg-primary)">
                {(["params", "headers", "body"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`px-3 py-1.5 text-xs font-medium capitalize rounded-t transition-colors ${
                            activeTab === tab
                                ? "text-(--text-primary) bg-(--bg-tertiary)"
                                : "text-(--text-muted) hover:text-(--text-secondary) hover:bg-(--bg-elevated)"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-(--bg-secondary) border border-(--border-color) rounded-b border-t-0 overflow-y-auto">
                {activeTab === "params" &&
                    renderItems(params, setParams, "parameter")}
                {activeTab === "headers" &&
                    renderItems(headers, setHeaders, "header")}
                {activeTab === "body" && (
                    <div className="p-3">
                        <textarea
                            placeholder="request body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-40 sm:h-52 md:h-65 bg-(--bg-input) text-(--text-primary) text-sm px-3 py-2 rounded border border-(--border-color) focus:outline-none focus:ring-1 focus:ring-(--accent) placeholder:text-(--text-muted) resize-none font-mono"                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RequestConfig;
