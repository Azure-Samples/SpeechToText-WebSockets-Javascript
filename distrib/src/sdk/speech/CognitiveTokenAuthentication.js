"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var IAuthentication_1 = require("./IAuthentication");
var AuthHeader = "Authorization";
var CognitiveTokenAuthentication = /** @class */ (function () {
    function CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) {
        var _this = this;
        this.Fetch = function (authFetchEventId) {
            return _this.fetchCallback(authFetchEventId).OnSuccessContinueWith(function (token) { return new IAuthentication_1.AuthInfo(AuthHeader, token); });
        };
        this.FetchOnExpiry = function (authFetchEventId) {
            return _this.fetchOnExpiryCallback(authFetchEventId).OnSuccessContinueWith(function (token) { return new IAuthentication_1.AuthInfo(AuthHeader, token); });
        };
        if (!fetchCallback) {
            throw new Exports_1.ArgumentNullError("fetchCallback");
        }
        if (!fetchOnExpiryCallback) {
            throw new Exports_1.ArgumentNullError("fetchOnExpiryCallback");
        }
        this.fetchCallback = fetchCallback;
        this.fetchOnExpiryCallback = fetchOnExpiryCallback;
    }
    return CognitiveTokenAuthentication;
}());
exports.CognitiveTokenAuthentication = CognitiveTokenAuthentication;

//# sourceMappingURL=CognitiveTokenAuthentication.js.map
