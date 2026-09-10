import type { Tab } from "../../../type";

interface TabsProps {
    tabs: Tab[];
    activeTabId: string;
    onAddTab: () => void;
    onSwitchTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onToggleSidebar: () => void;
}

function TabDiv({
    tabs,
    activeTabId,
    onAddTab,
    onSwitchTab,
    onCloseTab,
    onToggleSidebar,
}: TabsProps) {
    return (
        <div className="flex items-center h-11 bg-(--bg-secondary) border-b border-(--border-color) px-3 gap-0.5 overflow-x-auto overflow-y-hidden">
            <button
                onClick={onToggleSidebar}
                className="h-full text-2xl px-2 text-(--text-muted) hover:text-(--accent) hover:bg-(--bg-hover) transition-colors rounded flex items-center shrink-0"
            >
                ☰
            </button>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`group flex text-xs items-center gap-1 h-full px-3 font-medium transition-colors ${
                        tab.id === activeTabId
                            ? "text-(--text-primary) border-b-2 border-(--accent) bg-(--bg-elevated)"
                            : "text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated)"
                    }`}
                >
                    <button
                        onClick={() => onSwitchTab(tab.id)}
                        className="h-full flex items-center"
                    >
                        {tab.title}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCloseTab(tab.id);
                        }}
                        className="h-full text-sm px-2 text-(--text-muted) hover:text-(--danger) hover:bg-(--bg-hover) transition-colors rounded-t-sm flex items-center"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                onClick={onAddTab}
                className="h-full text-2xl px-2 text-(--text-muted) hover:text-(--status-success) hover:bg-(--bg-hover) transition-colors rounded-t-sm flex items-center"
            >
                +
            </button>
        </div>
    );
}

export default TabDiv;
