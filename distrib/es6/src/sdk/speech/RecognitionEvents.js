import { EventType, PlatformEvent } from "../../common/Exports";
export class SpeechRecognitionEvent extends PlatformEvent {
    constructor(eventName, requestId, eventType = EventType.Info) {
        super(eventName, eventType);
        this.requestId = requestId;
    }
    get RequestId() {
        return this.requestId;
    }
}
export class SpeechRecognitionResultEvent extends SpeechRecognitionEvent {
    constructor(eventName, requestId, result) {
        super(eventName, requestId);
        this.result = result;
    }
    get Result() {
        return this.result;
    }
}
export class RecognitionTriggeredEvent extends SpeechRecognitionEvent {
    constructor(requestId, audioSourceId, audioNodeId) {
        super("RecognitionTriggeredEvent", requestId);
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
    }
    get AudioSourceId() {
        return this.audioSourceId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
}
export class ListeningStartedEvent extends SpeechRecognitionEvent {
    constructor(requestId, audioSourceId, audioNodeId) {
        super("ListeningStartedEvent", requestId);
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
    }
    get AudioSourceId() {
        return this.audioSourceId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
}
export class ConnectingToServiceEvent extends SpeechRecognitionEvent {
    constructor(requestId, authFetchEventid, connectionId) {
        super("ConnectingToServiceEvent", requestId);
        this.authFetchEventid = authFetchEventid;
        this.connectionId = connectionId;
    }
    get AuthFetchEventid() {
        return this.authFetchEventid;
    }
    get ConnectionId() {
        return this.connectionId;
    }
}
export class RecognitionStartedEvent extends SpeechRecognitionEvent {
    constructor(requestId, audioSourceId, audioNodeId, authFetchEventId, connectionId) {
        super("RecognitionStartedEvent", requestId);
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
        this.authFetchEventId = authFetchEventId;
        this.connectionId = connectionId;
    }
    get AudioSourceId() {
        return this.audioSourceId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
    get AuthFetchEventId() {
        return this.authFetchEventId;
    }
    get ConnectionId() {
        return this.connectionId;
    }
}
export class SpeechStartDetectedEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechStartDetectedEvent", requestId, result);
    }
}
export class SpeechHypothesisEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechHypothesisEvent", requestId, result);
    }
}
export class SpeechFragmentEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechFragmentEvent", requestId, result);
    }
}
export class SpeechEndDetectedEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechEndDetectedEvent", requestId, result);
    }
}
export class SpeechSimplePhraseEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechSimplePhraseEvent", requestId, result);
    }
}
export class SpeechDetailedPhraseEvent extends SpeechRecognitionResultEvent {
    constructor(requestId, result) {
        super("SpeechDetailedPhraseEvent", requestId, result);
    }
}
export var RecognitionCompletionStatus;
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
})(RecognitionCompletionStatus || (RecognitionCompletionStatus = {}));
export class RecognitionEndedEvent extends SpeechRecognitionEvent {
    constructor(requestId, audioSourceId, audioNodeId, authFetchEventId, connectionId, serviceTag, status, error) {
        super("RecognitionEndedEvent", requestId, status === RecognitionCompletionStatus.Success ? EventType.Info : EventType.Error);
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
        this.connectionId = connectionId;
        this.authFetchEventId = authFetchEventId;
        this.status = status;
        this.error = error;
        this.serviceTag = serviceTag;
    }
    get AudioSourceId() {
        return this.audioSourceId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
    get AuthFetchEventId() {
        return this.authFetchEventId;
    }
    get ConnectionId() {
        return this.connectionId;
    }
    get ServiceTag() {
        return this.serviceTag;
    }
    get Status() {
        return this.status;
    }
    get Error() {
        return this.error;
    }
}

//# sourceMappingURL=RecognitionEvents.js.map
