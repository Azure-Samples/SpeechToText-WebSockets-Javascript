import { EventType, PlatformEvent } from "../../common/Exports";
import { IDetailedSpeechPhrase, ISimpleSpeechPhrase, ISpeechEndDetectedResult, ISpeechFragment, ISpeechStartDetectedResult } from "./SpeechResults";
export declare class SpeechRecognitionEvent extends PlatformEvent {
    private requestId;
    constructor(eventName: string, requestId: string, eventType?: EventType);
    readonly RequestId: string;
}
export declare class SpeechRecognitionResultEvent<TResult> extends SpeechRecognitionEvent {
    private result;
    constructor(eventName: string, requestId: string, result: TResult);
    readonly Result: TResult;
}
export declare class RecognitionTriggeredEvent extends SpeechRecognitionEvent {
    private audioSourceId;
    private audioNodeId;
    constructor(requestId: string, audioSourceId: string, audioNodeId: string);
    readonly AudioSourceId: string;
    readonly AudioNodeId: string;
}
export declare class ListeningStartedEvent extends SpeechRecognitionEvent {
    private audioSourceId;
    private audioNodeId;
    constructor(requestId: string, audioSourceId: string, audioNodeId: string);
    readonly AudioSourceId: string;
    readonly AudioNodeId: string;
}
export declare class ConnectingToServiceEvent extends SpeechRecognitionEvent {
    private authFetchEventid;
    private connectionId;
    constructor(requestId: string, authFetchEventid: string, connectionId: string);
    readonly AuthFetchEventid: string;
    readonly ConnectionId: string;
}
export declare class RecognitionStartedEvent extends SpeechRecognitionEvent {
    private audioSourceId;
    private audioNodeId;
    private authFetchEventId;
    private connectionId;
    constructor(requestId: string, audioSourceId: string, audioNodeId: string, authFetchEventId: string, connectionId: string);
    readonly AudioSourceId: string;
    readonly AudioNodeId: string;
    readonly AuthFetchEventId: string;
    readonly ConnectionId: string;
}
export declare class SpeechStartDetectedEvent extends SpeechRecognitionResultEvent<ISpeechStartDetectedResult> {
    constructor(requestId: string, result: ISpeechStartDetectedResult);
}
export declare class SpeechHypothesisEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
    constructor(requestId: string, result: ISpeechFragment);
}
export declare class SpeechFragmentEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
    constructor(requestId: string, result: ISpeechFragment);
}
export declare class SpeechEndDetectedEvent extends SpeechRecognitionResultEvent<ISpeechEndDetectedResult> {
    constructor(requestId: string, result: ISpeechEndDetectedResult);
}
export declare class SpeechSimplePhraseEvent extends SpeechRecognitionResultEvent<ISimpleSpeechPhrase> {
    constructor(requestId: string, result: ISimpleSpeechPhrase);
}
export declare class SpeechDetailedPhraseEvent extends SpeechRecognitionResultEvent<IDetailedSpeechPhrase> {
    constructor(requestId: string, result: IDetailedSpeechPhrase);
}
export declare enum RecognitionCompletionStatus {
    Success = 0,
    AudioSourceError = 1,
    AudioSourceTimeout = 2,
    AuthTokenFetchError = 3,
    AuthTokenFetchTimeout = 4,
    UnAuthorized = 5,
    ConnectTimeout = 6,
    ConnectError = 7,
    ClientRecognitionActivityTimeout = 8,
    UnknownError = 9,
}
export declare class RecognitionEndedEvent extends SpeechRecognitionEvent {
    private audioSourceId;
    private audioNodeId;
    private authFetchEventId;
    private connectionId;
    private serviceTag;
    private status;
    private error;
    constructor(requestId: string, audioSourceId: string, audioNodeId: string, authFetchEventId: string, connectionId: string, serviceTag: string, status: RecognitionCompletionStatus, error: string);
    readonly AudioSourceId: string;
    readonly AudioNodeId: string;
    readonly AuthFetchEventId: string;
    readonly ConnectionId: string;
    readonly ServiceTag: string;
    readonly Status: RecognitionCompletionStatus;
    readonly Error: string;
}
