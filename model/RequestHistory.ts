import "source-map-support/register";

export interface RequestHistory {
    requestId: string;
    path: string;
    httpMethod: string;
    userAgent?: string;
    requestTime: number;
    protocol: string;
    statusCode?: number;
}