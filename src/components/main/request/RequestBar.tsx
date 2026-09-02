import { useState } from "react";
import type { HttpMethod } from "../../../types/type";

function RequestBar() {
    const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    const [method, setMethod] = useState<HttpMethod>("GET");
    const [url, setUrl] = useState("");

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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter request URL"
                className="flex-1 bg-[#1e1e1e] text-white text-sm px-3 py-1.5 rounded border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#6c63ff] placeholder:text-gray-500"
            />

            <button className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
                Send
            </button>
        </div>
    );
}

export default RequestBar;
