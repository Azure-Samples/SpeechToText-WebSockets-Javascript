export declare class ConnectionOpenResponse {
    private statusCode;
    private reason;
    constructor(statusCode: number, reason: string);
    readonly StatusCode: number;
    readonly Reason: string;
}
