export class ConnectionOpenResponse {
    constructor(statusCode, reason) {
        this.statusCode = statusCode;
        this.reason = reason;
    }
    get StatusCode() {
        return this.statusCode;
    }
    get Reason() {
        return this.reason;
    }
}

//# sourceMappingURL=ConnectionOpenResponse.js.map
