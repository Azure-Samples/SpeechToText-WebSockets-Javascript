/// <reference path="..\..\common\Promise.ts" />
/// <reference path="..\..\common\IConnection.ts" />
/// <reference path="IAuthentication.ts" />
/// <reference path="RecognizerConfig.ts" />

namespace Speech {

    export interface IConnectionFactory {
        Create(
            config: RecognizerConfig,
            authInfo: AuthInfo,
            connectionId?: string): Common.IConnection;
    }
}
