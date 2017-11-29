import { ArgumentNullError } from "../../common/Exports";
import { AuthInfo } from "./IAuthentication";
const AuthHeader = "Authorization";
export class CognitiveTokenAuthentication {
    constructor(fetchCallback, fetchOnExpiryCallback) {
        this.Fetch = (authFetchEventId) => {
            return this.fetchCallback(authFetchEventId).OnSuccessContinueWith((token) => new AuthInfo(AuthHeader, token));
        };
        this.FetchOnExpiry = (authFetchEventId) => {
            return this.fetchOnExpiryCallback(authFetchEventId).OnSuccessContinueWith((token) => new AuthInfo(AuthHeader, token));
        };
        if (!fetchCallback) {
            throw new ArgumentNullError("fetchCallback");
        }
        if (!fetchOnExpiryCallback) {
            throw new ArgumentNullError("fetchOnExpiryCallback");
        }
        this.fetchCallback = fetchCallback;
        this.fetchOnExpiryCallback = fetchOnExpiryCallback;
    }
}

//# sourceMappingURL=CognitiveTokenAuthentication.js.map
