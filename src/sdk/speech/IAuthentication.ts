/// <reference path="..\..\common\Promise.ts" />

namespace Speech {
    import Promise = Common.Promise;

    export interface IAuthentication {
        Fetch(authFetchEventId: string): Promise<AuthInfo>;
        FetchOnExpiry(authFetchEventId: string): Promise<AuthInfo>;
    }

    export class AuthInfo {
        private headerName: string;
        private token: string;

        public constructor(headerName: string, token: string) {
            this.headerName = headerName;
            this.token = token;
        }

        public get HeaderName(): string {
            return this.headerName;
        }

        public get Token(): string {
            return this.token;
        }
    }
}
