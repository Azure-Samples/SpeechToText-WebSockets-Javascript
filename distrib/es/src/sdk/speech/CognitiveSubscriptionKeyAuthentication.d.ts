import { Promise } from "../../common/Exports";
import { AuthInfo, IAuthentication } from "./IAuthentication";
export declare class CognitiveSubscriptionKeyAuthentication implements IAuthentication {
    private authInfo;
    constructor(subscriptionKey: string);
    Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
    FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
}
