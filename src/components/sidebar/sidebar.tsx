function Sidebar() {
  return (
    <aside className="w-55 bg-[#141414] border-r border-[#2a2a2a] flex flex-col shrink-0">

      <nav className="flex-1 p-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-[#252525] hover:text-white transition-colors">
          Collections
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-[#252525] hover:text-white transition-colors">
          History
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
