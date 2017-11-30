import { IAudioSource, Promise } from "../../common/Exports";
import { IAuthentication } from "./IAuthentication";
import { IConnectionFactory } from "./IConnectionFactory";
import { SpeechRecognitionEvent } from "./RecognitionEvents";
import { RecognizerConfig } from "./RecognizerConfig";
export declare class Recognizer {
    private authentication;
    private connectionFactory;
    private audioSource;
    private recognizerConfig;
    private speechConfigConnectionId;
    private connectionFetchPromise;
    private connectionId;
    private authFetchEventId;
    constructor(authentication: IAuthentication, connectionFactory: IConnectionFactory, audioSource: IAudioSource, recognizerConfig: RecognizerConfig);
    readonly AudioSource: IAudioSource;
    Recognize: (onEventCallback: (event: SpeechRecognitionEvent) => void, speechContextJson?: string) => Promise<boolean>;
    private FetchConnection;
    private ReceiveMessage;
    private SendSpeechConfig;
    private SendSpeechContext;
    private SendTelemetryData;
    private SendAudio;
}
