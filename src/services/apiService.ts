import axios, { AxiosError } from "axios";
import type { Request, ResponseData } from "../app/type";

export const sendApiRequest = async (
    requestObj: Request,
): Promise<ResponseData> => {
    const startTime = performance.now();

    try {
        // url
        let url = requestObj.url;
        const enabledParams = requestObj.params.filter(
            (param) => param.enabled && param.key.trim(),
        );
        if (enabledParams.length) {
            const urlObject = new URL(url);
            enabledParams.forEach((param) => {
                urlObject.searchParams.append(param.key, param.value);
            });
            url = urlObject.toString();
        }

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
            statusText: response.statusText || "Success",
            headers: response.headers as Record<string, string>,
            body: response.data,
            time: duration,
            size: responseSize,
        };
    } catch (error) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        if (error instanceof AxiosError) {
            if (error.response) {
                const responseSize = error.response.data
                    ? new Blob([error.response.data]).size
                    : 0;
                return {
                    status: error.response.status,
                    statusText: error.response.statusText || "Error",
                    headers:
                        (error.response.headers as Record<string, string>) ??
                        {},
                    body: error.response.data ?? "No Response Body",
                    time: duration,
                    size: responseSize,
                    error: error.message,
                };
            } else if (error.request) {
                return {
                    status: 0,
                    statusText: "Network Error",
                    headers: {},
                    body: null,
                    time: duration,
                    size: 0,
                    error: "No response received from server. Please check your network connection.",
                };
            } else {
                return {
                    status: 0,
                    statusText: "Error",
                    headers: {},
                    body: null,
                    time: duration,
                    size: 0,
                    error:
                        error.message ||
                        "An unknown error occurred while processing your request.",
                };
            }
        } else if (error instanceof Error) {
            return {
                status: 0,
                statusText: "Error",
                headers: {},
                body: null,
                time: duration,
                size: 0,
                error:
                    error.message ||
                    "An unknown error occurred while processing your request.",
            };
        } else {
            return {
                status: 0,
                statusText: "Error",
                headers: {},
                body: null,
                time: duration,
                size: 0,
                error: "An unknown error occurred while processing your request.",
            };
        }
    }
};
