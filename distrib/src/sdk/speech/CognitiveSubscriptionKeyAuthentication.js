"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var IAuthentication_1 = require("./IAuthentication");
var AuthHeader = "Ocp-Apim-Subscription-Key";
var CognitiveSubscriptionKeyAuthentication = /** @class */ (function () {
    function CognitiveSubscriptionKeyAuthentication(subscriptionKey) {
        var _this = this;
        this.Fetch = function (authFetchEventId) {
            return Exports_1.PromiseHelper.FromResult(_this.authInfo);
        };
        this.FetchOnExpiry = function (authFetchEventId) {
            return Exports_1.PromiseHelper.FromResult(_this.authInfo);
        };
        if (!subscriptionKey) {
            throw new Exports_1.ArgumentNullError("subscriptionKey");
        }
        this.authInfo = new IAuthentication_1.AuthInfo(AuthHeader, subscriptionKey);
    }
    return CognitiveSubscriptionKeyAuthentication;
}());
exports.CognitiveSubscriptionKeyAuthentication = CognitiveSubscriptionKeyAuthentication;

//# sourceMappingURL=CognitiveSubscriptionKeyAuthentication.js.map
