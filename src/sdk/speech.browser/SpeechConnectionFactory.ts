/// <reference path="..\..\common\Promise.ts" />
/// <reference path="..\..\common\Error.ts" />
/// <reference path="..\..\common/Storage.ts" />
/// <reference path="..\..\common\IDictionary.ts" />
/// <reference path="..\..\common\IConnection.ts" />
/// <reference path="..\..\common.browser\WebsocketConnection.ts" />
/// <reference path="..\speech\IAuthentication.ts" />
/// <reference path="..\speech\WebsocketMessageFormatter.ts" />
/// <reference path="..\speech\RecognizerConfig.ts" />
/// <reference path="..\speech\IConnectionFactory.ts" />

namespace Speech.Browser {

    import IStringDictionary = Common.IStringDictionary;
    import IConnection = Common.IConnection;
    import WebsocketConnection = Common.Browser.WebsocketConnection;

    const TestHooksParamName: string = "testhooks";
    const ConnectionIdHeader: string = "X-ConnectionId";

    export class SpeechConnectionFactory implements IConnectionFactory {

        public Create = (
            config: RecognizerConfig,
            authInfo: AuthInfo,
            connectionId?: string): IConnection => {

            let endpoint = "";
            switch (config.RecognitionMode) {
                case RecognitionMode.Conversation:
                    endpoint = this.Host + this.ConversationRelativeUri;
                    break;
                case RecognitionMode.Dictation:
                    endpoint = this.Host + this.DictationRelativeUri;
                    break;
                default:
                    endpoint = this.Host + this.InteractiveRelativeUri; // default is interactive
                    break;
            }

            const queryParams: IStringDictionary<string> = {
                format: Speech.SpeechResultFormat[config.Format].toString().toLowerCase(),
                language: config.Language,
            };

            if (this.IsDebugModeEnabled) {
                queryParams[TestHooksParamName] = "1";
            }

            const headers: IStringDictionary<string> = {};
            headers[authInfo.HeaderName] = authInfo.Token;
            headers[ConnectionIdHeader] = connectionId;

            return new WebsocketConnection(endpoint, queryParams, headers, new WebsocketMessageFormatter(), connectionId);
        }

        private get Host(): string {
            return Common.Storage.Local.GetOrAdd("Host", "wss://speech.platform.bing.com");
        }

        private get InteractiveRelativeUri(): string {
            return Common.Storage.Local.GetOrAdd("InteractiveRelativeUri", "/speech/recognition/interactive/cognitiveservices/v1");
        }

        private get ConversationRelativeUri(): string {
            return Common.Storage.Local.GetOrAdd("ConversationRelativeUri", "/speech/recognition/conversation/cognitiveservices/v1");
        }

        private get DictationRelativeUri(): string {
            return Common.Storage.Local.GetOrAdd("DictationRelativeUri", "/speech/recognition/dictation/cognitiveservices/v1");
        }

        private get IsDebugModeEnabled(): boolean {
            const value = Common.Storage.Local.GetOrAdd("IsDebugModeEnabled", "false");
            return value.toLowerCase() === "true";
        }
    }
}
