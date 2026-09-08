import type { Tab } from "../../../type";

interface TabsProps {
    tabs: Tab[];
    activeTabId: string;
    onAddTab: () => void;
    onSwitchTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
}

function TabDiv({
    tabs,
    activeTabId,
    onAddTab,
    onSwitchTab,
    onCloseTab,
}: TabsProps) {
    return (
        <div className="flex items-center h-11 bg-[#141414] border-b border-[#2a2a2a] px-3 gap-0.5 overflow-x-auto overflow-y-hidden">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`group flex text-xs items-center gap-1 h-full px-3 font-medium transition-colors ${
                        tab.id === activeTabId
                            ? "text-white border-b-2 border-[#6c63ff] bg-[#1a1a1a]"
                            : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
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
                        className="h-full text-sm px-2 text-gray-400 hover:text-red-400 hover:bg-[#252525] transition-colors rounded-t-sm flex items-center"
                    >
                        ✕
                    </button>
                    <button
                        onClick={onAddTab}
                        className="h-full text-2xl px-2 text-gray-400 hover:text-green-500 hover:bg-[#252525] transition-colors rounded-t-sm flex items-center"
                    >
                        +
                    </button>
                </div>
            ))}
        </div>
    );
}

export default TabDiv;
