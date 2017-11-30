import { Promise } from "../../common/Exports";
import { AuthInfo, IAuthentication } from "./IAuthentication";
export declare class CognitiveTokenAuthentication implements IAuthentication {
    private fetchCallback;
    private fetchOnExpiryCallback;
    constructor(fetchCallback: (authFetchEventId: string) => Promise<string>, fetchOnExpiryCallback: (authFetchEventId: string) => Promise<string>);
    Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
    FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
}
