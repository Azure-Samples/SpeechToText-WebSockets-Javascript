import { EventType, PlatformEvent } from "../../common/Exports";
import {
    IDetailedSpeechPhrase,
    ISimpleSpeechPhrase,
    ISpeechEndDetectedResult,
    ISpeechFragment,
    ISpeechStartDetectedResult,
} from "./SpeechResults";

export class SpeechRecognitionEvent extends PlatformEvent {
    private requestId: string;

    constructor(eventName: string, requestId: string, eventType: EventType = EventType.Info) {
        super(eventName, eventType);

        this.requestId = requestId;
    }

    public get RequestId(): string {
        return this.requestId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechRecognitionResultEvent<TResult> extends SpeechRecognitionEvent {
    private result: TResult;

    constructor(eventName: string, requestId: string, result: TResult) {
        super(eventName, requestId);
        this.result = result;
    }

    public get Result(): TResult {
        return this.result;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class RecognitionTriggeredEvent extends SpeechRecognitionEvent {
    private audioSourceId: string;
    private audioNodeId: string;

    constructor(requestId: string, audioSourceId: string, audioNodeId: string) {
        super("RecognitionTriggeredEvent", requestId);

        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
    }

    public get AudioSourceId(): string {
        return this.audioSourceId;
    }

    public get AudioNodeId(): string {
        return this.audioNodeId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ListeningStartedEvent extends SpeechRecognitionEvent {
    private audioSourceId: string;
    private audioNodeId: string;

    constructor(requestId: string, audioSourceId: string, audioNodeId: string) {
        super("ListeningStartedEvent", requestId);
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
    }

    public get AudioSourceId(): string {
        return this.audioSourceId;
    }

    public get AudioNodeId(): string {
        return this.audioNodeId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ConnectingToServiceEvent extends SpeechRecognitionEvent {
    private authFetchEventid: string;
    private connectionId: string;

    constructor(requestId: string, authFetchEventid: string, connectionId: string) {
        super("ConnectingToServiceEvent", requestId);
        this.authFetchEventid = authFetchEventid;
        this.connectionId = connectionId;
    }

    public get AuthFetchEventid(): string {
        return this.authFetchEventid;
    }

    public get ConnectionId(): string {
        return this.connectionId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class RecognitionStartedEvent extends SpeechRecognitionEvent {
    private audioSourceId: string;
    private audioNodeId: string;
    private authFetchEventId: string;
    private connectionId: string;

    constructor(requestId: string, audioSourceId: string, audioNodeId: string, authFetchEventId: string, connectionId: string) {
        super("RecognitionStartedEvent", requestId);

        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
        this.authFetchEventId = authFetchEventId;
        this.connectionId = connectionId;
    }

    public get AudioSourceId(): string {
        return this.audioSourceId;
    }

    public get AudioNodeId(): string {
        return this.audioNodeId;
    }

    public get AuthFetchEventId(): string {
        return this.authFetchEventId;
    }

    public get ConnectionId(): string {
        return this.connectionId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechStartDetectedEvent extends SpeechRecognitionResultEvent<ISpeechStartDetectedResult> {
    constructor(requestId: string, result: ISpeechStartDetectedResult) {
        super("SpeechStartDetectedEvent", requestId, result);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechHypothesisEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
    constructor(requestId: string, result: ISpeechFragment) {
        super("SpeechHypothesisEvent", requestId, result);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechFragmentEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
    constructor(requestId: string, result: ISpeechFragment) {
        super("SpeechFragmentEvent", requestId, result);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechEndDetectedEvent extends SpeechRecognitionResultEvent<ISpeechEndDetectedResult> {
    constructor(requestId: string, result: ISpeechEndDetectedResult) {
        super("SpeechEndDetectedEvent", requestId, result);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechSimplePhraseEvent extends SpeechRecognitionResultEvent<ISimpleSpeechPhrase> {
    constructor(requestId: string, result: ISimpleSpeechPhrase) {
        super("SpeechSimplePhraseEvent", requestId, result);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class SpeechDetailedPhraseEvent extends SpeechRecognitionResultEvent<IDetailedSpeechPhrase> {
    constructor(requestId: string, result: IDetailedSpeechPhrase) {
        super("SpeechDetailedPhraseEvent", requestId, result);
    }
}

export enum RecognitionCompletionStatus {
    Success,
    AudioSourceError,
    AudioSourceTimeout,
    AuthTokenFetchError,
    AuthTokenFetchTimeout,
    UnAuthorized,
    ConnectTimeout,
    ConnectError,
    ClientRecognitionActivityTimeout,
    UnknownError,
}

// tslint:disable-next-line:max-classes-per-file
export class RecognitionEndedEvent extends SpeechRecognitionEvent {
    private audioSourceId: string;
    private audioNodeId: string;
    private authFetchEventId: string;
    private connectionId: string;
    private serviceTag: string;
    private status: RecognitionCompletionStatus;
    private error: string;

    constructor(
        requestId: string,
        audioSourceId: string,
        audioNodeId: string,
        authFetchEventId: string,
        connectionId: string,
        serviceTag: string,
        status: RecognitionCompletionStatus,
        error: string) {

        super("RecognitionEndedEvent", requestId, status === RecognitionCompletionStatus.Success ? EventType.Info : EventType.Error);

        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
        this.connectionId = connectionId;
        this.authFetchEventId = authFetchEventId;
        this.status = status;
        this.error = error;
        this.serviceTag = serviceTag;
    }

    public get AudioSourceId(): string {
        return this.audioSourceId;
    }

    public get AudioNodeId(): string {
        return this.audioNodeId;
    }

    public get AuthFetchEventId(): string {
        return this.authFetchEventId;
    }

    public get ConnectionId(): string {
        return this.connectionId;
    }

    public get ServiceTag(): string {
        return this.serviceTag;
    }

    public get Status(): RecognitionCompletionStatus {
        return this.status;
    }

    public get Error(): string {
        return this.error;
    }
}
