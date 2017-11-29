import { ArgumentNullError, PromiseHelper } from "../../common/Exports";
import { AuthInfo } from "./IAuthentication";
const AuthHeader = "Ocp-Apim-Subscription-Key";
export class CognitiveSubscriptionKeyAuthentication {
    constructor(subscriptionKey) {
        this.Fetch = (authFetchEventId) => {
            return PromiseHelper.FromResult(this.authInfo);
        };
        this.FetchOnExpiry = (authFetchEventId) => {
            return PromiseHelper.FromResult(this.authInfo);
        };
        if (!subscriptionKey) {
            throw new ArgumentNullError("subscriptionKey");
        }
        this.authInfo = new AuthInfo(AuthHeader, subscriptionKey);
    }
}

//# sourceMappingURL=CognitiveSubscriptionKeyAuthentication.js.map
