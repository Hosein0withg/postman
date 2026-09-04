import axios, { AxiosError } from "axios";
import type { Request, ResponseData } from "../type";

export const sendApiRequest = async (
    requestObj: Request,
): Promise<ResponseData> => {
    const startTime = performance.now();

    try {
        // url
        const url = requestObj.fullUrl;
        // const enabledParams = requestObj.params.filter(
        //     (param) => param.enabled && param.key.trim(),
        // );
        // if (enabledParams.length) {
        //     const urlObject = new URL(url);
        //     enabledParams.forEach((param) => {
        //         urlObject.searchParams.append(param.key, param.value);
        //     });
        //     url = urlObject.toString();
        // }

        // headers
        const headers = requestObj.headers
            .filter((h) => h.enabled && h.key.trim())
            .reduce(
                (acc, h) => {
                    acc[h.key] = h.value;
                    return acc;
                },
                {} as Record<string, string>,
            );

        // body
        let requestBody = undefined;
        if (requestObj.body.trim()) {
            try {
                requestBody = JSON.parse(requestObj.body);
            } catch {
                requestBody = requestObj.body;
            }
        }

        const config = {
            method: requestObj.method,
            url: url,
            headers: headers,
            data: requestBody,
        };

        const response = await axios(config);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        const responseSize = response.data ? new Blob([response.data]).size : 0;
        return {
            status: response.status,
            statusText: getStatusText(response.status),
            headers: response.headers as Record<string, string>,
            body: response.data,
            time: duration,
            size: responseSize,
        };
    } catch (error) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        let statusCode = 0;
        let statusText = "Error";
        let errorMessage = "An unknown error occurred";
        let responseBody = null;
        let responseHeaders = {};
        let responseSize = 0;

        if (error instanceof AxiosError) {
            if (error.response) {
                statusCode = error.response.status;
                statusText = getStatusText(statusCode);
                errorMessage = error.message;
                responseBody = error.response.data ?? "No Response Body";
                responseHeaders =
                    (error.response.headers as Record<string, string>) ?? {};
                responseSize = error.response.data
                    ? new Blob([JSON.stringify(error.response.data)]).size
                    : 0;
            } else if (error.request) {
                statusCode = 0;
                statusText = "Network Error";
                errorMessage =
                    "No response received from server. Please check your network connection.";
            } else {
                statusCode = 0;
                statusText = "Error";
                errorMessage =
                    error.message ||
                    "An unknown error occurred while processing your request.";
            }
        } else if (error instanceof Error) {
            errorMessage = error.message || "An unexpected error occurred.";
        } else {
            statusCode = 0;
            statusText = "Error";
            errorMessage =
                "An unknown error occurred while processing your request.";
        }
        return {
            status: statusCode,
            statusText: statusText,
            headers: responseHeaders,
            body: responseBody,
            time: duration,
            size: responseSize,
            error: errorMessage,
        };
    }

    function getStatusText(status: number): string {
        const statusMap: Record<number, string> = {
            // 1xx Informational
            100: "Continue",
            101: "Switching Protocols",
            102: "Processing",
            103: "Early Hints",

            // 2xx Success
            200: "OK",
            201: "Created",
            202: "Accepted",
            203: "Non-Authoritative Information",
            204: "No Content",
            205: "Reset Content",
            206: "Partial Content",
            207: "Multi-Status",
            208: "Already Reported",
            226: "IM Used",

            // 3xx Redirection
            300: "Multiple Choices",
            301: "Moved Permanently",
            302: "Found",
            303: "See Other",
            304: "Not Modified",
            305: "Use Proxy",
            306: "Switch Proxy",
            307: "Temporary Redirect",
            308: "Permanent Redirect",

            // 4xx Client Errors
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            407: "Proxy Authentication Required",
            408: "Request Timeout",
            409: "Conflict",
            410: "Gone",
            411: "Length Required",
            412: "Precondition Failed",
            413: "Content Too Large",
            414: "URI Too Long",
            415: "Unsupported Media Type",
            416: "Range Not Satisfiable",
            417: "Expectation Failed",
            418: "I'm a teapot",
            421: "Misdirected Request",
            422: "Unprocessable Content",
            423: "Locked",
            424: "Failed Dependency",
            425: "Too Early",
            426: "Upgrade Required",
            428: "Precondition Required",
            429: "Too Many Requests",
            431: "Request Header Fields Too Large",
            451: "Unavailable For Legal Reasons",

            // 5xx Server Errors
            500: "Internal Server Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Gateway Timeout",
            505: "HTTP Version Not Supported",
            506: "Variant Also Negotiates",
            507: "Insufficient Storage",
            508: "Loop Detected",
            510: "Not Extended",
            511: "Network Authentication Required",
        };

        return statusMap[status] || `Status ${status}`;
    }
};
