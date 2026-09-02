import { useState } from "react";
import RequestBar from "./RequestBar";
import RequestConfig from "./RequestConfig";

function RequestWorkspace() {
    const [activeConfigTab, setActiveConfigTab] = useState<
        "params" | "headers" | "body"
    >("headers");

    return (
        <main className="flex min-h-0 flex-1 flex-col bg-[#0d0d0d]">
            <RequestBar />

            <RequestConfig
                activeTab={activeConfigTab}
                onTabChange={setActiveConfigTab}
            />
        </main>
    );
}

export default RequestWorkspace;
