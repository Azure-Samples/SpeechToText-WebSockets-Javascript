"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var SpeechRecognitionEvent = /** @class */ (function (_super) {
    __extends(SpeechRecognitionEvent, _super);
    function SpeechRecognitionEvent(eventName, requestId, eventType) {
        if (eventType === void 0) { eventType = Exports_1.EventType.Info; }
        var _this = _super.call(this, eventName, eventType) || this;
        _this.requestId = requestId;
        return _this;
    }
    Object.defineProperty(SpeechRecognitionEvent.prototype, "RequestId", {
        get: function () {
            return this.requestId;
        },
        enumerable: true,
        configurable: true
    });
    return SpeechRecognitionEvent;
}(Exports_1.PlatformEvent));
exports.SpeechRecognitionEvent = SpeechRecognitionEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechRecognitionResultEvent = /** @class */ (function (_super) {
    __extends(SpeechRecognitionResultEvent, _super);
    function SpeechRecognitionResultEvent(eventName, requestId, result) {
        var _this = _super.call(this, eventName, requestId) || this;
        _this.result = result;
        return _this;
    }
    Object.defineProperty(SpeechRecognitionResultEvent.prototype, "Result", {
        get: function () {
            return this.result;
        },
        enumerable: true,
        configurable: true
    });
    return SpeechRecognitionResultEvent;
}(SpeechRecognitionEvent));
exports.SpeechRecognitionResultEvent = SpeechRecognitionResultEvent;
// tslint:disable-next-line:max-classes-per-file
var RecognitionTriggeredEvent = /** @class */ (function (_super) {
    __extends(RecognitionTriggeredEvent, _super);
    function RecognitionTriggeredEvent(requestId, audioSourceId, audioNodeId) {
        var _this = _super.call(this, "RecognitionTriggeredEvent", requestId) || this;
        _this.audioSourceId = audioSourceId;
        _this.audioNodeId = audioNodeId;
        return _this;
    }
    Object.defineProperty(RecognitionTriggeredEvent.prototype, "AudioSourceId", {
        get: function () {
            return this.audioSourceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionTriggeredEvent.prototype, "AudioNodeId", {
        get: function () {
            return this.audioNodeId;
        },
        enumerable: true,
        configurable: true
    });
    return RecognitionTriggeredEvent;
}(SpeechRecognitionEvent));
exports.RecognitionTriggeredEvent = RecognitionTriggeredEvent;
// tslint:disable-next-line:max-classes-per-file
var ListeningStartedEvent = /** @class */ (function (_super) {
    __extends(ListeningStartedEvent, _super);
    function ListeningStartedEvent(requestId, audioSourceId, audioNodeId) {
        var _this = _super.call(this, "ListeningStartedEvent", requestId) || this;
        _this.audioSourceId = audioSourceId;
        _this.audioNodeId = audioNodeId;
        return _this;
    }
    Object.defineProperty(ListeningStartedEvent.prototype, "AudioSourceId", {
        get: function () {
            return this.audioSourceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListeningStartedEvent.prototype, "AudioNodeId", {
        get: function () {
            return this.audioNodeId;
        },
        enumerable: true,
        configurable: true
    });
    return ListeningStartedEvent;
}(SpeechRecognitionEvent));
exports.ListeningStartedEvent = ListeningStartedEvent;
// tslint:disable-next-line:max-classes-per-file
var ConnectingToServiceEvent = /** @class */ (function (_super) {
    __extends(ConnectingToServiceEvent, _super);
    function ConnectingToServiceEvent(requestId, authFetchEventid, connectionId) {
        var _this = _super.call(this, "ConnectingToServiceEvent", requestId) || this;
        _this.authFetchEventid = authFetchEventid;
        _this.connectionId = connectionId;
        return _this;
    }
    Object.defineProperty(ConnectingToServiceEvent.prototype, "AuthFetchEventid", {
        get: function () {
            return this.authFetchEventid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectingToServiceEvent.prototype, "ConnectionId", {
        get: function () {
            return this.connectionId;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectingToServiceEvent;
}(SpeechRecognitionEvent));
exports.ConnectingToServiceEvent = ConnectingToServiceEvent;
// tslint:disable-next-line:max-classes-per-file
var RecognitionStartedEvent = /** @class */ (function (_super) {
    __extends(RecognitionStartedEvent, _super);
    function RecognitionStartedEvent(requestId, audioSourceId, audioNodeId, authFetchEventId, connectionId) {
        var _this = _super.call(this, "RecognitionStartedEvent", requestId) || this;
        _this.audioSourceId = audioSourceId;
        _this.audioNodeId = audioNodeId;
        _this.authFetchEventId = authFetchEventId;
        _this.connectionId = connectionId;
        return _this;
    }
    Object.defineProperty(RecognitionStartedEvent.prototype, "AudioSourceId", {
        get: function () {
            return this.audioSourceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionStartedEvent.prototype, "AudioNodeId", {
        get: function () {
            return this.audioNodeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionStartedEvent.prototype, "AuthFetchEventId", {
        get: function () {
            return this.authFetchEventId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionStartedEvent.prototype, "ConnectionId", {
        get: function () {
            return this.connectionId;
        },
        enumerable: true,
        configurable: true
    });
    return RecognitionStartedEvent;
}(SpeechRecognitionEvent));
exports.RecognitionStartedEvent = RecognitionStartedEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechStartDetectedEvent = /** @class */ (function (_super) {
    __extends(SpeechStartDetectedEvent, _super);
    function SpeechStartDetectedEvent(requestId, result) {
        return _super.call(this, "SpeechStartDetectedEvent", requestId, result) || this;
    }
    return SpeechStartDetectedEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechStartDetectedEvent = SpeechStartDetectedEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechHypothesisEvent = /** @class */ (function (_super) {
    __extends(SpeechHypothesisEvent, _super);
    function SpeechHypothesisEvent(requestId, result) {
        return _super.call(this, "SpeechHypothesisEvent", requestId, result) || this;
    }
    return SpeechHypothesisEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechHypothesisEvent = SpeechHypothesisEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechFragmentEvent = /** @class */ (function (_super) {
    __extends(SpeechFragmentEvent, _super);
    function SpeechFragmentEvent(requestId, result) {
        return _super.call(this, "SpeechFragmentEvent", requestId, result) || this;
    }
    return SpeechFragmentEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechFragmentEvent = SpeechFragmentEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechEndDetectedEvent = /** @class */ (function (_super) {
    __extends(SpeechEndDetectedEvent, _super);
    function SpeechEndDetectedEvent(requestId, result) {
        return _super.call(this, "SpeechEndDetectedEvent", requestId, result) || this;
    }
    return SpeechEndDetectedEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechEndDetectedEvent = SpeechEndDetectedEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechSimplePhraseEvent = /** @class */ (function (_super) {
    __extends(SpeechSimplePhraseEvent, _super);
    function SpeechSimplePhraseEvent(requestId, result) {
        return _super.call(this, "SpeechSimplePhraseEvent", requestId, result) || this;
    }
    return SpeechSimplePhraseEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechSimplePhraseEvent = SpeechSimplePhraseEvent;
// tslint:disable-next-line:max-classes-per-file
var SpeechDetailedPhraseEvent = /** @class */ (function (_super) {
    __extends(SpeechDetailedPhraseEvent, _super);
    function SpeechDetailedPhraseEvent(requestId, result) {
        return _super.call(this, "SpeechDetailedPhraseEvent", requestId, result) || this;
    }
    return SpeechDetailedPhraseEvent;
}(SpeechRecognitionResultEvent));
exports.SpeechDetailedPhraseEvent = SpeechDetailedPhraseEvent;
var RecognitionCompletionStatus;
(function (RecognitionCompletionStatus) {
    RecognitionCompletionStatus[RecognitionCompletionStatus["Success"] = 0] = "Success";
    RecognitionCompletionStatus[RecognitionCompletionStatus["AudioSourceError"] = 1] = "AudioSourceError";
    RecognitionCompletionStatus[RecognitionCompletionStatus["AudioSourceTimeout"] = 2] = "AudioSourceTimeout";
    RecognitionCompletionStatus[RecognitionCompletionStatus["AuthTokenFetchError"] = 3] = "AuthTokenFetchError";
    RecognitionCompletionStatus[RecognitionCompletionStatus["AuthTokenFetchTimeout"] = 4] = "AuthTokenFetchTimeout";
    RecognitionCompletionStatus[RecognitionCompletionStatus["UnAuthorized"] = 5] = "UnAuthorized";
    RecognitionCompletionStatus[RecognitionCompletionStatus["ConnectTimeout"] = 6] = "ConnectTimeout";
    RecognitionCompletionStatus[RecognitionCompletionStatus["ConnectError"] = 7] = "ConnectError";
    RecognitionCompletionStatus[RecognitionCompletionStatus["ClientRecognitionActivityTimeout"] = 8] = "ClientRecognitionActivityTimeout";
    RecognitionCompletionStatus[RecognitionCompletionStatus["UnknownError"] = 9] = "UnknownError";
})(RecognitionCompletionStatus = exports.RecognitionCompletionStatus || (exports.RecognitionCompletionStatus = {}));
// tslint:disable-next-line:max-classes-per-file
var RecognitionEndedEvent = /** @class */ (function (_super) {
    __extends(RecognitionEndedEvent, _super);
    function RecognitionEndedEvent(requestId, audioSourceId, audioNodeId, authFetchEventId, connectionId, serviceTag, status, error) {
        var _this = _super.call(this, "RecognitionEndedEvent", requestId, status === RecognitionCompletionStatus.Success ? Exports_1.EventType.Info : Exports_1.EventType.Error) || this;
        _this.audioSourceId = audioSourceId;
        _this.audioNodeId = audioNodeId;
        _this.connectionId = connectionId;
        _this.authFetchEventId = authFetchEventId;
        _this.status = status;
        _this.error = error;
        _this.serviceTag = serviceTag;
        return _this;
    }
    Object.defineProperty(RecognitionEndedEvent.prototype, "AudioSourceId", {
        get: function () {
            return this.audioSourceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "AudioNodeId", {
        get: function () {
            return this.audioNodeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "AuthFetchEventId", {
        get: function () {
            return this.authFetchEventId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "ConnectionId", {
        get: function () {
            return this.connectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "ServiceTag", {
        get: function () {
            return this.serviceTag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "Status", {
        get: function () {
            return this.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognitionEndedEvent.prototype, "Error", {
        get: function () {
            return this.error;
        },
        enumerable: true,
        configurable: true
    });
    return RecognitionEndedEvent;
}(SpeechRecognitionEvent));
exports.RecognitionEndedEvent = RecognitionEndedEvent;

//# sourceMappingURL=RecognitionEvents.js.map
