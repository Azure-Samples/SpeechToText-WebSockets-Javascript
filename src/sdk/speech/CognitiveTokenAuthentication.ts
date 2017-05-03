/// <reference path="..\..\common\Error.ts" />
/// <reference path="..\..\common\Promise.ts" />
/// <reference path="IAuthentication.ts" />

namespace Speech {
    import ArgumentNullError = Common.ArgumentNullError;
    import Promise = Common.Promise;

    const AuthHeader: string = "Authorization";

    export class CognitiveTokenAuthentication implements IAuthentication {
        private fetchCallback: (authFetchEventId: string) => Promise<string>;
        private fetchOnExpiryCallback: (authFetchEventId: string) => Promise<string>;

        constructor(fetchCallback: (authFetchEventId: string) => Promise<string>, fetchOnExpiryCallback: (authFetchEventId: string) => Promise<string>) {
            if (!fetchCallback) {
                throw new ArgumentNullError("fetchCallback");
            }

            if (!fetchOnExpiryCallback) {
                throw new ArgumentNullError("fetchOnExpiryCallback");
            }

            this.fetchCallback = fetchCallback;
            this.fetchOnExpiryCallback = fetchOnExpiryCallback;
        }

        public Fetch = (authFetchEventId: string): Promise<AuthInfo> => {
            return  this.fetchCallback(authFetchEventId).OnSuccessContinueWith((token: string) => new AuthInfo(AuthHeader, token));
        }

        public FetchOnExpiry = (authFetchEventId: string): Promise<AuthInfo> => {
            return  this.fetchOnExpiryCallback(authFetchEventId).OnSuccessContinueWith((token: string) => new AuthInfo(AuthHeader, token));
        }
    }
}
