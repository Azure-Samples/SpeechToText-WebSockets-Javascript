/// <reference path="..\..\common\Error.ts" />
/// <reference path="..\..\common\Promise.ts" />
/// <reference path="IAuthentication.ts" />

namespace Speech {
    import ArgumentNullError = Common.ArgumentNullError;
    import Promise = Common.Promise;
    import PromiseHelper = Common.PromiseHelper;

    const AuthHeader: string = "Ocp-Apim-Subscription-Key";

    export class CognitiveSubscriptionKeyAuthentication implements IAuthentication {
        private authInfo: AuthInfo;

        constructor(subscriptionKey: string) {
            if (!subscriptionKey) {
                throw new ArgumentNullError("subscriptionKey");
            }

            this.authInfo = new AuthInfo(AuthHeader, subscriptionKey);
        }

        public Fetch = (authFetchEventId: string): Promise<AuthInfo> => {
            return PromiseHelper.FromResult(this.authInfo);
        }

        public FetchOnExpiry = (authFetchEventId: string): Promise<AuthInfo> => {
            return PromiseHelper.FromResult(this.authInfo);
        }
    }
}
