import type { AppData, Collection, HistoryItem, Tab } from "../type";

const LOCAL_STORAGE_KEY = "appData";
const defaultAppData: AppData = {
    collections: [],
    history: [],
    tabs: [
        {
            id: "tab_1",
            title: "Tab 1",
            request: {
                method: "GET",
                fullUrl: "",
                params: [],
                headers: [],
                body: "",
            },
        },
    ],
    activeTabId: "tab_1",
};

export const clearAppData = (): void => {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing app data:", error);
    }
};

export const isValidAppData = (data: unknown): data is AppData => {
    if (!data || typeof data !== "object") return false;
    const appData = data as Partial<AppData>;
    return (
        Array.isArray(appData.collections) &&
        Array.isArray(appData.history) &&
        Array.isArray(appData.tabs) &&
        typeof appData.activeTabId === "string"
    );
};

export const handleInvalidStoredData = (): void => {
    try {
        console.warn(
            "Invalid stored data detected. Clearing and resetting to defaults.",
        );
        clearAppData();
        saveAppData(defaultAppData);
    } catch (error) {
        console.error("Error handling invalid data:", error);
    }
};

export const createAutoSave = (delay: number = 1000) => {
    let timeoutId: number | null = null;
    let pendingData: AppData | null = null;

    return {
        schedule: (data: AppData) => {
            pendingData = data;
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (pendingData) {
                    saveAppData(pendingData);
                    pendingData = null;
                }
                timeoutId = null;
            }, delay);
        },
        flush: () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (pendingData) {
                saveAppData(pendingData);
                pendingData = null;
            }
        },
        cancel: () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
                pendingData = null;
            }
        },
    };
};

export const saveAppData = (data: AppData): void => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving app data:", error);
    }
};

export const saveCollections = (collections: Collection[]): void => {
    try {
        const updatedData = { ...loadAppData(), collections };
        saveAppData(updatedData);
    } catch (error) {
        console.error("Error saving collections:", error);
    }
};

export const saveHistory = (history: HistoryItem[]): void => {
    try {
        const updatedData = { ...loadAppData(), history };
        saveAppData(updatedData);
    } catch (error) {
        console.error("Error saving history:", error);
    }
};

export const saveTabs = (tabs: Tab[], activeTabId: string): void => {
    try {
        const updatedData = { ...loadAppData(), tabs, activeTabId };
        saveAppData(updatedData);
    } catch (error) {
        console.error("Error saving tabs:", error);
    }
};

export const loadAppData = (): AppData => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) return defaultAppData;
        const parsedData = JSON.parse(data);
        if (isValidAppData(parsedData)) {
            return parsedData;
        } else {
            handleInvalidStoredData();
            return defaultAppData;
        }
    } catch (error) {
        console.error("Error loading app data:", error);
        return defaultAppData;
    }
};

export const loadCollections = (): Collection[] => {
    try {
        return loadAppData().collections || [];
    } catch (error) {
        console.error("Error loading collections:", error);
        return [];
    }
};

export const loadHistory = (): HistoryItem[] => {
    try {
        return loadAppData().history || [];
    } catch (error) {
        console.error("Error loading history:", error);
        return [];
    }
};

export const loadTabs = (): { tabs: Tab[]; activeTabId: string } => {
    try {
        const data = loadAppData();
        return { tabs: data.tabs || [], activeTabId: data.activeTabId || "" };
    } catch (error) {
        console.error("Error loading tabs:", error);
        return { tabs: [], activeTabId: "" };
    }
};