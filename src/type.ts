export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";


export interface Parameter {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Request {
  method: HttpMethod;
  fullUrl: string;
  params: Parameter[];
  headers: Header[];
  body: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: Request[];
}

export interface HistoryItem {
  id: string;
  request: Request;
  timestamp: number;
}

export interface Tab {
  id: string;
  title: string;
  request: Request;
}

export interface AppData {
  collections: Collection[];
  history: HistoryItem[];
  tabs: Tab[];
  activeTabId: string;
}

export type ResponseBody = | string | object | Record<string, unknown> | unknown[] | null | undefined;

export interface ResponseData {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: ResponseBody;
    time: number;
    size: number;
    error?: string;
}
