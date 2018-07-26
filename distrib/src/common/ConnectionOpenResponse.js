"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionOpenResponse = /** @class */ (function () {
    function ConnectionOpenResponse(statusCode, reason) {
        this.statusCode = statusCode;
        this.reason = reason;
    }
    Object.defineProperty(ConnectionOpenResponse.prototype, "StatusCode", {
        get: function () {
            return this.statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionOpenResponse.prototype, "Reason", {
        get: function () {
            return this.reason;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionOpenResponse;
}());
exports.ConnectionOpenResponse = ConnectionOpenResponse;

//# sourceMappingURL=ConnectionOpenResponse.js.map
