import { Promise } from "../../common/Exports";
export interface IAuthentication {
    Fetch(authFetchEventId: string): Promise<AuthInfo>;
    FetchOnExpiry(authFetchEventId: string): Promise<AuthInfo>;
}
export declare class AuthInfo {
    private headerName;
    private token;
    constructor(headerName: string, token: string);
    readonly HeaderName: string;
    readonly Token: string;
}
