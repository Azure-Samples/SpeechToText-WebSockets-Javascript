"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common.browser/Exports");
var Exports_2 = require("../../common/Exports");
var Exports_3 = require("../speech/Exports");
var TestHooksParamName = "testhooks";
var ConnectionIdHeader = "X-ConnectionId";
var SpeechConnectionFactory = /** @class */ (function () {
    function SpeechConnectionFactory() {
        var _this = this;
        this.Create = function (config, authInfo, connectionId) {
            var endpoint = "";
            switch (config.RecognitionMode) {
                case Exports_3.RecognitionMode.Conversation:
                    endpoint = _this.Host + _this.ConversationRelativeUri;
                    break;
                case Exports_3.RecognitionMode.Dictation:
                    endpoint = _this.Host + _this.DictationRelativeUri;
                    break;
                default:
                    endpoint = _this.Host + _this.InteractiveRelativeUri; // default is interactive
                    break;
            }
            var queryParams = {
                format: Exports_3.SpeechResultFormat[config.Format].toString().toLowerCase(),
                language: config.Language,
            };
            if (_this.IsDebugModeEnabled) {
                queryParams[TestHooksParamName] = "1";
            }
            var headers = {};
            headers[authInfo.HeaderName] = authInfo.Token;
            headers[ConnectionIdHeader] = connectionId;
            return new Exports_1.WebsocketConnection(endpoint, queryParams, headers, new Exports_3.WebsocketMessageFormatter(), connectionId);
        };
    }
    Object.defineProperty(SpeechConnectionFactory.prototype, "Host", {
        get: function () {
            return Exports_2.Storage.Local.GetOrAdd("Host", "wss://speech.platform.bing.com");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechConnectionFactory.prototype, "InteractiveRelativeUri", {
        get: function () {
            return Exports_2.Storage.Local.GetOrAdd("InteractiveRelativeUri", "/speech/recognition/interactive/cognitiveservices/v1");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechConnectionFactory.prototype, "ConversationRelativeUri", {
        get: function () {
            return Exports_2.Storage.Local.GetOrAdd("ConversationRelativeUri", "/speech/recognition/conversation/cognitiveservices/v1");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechConnectionFactory.prototype, "DictationRelativeUri", {
        get: function () {
            return Exports_2.Storage.Local.GetOrAdd("DictationRelativeUri", "/speech/recognition/dictation/cognitiveservices/v1");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechConnectionFactory.prototype, "IsDebugModeEnabled", {
        get: function () {
            var value = Exports_2.Storage.Local.GetOrAdd("IsDebugModeEnabled", "false");
            return value.toLowerCase() === "true";
        },
        enumerable: true,
        configurable: true
    });
    return SpeechConnectionFactory;
}());
exports.SpeechConnectionFactory = SpeechConnectionFactory;

//# sourceMappingURL=SpeechConnectionFactory.js.map
