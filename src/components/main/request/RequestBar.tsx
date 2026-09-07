import type { HttpMethod } from "../../../type";

interface RequestBarProps {
    method: HttpMethod;
    setMethod: (method: HttpMethod) => void;
    fullUrl: string;
    setUrl: (url: string) => void;
    onSend: () => void;
    onReset: () => void;
}

function RequestBar({ method, setMethod, fullUrl, setUrl, onSend, onReset }: RequestBarProps) {
    const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-[#141414] border-b border-[#2a2a2a] shrink-0">
            <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="bg-[#1e1e1e] text-white text-sm px-3 py-1.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] appearance-none cursor-pointer min-w-22.5"
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
                className="flex-1 bg-[#1e1e1e] text-white text-sm px-3 py-1.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] placeholder:text-gray-500"
            />

            <button
                onClick={onSend}
                className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
                Send
            </button>

            <button
                onClick={onReset}
                className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
                Reset
            </button>
        </div>
    );
}

export default RequestBar;
