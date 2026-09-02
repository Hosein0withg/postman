function Tabs() {
    return (
        <div className="flex items-center h-11 bg-[#141414] border-b border-[#2a2a2a] px-3 gap-0.5 shrink-0">
            <button className="h-full px-4 text-sm font-medium text-white border-b-2 border-[#6c63ff] bg-[#1a1a1a] rounded-t-sm">
                Tab 1
            </button>

            <button className="h-full px-3 text-gray-400 hover:text-white hover:bg-[#252525] transition-colors rounded-t-sm flex items-center">
                +
            </button>
        </div>
    );
}

export default Tabs;
