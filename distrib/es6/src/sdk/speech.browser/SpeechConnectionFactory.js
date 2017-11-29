import { WebsocketConnection } from "../../common.browser/Exports";
import { Storage, } from "../../common/Exports";
import { RecognitionMode, SpeechResultFormat, WebsocketMessageFormatter, } from "../speech/Exports";
const TestHooksParamName = "testhooks";
const ConnectionIdHeader = "X-ConnectionId";
export class SpeechConnectionFactory {
    constructor() {
        this.Create = (config, authInfo, connectionId) => {
            let endpoint = "";
            switch (config.RecognitionMode) {
                case RecognitionMode.Conversation:
                    endpoint = this.Host + this.ConversationRelativeUri;
                    break;
                case RecognitionMode.Dictation:
                    endpoint = this.Host + this.DictationRelativeUri;
                    break;
                default:
                    endpoint = this.Host + this.InteractiveRelativeUri;
                    break;
            }
            const queryParams = {
                format: SpeechResultFormat[config.Format].toString().toLowerCase(),
                language: config.Language,
            };
            if (this.IsDebugModeEnabled) {
                queryParams[TestHooksParamName] = "1";
            }
            const headers = {};
            headers[authInfo.HeaderName] = authInfo.Token;
            headers[ConnectionIdHeader] = connectionId;
            return new WebsocketConnection(endpoint, queryParams, headers, new WebsocketMessageFormatter(), connectionId);
        };
    }
    get Host() {
        return Storage.Local.GetOrAdd("Host", "wss://speech.platform.bing.com");
    }
    get InteractiveRelativeUri() {
        return Storage.Local.GetOrAdd("InteractiveRelativeUri", "/speech/recognition/interactive/cognitiveservices/v1");
    }
    get ConversationRelativeUri() {
        return Storage.Local.GetOrAdd("ConversationRelativeUri", "/speech/recognition/conversation/cognitiveservices/v1");
    }
    get DictationRelativeUri() {
        return Storage.Local.GetOrAdd("DictationRelativeUri", "/speech/recognition/dictation/cognitiveservices/v1");
    }
    get IsDebugModeEnabled() {
        const value = Storage.Local.GetOrAdd("IsDebugModeEnabled", "false");
        return value.toLowerCase() === "true";
    }
}

//# sourceMappingURL=SpeechConnectionFactory.js.map
