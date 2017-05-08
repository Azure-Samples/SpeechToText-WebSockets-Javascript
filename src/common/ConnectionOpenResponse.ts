
/**
 * The connection open response
 *
 * @export
 * @class ConnectionOpenResponse
 */
export class ConnectionOpenResponse {
    private statusCode: number;
    private reason: string;

    /**
     * Creates an instance of ConnectionOpenResponse.
     * @param {number} statusCode The connection open response status code.
     * @param {string} reason The connection open response reason.
     *
     * @memberof ConnectionOpenResponse
     */
    constructor(statusCode: number, reason: string) {
        this.statusCode = statusCode;
        this.reason = reason;
    }

    /**
     * The connection open response status code.
     *
     * @readonly
     * @type {number}
     * @memberof ConnectionOpenResponse
     */
    public get StatusCode(): number {
        return this.statusCode;
    }

    /**
     * The connection open response reason.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionOpenResponse
     */
    public get Reason(): string {
        return this.reason;
    }
}
