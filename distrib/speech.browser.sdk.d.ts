declare namespace Common {
    class GuidGenerator {
        static Create: () => string;
        static CreateGuidWithNoDash: () => string;
    }
}
declare namespace Common {
    interface IStringDictionary<TValue> {
        [propName: string]: TValue;
    }
    interface INumberDictionary<TValue> extends Object {
        [propName: number]: TValue;
    }
}
declare namespace Common {
    enum EventType {
        Debug = 0,
        Info = 1,
        Warning = 2,
        Error = 3,
    }
    class PlatformEvent {
        private eventId;
        private eventTime;
        private eventType;
        private metadata;
        constructor(eventType: EventType);
        readonly EventId: string;
        readonly EventTime: string;
        readonly EventType: EventType;
        readonly Metadata: IStringDictionary<string>;
    }
}
declare namespace Common {
    class AudioSourceEvent extends PlatformEvent {
        private audioSourceId;
        constructor(audioSourceId: string, eventType?: EventType);
        readonly AudioSourceId: string;
    }
    class AudioSourceInitializingEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    class AudioSourceReadyEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    class AudioSourceOffEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    class AudioSourceErrorEvent extends AudioSourceEvent {
        private error;
        constructor(audioSourceId: string, error: string);
        readonly Error: string;
    }
    class AudioStreamNodeEvent extends AudioSourceEvent {
        private audioNodeId;
        constructor(audioSourceId: string, audioNodeId: string);
        readonly AudioNodeId: string;
    }
    class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
        private error;
        constructor(audioSourceId: string, audioNodeId: string, error: string);
        readonly Error: string;
    }
}
declare namespace Common {
    class ArgumentNullError extends Error {
        constructor(argumentName: string);
    }
    class InvalidOperationError extends Error {
        constructor(error: string);
    }
    class ObjectDisposedError extends Error {
        constructor(objectName: string, error?: string);
    }
}
declare namespace Common {
    enum PromiseState {
        None = 0,
        Resolved = 1,
        Rejected = 2,
    }
    interface IPromise<T> {
        Result(): PromiseResult<T>;
        ContinueWith<TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => TContinuationResult): IPromise<TContinuationResult>;
        ContinueWithPromise<TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => IPromise<TContinuationResult>): IPromise<TContinuationResult>;
        OnSuccessContinueWith<TContinuationResult>(continuationCallback: (result: T) => TContinuationResult): IPromise<TContinuationResult>;
        OnSuccessContinueWithPromise<TContinuationResult>(continuationCallback: (result: T) => IPromise<TContinuationResult>): IPromise<TContinuationResult>;
        On(successCallback: (result: T) => void, errorCallback: (error: string) => void): IPromise<T>;
        Finally(callback: () => void): IPromise<T>;
    }
    interface IDeferred<T> {
        State(): PromiseState;
        Promise(): IPromise<T>;
        Resolve(result: T): IDeferred<T>;
        Reject(error: string): IDeferred<T>;
    }
    class PromiseResult<T> {
        protected isCompleted: boolean;
        protected isError: boolean;
        protected error: string;
        protected result: T;
        constructor(promiseResultEventSource: PromiseResultEventSource<T>);
        readonly IsCompleted: boolean;
        readonly IsError: boolean;
        readonly Error: string;
        readonly Result: T;
        ThrowIfError: () => void;
    }
    class PromiseResultEventSource<T> {
        private onSetResult;
        private onSetError;
        SetResult: (result: T) => void;
        SetError: (error: string) => void;
        On: (onSetResult: (result: T) => void, onSetError: (error: string) => void) => void;
    }
    class PromiseHelper {
        static WhenAll: (promises: Promise<any>[]) => Promise<boolean>;
        static FromResult: <TResult>(result: TResult) => Promise<TResult>;
        static FromError: <TResult>(error: string) => Promise<TResult>;
    }
    class Promise<T> implements IPromise<T> {
        private sink;
        constructor(sink: Sink<T>);
        Result: () => PromiseResult<T>;
        ContinueWith: <TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => TContinuationResult) => Promise<TContinuationResult>;
        OnSuccessContinueWith: <TContinuationResult>(continuationCallback: (result: T) => TContinuationResult) => Promise<TContinuationResult>;
        ContinueWithPromise: <TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => Promise<TContinuationResult>) => Promise<TContinuationResult>;
        OnSuccessContinueWithPromise: <TContinuationResult>(continuationCallback: (result: T) => Promise<TContinuationResult>) => Promise<TContinuationResult>;
        On: (successCallback: (result: T) => void, errorCallback: (error: string) => void) => Promise<T>;
        Finally: (callback: () => void) => Promise<T>;
    }
    class Deferred<T> implements IDeferred<T> {
        private promise;
        private sink;
        constructor();
        State: () => PromiseState;
        Promise: () => Promise<T>;
        Resolve: (result: T) => Deferred<T>;
        Reject: (error: string) => Deferred<T>;
    }
    class Sink<T> {
        private state;
        private promiseResult;
        private promiseResultEvents;
        private successHandlers;
        private errorHandlers;
        constructor();
        readonly State: PromiseState;
        readonly Result: PromiseResult<T>;
        Resolve: (result: T) => void;
        Reject: (error: string) => void;
        on: (successCallback: (result: T) => void, errorCallback: (error: string) => void) => void;
        private ExecuteSuccessCallback;
        private ExecuteErrorCallback;
        private DetachHandlers;
    }
}
declare namespace Common {
    enum MessageType {
        Text = 0,
        Binary = 1,
    }
    class ConnectionMessage {
        private messageType;
        private headers;
        private body;
        private id;
        constructor(messageType: MessageType, body: any, headers?: IStringDictionary<string>, id?: string);
        readonly MessageType: MessageType;
        readonly Headers: any;
        readonly Body: any;
        readonly TextBody: string;
        readonly BinaryBody: ArrayBuffer;
        readonly Id: string;
    }
}
declare namespace Common {
    class ConnectionEvent extends PlatformEvent {
        private connectionId;
        constructor(connectionId: string, eventType?: EventType);
        readonly ConnectionId: string;
    }
    class ConnectionStartEvent extends ConnectionEvent {
        private uri;
        private headers;
        constructor(connectionId: string, uri: string, headers?: IStringDictionary<string>);
        readonly Uri: string;
        readonly Headers: IStringDictionary<string>;
    }
    class ConnectionEstablishedEvent extends ConnectionEvent {
        constructor(connectionId: string, metadata?: IStringDictionary<string>);
    }
    class ConnectionClosedEvent extends ConnectionEvent {
        private reason;
        private statusCode;
        constructor(connectionId: string, statusCode: number, reason: string);
        readonly Reason: string;
        readonly StatusCode: number;
    }
    class ConnectionEstablishErrorEvent extends ConnectionEvent {
        private statusCode;
        private reason;
        constructor(connectionId: string, statuscode: number, reason: string);
        readonly Reason: string;
        readonly StatusCode: number;
    }
    class ConnectionMessageReceivedEvent extends ConnectionEvent {
        private networkReceivedTime;
        private message;
        constructor(connectionId: string, networkReceivedTimeISO: string, message: ConnectionMessage);
        readonly NetworkReceivedTime: string;
        readonly Message: ConnectionMessage;
    }
    class ConnectionMessageSentEvent extends ConnectionEvent {
        private networkSentTime;
        private message;
        constructor(connectionId: string, networkSentTimeISO: string, message: ConnectionMessage);
        readonly NetworkSentTime: string;
        readonly Message: ConnectionMessage;
    }
}
declare namespace Common {
    class ConnectionOpenResponse {
        private statusCode;
        private reason;
        constructor(statusCode: number, reason: string);
        readonly StatusCode: number;
        readonly Reason: string;
    }
}
declare namespace Common {
    interface IDisposable {
        IsDisposed(): boolean;
        Dispose(reason?: string): void;
    }
}
declare namespace Common {
    interface IDetachable {
        Detach(): void;
    }
}
declare namespace Common {
    interface IEventListener<TEvent extends PlatformEvent> {
        OnEvent(e: TEvent): void;
    }
    interface IEventSource<TEvent extends PlatformEvent> extends IDisposable {
        Metadata: IStringDictionary<string>;
        OnEvent(e: TEvent): void;
        Attach(onEventCallback: (event: TEvent) => void): IDetachable;
        AttachListener(listener: IEventListener<TEvent>): IDetachable;
    }
}
declare namespace Common {
    class EventSource<TEvent extends PlatformEvent> implements IEventSource<TEvent> {
        private eventListeners;
        private metadata;
        private isDisposed;
        constructor(metadata?: IStringDictionary<string>);
        OnEvent: (event: TEvent) => void;
        Attach: (onEventCallback: (event: TEvent) => void) => IDetachable;
        AttachListener: (listener: IEventListener<TEvent>) => IDetachable;
        IsDisposed: () => boolean;
        Dispose: () => void;
        readonly Metadata: IStringDictionary<string>;
    }
}
declare namespace Common {
    class Events {
        private static instance;
        static SetEventSource: (eventSource: IEventSource<PlatformEvent>) => void;
        static readonly Instance: IEventSource<PlatformEvent>;
    }
}
declare namespace Common {
    interface IList<TItem> extends IDisposable {
        Get(itemIndex: number): TItem;
        First(): TItem;
        Last(): TItem;
        Add(item: TItem): void;
        InsertAt(index: number, item: TItem): void;
        RemoveFirst(): TItem;
        RemoveLast(): TItem;
        RemoveAt(index: number): TItem;
        Remove(index: number, count: number): TItem[];
        Clear(): void;
        Length(): number;
        OnAdded(addedCallback: () => void): IDetachable;
        OnRemoved(removedCallback: () => void): IDetachable;
        OnDisposed(disposedCallback: () => void): IDetachable;
        Join(seperator?: string): string;
        ToArray(): TItem[];
        Any(callback?: (item: TItem, index: number) => boolean): boolean;
        All(callback: (item: TItem) => boolean): boolean;
        ForEach(callback: (item: TItem, index: number) => void): void;
        Select<T2>(callback: (item: TItem, index: number) => T2): List<T2>;
        Where(callback: (item: TItem, index: number) => boolean): List<TItem>;
        OrderBy(compareFn: (a: TItem, b: TItem) => number): List<TItem>;
        OrderByDesc(compareFn: (a: TItem, b: TItem) => number): List<TItem>;
        Clone(): List<TItem>;
        Concat(list: List<TItem>): List<TItem>;
        ConcatArray(array: TItem[]): List<TItem>;
    }
    class List<TItem> implements IList<TItem> {
        private list;
        private subscriptionIdCounter;
        private addSubscriptions;
        private removeSubscriptions;
        private disposedSubscriptions;
        private disposeReason;
        constructor(list?: TItem[]);
        Get: (itemIndex: number) => TItem;
        First: () => TItem;
        Last: () => TItem;
        Add: (item: TItem) => void;
        InsertAt: (index: number, item: TItem) => void;
        RemoveFirst: () => TItem;
        RemoveLast: () => TItem;
        RemoveAt: (index: number) => TItem;
        Remove: (index: number, count: number) => TItem[];
        Clear: () => void;
        Length: () => number;
        OnAdded: (addedCallback: () => void) => IDetachable;
        OnRemoved: (removedCallback: () => void) => IDetachable;
        OnDisposed: (disposedCallback: () => void) => IDetachable;
        Join: (seperator?: string) => string;
        ToArray: () => TItem[];
        Any: (callback?: (item: TItem, index: number) => boolean) => boolean;
        All: (callback: (item: TItem) => boolean) => boolean;
        ForEach: (callback: (item: TItem, index: number) => void) => void;
        Select: <T2>(callback: (item: TItem, index: number) => T2) => List<T2>;
        Where: (callback: (item: TItem, index: number) => boolean) => List<TItem>;
        OrderBy: (compareFn: (a: TItem, b: TItem) => number) => List<TItem>;
        OrderByDesc: (compareFn: (a: TItem, b: TItem) => number) => List<TItem>;
        Clone: () => List<TItem>;
        Concat: (list: List<TItem>) => List<TItem>;
        ConcatArray: (array: TItem[]) => List<TItem>;
        IsDisposed: () => boolean;
        Dispose: (reason?: string) => void;
        private ThrowIfDisposed;
        private TriggerSubscriptions;
    }
}
declare namespace Common {
    interface IQueue<TItem> extends IDisposable {
        Enqueue(item: TItem): void;
        EnqueueFromPromise(promise: Promise<TItem>): void;
        Dequeue(): Promise<TItem>;
        Peek(): Promise<TItem>;
        Length(): number;
    }
    class Queue<TItem> implements IQueue<TItem> {
        private promiseStore;
        private list;
        private detachables;
        private subscribers;
        private isDrainInProgress;
        private isDisposing;
        private disposeReason;
        constructor(list?: List<TItem>);
        Enqueue: (item: TItem) => void;
        EnqueueFromPromise: (promise: Promise<TItem>) => void;
        Dequeue: () => Promise<TItem>;
        Peek: () => Promise<TItem>;
        Length: () => number;
        IsDisposed: () => boolean;
        DrainAndDispose: (pendingItemProcessor: (pendingItemInQueue: TItem) => void, reason?: string) => Promise<boolean>;
        Dispose: (reason?: string) => void;
        private Drain;
        private ThrowIfDispose;
    }
}
declare namespace Common {
    interface IStreamChunk<TBuffer> {
        IsEnd: boolean;
        Buffer: TBuffer;
    }
    class Stream<TBuffer> {
        private id;
        private readerIdCounter;
        private streambuffer;
        private isEnded;
        private readerQueues;
        constructor(streamId?: string);
        readonly IsClosed: boolean;
        readonly Id: string;
        Write: (buffer: TBuffer) => void;
        GetReader: () => StreamReader<TBuffer>;
        Close: () => void;
        private WriteStreamChunk;
        private ThrowIfClosed;
    }
    class StreamReader<TBuffer> {
        private readerQueue;
        private onClose;
        private isClosed;
        private streamId;
        constructor(streamId: string, readerQueue: Queue<IStreamChunk<TBuffer>>, onClose: () => void);
        readonly IsClosed: boolean;
        readonly StreamId: string;
        Read: () => Promise<IStreamChunk<TBuffer>>;
        Close: () => void;
    }
}
declare namespace Common {
    interface IAudioSource {
        Id(): string;
        TurnOn(): Promise<boolean>;
        Attach(audioNodeId: string): Promise<IAudioStreamNode>;
        Detach(audioNodeId: string): void;
        TurnOff(): Promise<boolean>;
        Events: EventSource<AudioSourceEvent>;
    }
    interface IAudioStreamNode extends IDetachable {
        Id(): string;
        Read(): Promise<IStreamChunk<ArrayBuffer>>;
    }
}
declare namespace Common {
    enum ConnectionState {
        None = 0,
        Connected = 1,
        Connecting = 2,
        Disconnected = 3,
    }
    interface IConnection extends IDisposable {
        Id: string;
        State(): ConnectionState;
        Open(): Promise<ConnectionOpenResponse>;
        Send(message: ConnectionMessage): Promise<boolean>;
        Read(): Promise<ConnectionMessage>;
        Events: EventSource<ConnectionEvent>;
    }
}
declare namespace Common {
    interface IKeyValueStorage {
        Get(key: string): string;
        GetOrAdd(key: string, valueToAdd: string): string;
        Set(key: string, value: string): void;
        Remove(key: string): void;
    }
}
declare namespace Common {
    class InMemoryStorage implements IKeyValueStorage {
        private store;
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare namespace Common {
    interface ITimer {
        start(): void;
        stop(): void;
    }
}
declare namespace Common {
    class RawWebsocketMessage {
        private messageType;
        private payload;
        private id;
        constructor(messageType: MessageType, payload: any, id?: string);
        readonly MessageType: MessageType;
        readonly Payload: any;
        readonly TextContent: string;
        readonly BinaryContent: ArrayBuffer;
        readonly Id: string;
    }
}
declare namespace Common {
    interface IWebsocketMessageFormatter {
        ToConnectionMessage(message: RawWebsocketMessage): Promise<ConnectionMessage>;
        FromConnectionMessage(message: ConnectionMessage): Promise<RawWebsocketMessage>;
    }
}
declare namespace Common {
    class RiffPcmEncoder {
        private actualSampleRate;
        private desiredSampleRate;
        private channelCount;
        constructor(actualSampleRate: number, desiredSampleRate: number);
        Encode: (isFirstAudioFrame: boolean, actualAudioFrame: Float32Array) => ArrayBuffer;
        private SetString;
        private FloatTo16BitPCM;
        private DownSampleAudioFrame;
    }
}
declare namespace Common {
    class Storage {
        private static sessionStorage;
        private static localStorage;
        static SetSessionStorage: (sessionStorage: IKeyValueStorage) => void;
        static SetLocalStorage: (localStorage: IKeyValueStorage) => void;
        static readonly Session: IKeyValueStorage;
        static readonly Local: IKeyValueStorage;
    }
}
declare namespace Common.Browser {
    class ConsoleLoggingListener implements IEventListener<PlatformEvent> {
        private logLevelFilter;
        constructor(logLevelFilter?: EventType);
        OnEvent: (event: PlatformEvent) => void;
        private ToString;
    }
}
declare namespace Common.Browser {
    interface IRecorder {
        Record(mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void;
        ReleaseMediaResources(): void;
    }
}
declare namespace Common.Browser {
    class LocalStorage implements IKeyValueStorage {
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare namespace Common.Browser {
    class MicAudioSource implements IAudioSource {
        private streams;
        private id;
        private events;
        private initializeDeferral;
        private recorder;
        private mediaStream;
        constructor(recorder: IRecorder, audioSourceId?: string);
        TurnOn: () => Promise<boolean>;
        Id: () => string;
        Attach: (audioNodeId: string) => Promise<IAudioStreamNode>;
        Detach: (audioNodeId: string) => void;
        TurnOff: () => Promise<boolean>;
        readonly Events: EventSource<AudioSourceEvent>;
        private Listen;
        private OnEvent;
    }
}
declare namespace Common.Browser {
    class OpusRecorder implements IRecorder {
        private mediaResources;
        private mediaRecorderOptions;
        constructor(options?: {
            mimeType: string;
            bitsPerSecond: number;
        });
        Record: (mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>) => void;
        ReleaseMediaResources: () => void;
    }
}
declare namespace Common.Browser {
    class PcmRecorder implements IRecorder {
        private mediaResources;
        Record: (mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>) => void;
        ReleaseMediaResources: () => void;
    }
}
declare namespace Common.Browser {
    class SessionStorage implements IKeyValueStorage {
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare namespace Common.Browser {
    class Timer implements ITimer {
        private delayInMillisec;
        private timerId;
        private successCallback;
        constructor(delayInMillisec: number, successCallback: any);
        start: (...params: any[]) => void;
        stop: () => void;
    }
}
declare namespace Common.Browser {
    class WebsocketMessageAdapter {
        private connectionState;
        private messageFormatter;
        private websocketClient;
        private sendMessageQueue;
        private receivingMessageQueue;
        private connectionEstablishDeferral;
        private disconnectDeferral;
        private connectionEvents;
        private connectionId;
        private uri;
        constructor(uri: string, connectionId: string, messageFormatter: IWebsocketMessageFormatter);
        readonly State: ConnectionState;
        Open: () => Promise<ConnectionOpenResponse>;
        Send: (message: ConnectionMessage) => Promise<boolean>;
        Read: () => Promise<ConnectionMessage>;
        Close: (reason?: string) => Promise<boolean>;
        readonly Events: EventSource<PlatformEvent>;
        private SendRawMessage;
        private OnClose;
        private ProcessSendQueue;
        private OnEvent;
    }
}
declare namespace Common.Browser {
    class WebsocketConnection implements IConnection {
        private uri;
        private messageFormatter;
        private connectionMessageAdapter;
        private id;
        private isDisposed;
        constructor(uri: string, queryParameters: IStringDictionary<string>, headers: IStringDictionary<string>, messageFormatter: IWebsocketMessageFormatter, connectionId?: string);
        Dispose: () => void;
        IsDisposed: () => boolean;
        readonly Id: string;
        State: () => ConnectionState;
        Open: () => Promise<ConnectionOpenResponse>;
        Send: (message: ConnectionMessage) => Promise<boolean>;
        Read: () => Promise<ConnectionMessage>;
        readonly Events: EventSource<PlatformEvent>;
    }
}
declare namespace Speech {
    import Promise = Common.Promise;
    interface IAuthentication {
        Fetch(authFetchEventId: string): Promise<AuthInfo>;
        FetchOnExpiry(authFetchEventId: string): Promise<AuthInfo>;
    }
    class AuthInfo {
        private headerName;
        private token;
        constructor(headerName: string, token: string);
        readonly HeaderName: string;
        readonly Token: string;
    }
}
declare namespace Speech {
    import Promise = Common.Promise;
    class CognitiveSubscriptionKeyAuthentication implements IAuthentication {
        private authInfo;
        constructor(subscriptionKey: string);
        Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
        FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
    }
}
declare namespace Speech {
    import Promise = Common.Promise;
    class CognitiveTokenAuthentication implements IAuthentication {
        private fetchCallback;
        private fetchOnExpiryCallback;
        constructor(fetchCallback: (authFetchEventId: string) => Promise<string>, fetchOnExpiryCallback: (authFetchEventId: string) => Promise<string>);
        Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
        FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
    }
}
declare namespace Speech {
    import IStringDictionary = Common.IStringDictionary;
    import MessageType = Common.MessageType;
    class ConnectionMessage extends Common.ConnectionMessage {
        private path;
        private requestId;
        private contentType;
        private additionalHeaders;
        constructor(messageType: MessageType, path: string, requestId: string, contentType: string, body: any, additionalHeaders?: IStringDictionary<string>, id?: string);
        readonly Path: string;
        readonly RequestId: string;
        readonly ContentType: string;
        readonly AdditionalHeaders: IStringDictionary<string>;
        static FromConnectionMessage: (message: Common.ConnectionMessage) => ConnectionMessage;
    }
}
declare namespace Speech {
    class SpeechConfig {
        private context;
        constructor(context: Context);
        Serialize: () => string;
        readonly Context: Context;
    }
    class Context {
        private system;
        private os;
        private device;
        constructor(os: OS, device: Device);
        readonly System: System;
        readonly OS: OS;
        readonly Device: Device;
    }
    class System {
        private version;
        constructor();
        readonly Version: string;
    }
    class OS {
        private platform;
        private name;
        private version;
        constructor(platform: string, name: string, version: string);
        readonly Platform: string;
        readonly Name: string;
        readonly Version: string;
    }
    class Device {
        private manufacturer;
        private model;
        private version;
        constructor(manufacturer: string, model: string, version: string);
        readonly Manufacturer: string;
        readonly Model: string;
        readonly Version: string;
    }
}
declare namespace Speech {
    enum RecognitionMode {
        Interactive = 0,
        Conversation = 1,
        Dictation = 2,
    }
    enum SpeechResultFormat {
        Simple = 0,
        Detailed = 1,
    }
    class RecognizerConfig {
        private recognitionMode;
        private language;
        private format;
        private speechConfig;
        private recognitionActivityTimeout;
        constructor(platformConfig: SpeechConfig, recognitionMode?: RecognitionMode, language?: string, format?: SpeechResultFormat);
        readonly RecognitionMode: RecognitionMode;
        readonly Language: string;
        readonly Format: SpeechResultFormat;
        readonly SpeechConfig: SpeechConfig;
        readonly RecognitionActivityTimeout: number;
        readonly IsContinuousRecognition: boolean;
    }
}
declare namespace Speech {
    interface IConnectionFactory {
        Create(config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string): Common.IConnection;
    }
}
declare namespace Speech {
    enum RecognitionStatus {
        Success = 0,
        NoMatch = 1,
        InitialSilenceTimeout = 2,
        BabbleTimeout = 3,
        Error = 4,
        EndOfDictation = 5,
    }
    interface ISpeechStartDetectedResult {
        Offset?: number;
    }
    interface ISpeechHypothesisResult {
        Text: string;
        Offset?: number;
        Duration?: number;
    }
    interface ISpeechEndDetectedResult {
        Offset?: number;
    }
    interface ISimpleSpeechPhrase {
        RecognitionStatus: RecognitionStatus;
        DisplayText: string;
        Duration?: number;
        Offset?: number;
    }
    interface IDetailedSpeechPhrase {
        RecognitionStatus: RecognitionStatus;
        NBest: IPhrase[];
        Duration?: number;
        Offset?: number;
    }
    interface IPhrase {
        Confidence?: number;
        Lexical: string;
        ITN: string;
        MaskedITN: string;
        Display: string;
    }
}
declare namespace Speech {
    import PlatformEvent = Common.PlatformEvent;
    import EventType = Common.EventType;
    class SpeechRecognitionEvent extends PlatformEvent {
        private eventName;
        private requestId;
        constructor(eventName: string, requestId: string, eventType?: EventType);
        readonly Name: string;
        readonly RequestId: string;
    }
    class SpeechRecognitionResultEvent<TResult> extends SpeechRecognitionEvent {
        private result;
        constructor(eventName: string, requestId: string, result: TResult);
        readonly Result: TResult;
    }
    class RecognitionTriggeredEvent extends SpeechRecognitionEvent {
        private audioSourceId;
        private audioNodeId;
        constructor(requestId: string, audioSourceId: string, audioNodeId: string);
        readonly AudioSourceId: string;
        readonly AudioNodeId: string;
    }
    class ListeningStartedEvent extends SpeechRecognitionEvent {
        private audioSourceId;
        private audioNodeId;
        constructor(requestId: string, audioSourceId: string, audioNodeId: string);
        readonly AudioSourceId: string;
        readonly AudioNodeId: string;
    }
    class ConnectingToServiceEvent extends SpeechRecognitionEvent {
        private authFetchEventid;
        private connectionId;
        constructor(requestId: string, authFetchEventid: string, connectionId: string);
        readonly AuthFetchEventid: string;
        readonly ConnectionId: string;
    }
    class RecognitionStartedEvent extends SpeechRecognitionEvent {
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
    class SpeechStartDetectedEvent extends SpeechRecognitionResultEvent<ISpeechStartDetectedResult> {
        constructor(requestId: string, result: ISpeechStartDetectedResult);
    }
    class SpeechHypothesisEvent extends SpeechRecognitionResultEvent<ISpeechHypothesisResult> {
        constructor(requestId: string, result: ISpeechHypothesisResult);
    }
    class SpeechEndDetectedEvent extends SpeechRecognitionResultEvent<ISpeechEndDetectedResult> {
        constructor(requestId: string, result: ISpeechEndDetectedResult);
    }
    class SpeechSimplePhraseEvent extends SpeechRecognitionResultEvent<ISimpleSpeechPhrase> {
        constructor(requestId: string, result: ISimpleSpeechPhrase);
    }
    class SpeechDetailedPhraseEvent extends SpeechRecognitionResultEvent<IDetailedSpeechPhrase> {
        constructor(requestId: string, result: IDetailedSpeechPhrase);
    }
    enum RecognitionCompletionStatus {
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
    class RecognitionEndedEvent extends SpeechRecognitionEvent {
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
}
declare namespace Speech {
    import IEventListener = Common.IEventListener;
    import PlatformEvent = Common.PlatformEvent;
    class ServiceTelemetryListener implements IEventListener<PlatformEvent> {
        private isDisposed;
        private requestId;
        private audioSourceId;
        private audioNodeId;
        private listeningTriggerMetric;
        private micMetric;
        private connectionEstablishMetric;
        private micStartTime;
        private connectionId;
        private connectionStartTime;
        private receivedMessages;
        constructor(requestId: string, audioSourceId: string, audioNodeId: string);
        OnEvent: (e: PlatformEvent) => void;
        GetTelemetry: () => string;
        Dispose: () => void;
        private GetConnectionError;
    }
}
declare namespace Speech {
    import Promise = Common.Promise;
    import IAudioSource = Common.IAudioSource;
    class Recognizer {
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
}
declare namespace Speech {
    import Promise = Common.Promise;
    import IWebsocketMessageFormatter = Common.IWebsocketMessageFormatter;
    import RawWebsocketMessage = Common.RawWebsocketMessage;
    class WebsocketMessageFormatter implements IWebsocketMessageFormatter {
        ToConnectionMessage: (message: RawWebsocketMessage) => Promise<Common.ConnectionMessage>;
        FromConnectionMessage: (message: Common.ConnectionMessage) => Promise<RawWebsocketMessage>;
        private MakeHeaders;
        private ParseHeaders;
    }
}
declare namespace Speech.Browser {
    import IConnection = Common.IConnection;
    class SpeechConnectionFactory implements IConnectionFactory {
        Create: (config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string) => IConnection;
        private readonly Host;
        private readonly InteractiveRelativeUri;
        private readonly ConversationRelativeUri;
        private readonly DictationRelativeUri;
        private readonly IsDebugModeEnabled;
    }
}
declare namespace Speech.Browser {
    class Recognizer {
        static Create: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Speech.Recognizer;
        static CreateWithPcmRecorder: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Speech.Recognizer;
        static CreateWithCustomAudioSource: (recognizerConfig: RecognizerConfig, authentication: IAuthentication, audioSource: Common.IAudioSource) => Speech.Recognizer;
    }
}
