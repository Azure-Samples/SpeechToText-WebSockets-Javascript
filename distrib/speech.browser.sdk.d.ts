declare module "src/common/Guid" {
    const CreateGuid: () => string;
    const CreateNoDashGuid: () => string;
    export { CreateGuid, CreateNoDashGuid };
}
declare module "src/common/IDictionary" {
    export interface IStringDictionary<TValue> {
        [propName: string]: TValue;
    }
    export interface INumberDictionary<TValue> extends Object {
        [propName: number]: TValue;
    }
}
declare module "src/common/PlatformEvent" {
    import { IStringDictionary } from "src/common/IDictionary";
    export enum EventType {
        Debug = 0,
        Info = 1,
        Warning = 2,
        Error = 3,
    }
    export class PlatformEvent {
        private name;
        private eventId;
        private eventTime;
        private eventType;
        private metadata;
        constructor(eventName: string, eventType: EventType);
        readonly Name: string;
        readonly EventId: string;
        readonly EventTime: string;
        readonly EventType: EventType;
        readonly Metadata: IStringDictionary<string>;
    }
}
declare module "src/common/AudioSourceEvents" {
    import { EventType, PlatformEvent } from "src/common/PlatformEvent";
    export class AudioSourceEvent extends PlatformEvent {
        private audioSourceId;
        constructor(eventName: string, audioSourceId: string, eventType?: EventType);
        readonly AudioSourceId: string;
    }
    export class AudioSourceInitializingEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    export class AudioSourceReadyEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    export class AudioSourceOffEvent extends AudioSourceEvent {
        constructor(audioSourceId: string);
    }
    export class AudioSourceErrorEvent extends AudioSourceEvent {
        private error;
        constructor(audioSourceId: string, error: string);
        readonly Error: string;
    }
    export class AudioStreamNodeEvent extends AudioSourceEvent {
        private audioNodeId;
        constructor(eventName: string, audioSourceId: string, audioNodeId: string);
        readonly AudioNodeId: string;
    }
    export class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    export class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    export class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
        constructor(audioSourceId: string, audioNodeId: string);
    }
    export class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
        private error;
        constructor(audioSourceId: string, audioNodeId: string, error: string);
        readonly Error: string;
    }
}
declare module "src/common/Error" {
    export class ArgumentNullError extends Error {
        constructor(argumentName: string);
    }
    export class InvalidOperationError extends Error {
        constructor(error: string);
    }
    export class ObjectDisposedError extends Error {
        constructor(objectName: string, error?: string);
    }
}
declare module "src/common/ConnectionMessage" {
    import { IStringDictionary } from "src/common/IDictionary";
    export enum MessageType {
        Text = 0,
        Binary = 1,
    }
    export class ConnectionMessage {
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
declare module "src/common/ConnectionEvents" {
    import { ConnectionMessage } from "src/common/ConnectionMessage";
    import { IStringDictionary } from "src/common/IDictionary";
    import { EventType, PlatformEvent } from "src/common/PlatformEvent";
    export class ConnectionEvent extends PlatformEvent {
        private connectionId;
        constructor(eventName: string, connectionId: string, eventType?: EventType);
        readonly ConnectionId: string;
    }
    export class ConnectionStartEvent extends ConnectionEvent {
        private uri;
        private headers;
        constructor(connectionId: string, uri: string, headers?: IStringDictionary<string>);
        readonly Uri: string;
        readonly Headers: IStringDictionary<string>;
    }
    export class ConnectionEstablishedEvent extends ConnectionEvent {
        constructor(connectionId: string, metadata?: IStringDictionary<string>);
    }
    export class ConnectionClosedEvent extends ConnectionEvent {
        private reason;
        private statusCode;
        constructor(connectionId: string, statusCode: number, reason: string);
        readonly Reason: string;
        readonly StatusCode: number;
    }
    export class ConnectionEstablishErrorEvent extends ConnectionEvent {
        private statusCode;
        private reason;
        constructor(connectionId: string, statuscode: number, reason: string);
        readonly Reason: string;
        readonly StatusCode: number;
    }
    export class ConnectionMessageReceivedEvent extends ConnectionEvent {
        private networkReceivedTime;
        private message;
        constructor(connectionId: string, networkReceivedTimeISO: string, message: ConnectionMessage);
        readonly NetworkReceivedTime: string;
        readonly Message: ConnectionMessage;
    }
    export class ConnectionMessageSentEvent extends ConnectionEvent {
        private networkSentTime;
        private message;
        constructor(connectionId: string, networkSentTimeISO: string, message: ConnectionMessage);
        readonly NetworkSentTime: string;
        readonly Message: ConnectionMessage;
    }
}
declare module "src/common/ConnectionOpenResponse" {
    export class ConnectionOpenResponse {
        private statusCode;
        private reason;
        constructor(statusCode: number, reason: string);
        readonly StatusCode: number;
        readonly Reason: string;
    }
}
declare module "src/common/IDetachable" {
    export interface IDetachable {
        Detach(): void;
    }
}
declare module "src/common/IDisposable" {
    export interface IDisposable {
        IsDisposed(): boolean;
        Dispose(reason?: string): void;
    }
}
declare module "src/common/IEventSource" {
    import { IDetachable } from "src/common/IDetachable";
    import { IStringDictionary } from "src/common/IDictionary";
    import { IDisposable } from "src/common/IDisposable";
    import { PlatformEvent } from "src/common/PlatformEvent";
    export interface IEventListener<TEvent extends PlatformEvent> {
        OnEvent(e: TEvent): void;
    }
    export interface IEventSource<TEvent extends PlatformEvent> extends IDisposable {
        Metadata: IStringDictionary<string>;
        OnEvent(e: TEvent): void;
        Attach(onEventCallback: (event: TEvent) => void): IDetachable;
        AttachListener(listener: IEventListener<TEvent>): IDetachable;
    }
}
declare module "src/common/EventSource" {
    import { IDetachable } from "src/common/IDetachable";
    import { IStringDictionary } from "src/common/IDictionary";
    import { IEventListener, IEventSource } from "src/common/IEventSource";
    import { PlatformEvent } from "src/common/PlatformEvent";
    export class EventSource<TEvent extends PlatformEvent> implements IEventSource<TEvent> {
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
declare module "src/common/Events" {
    import { IEventSource } from "src/common/IEventSource";
    import { PlatformEvent } from "src/common/PlatformEvent";
    export class Events {
        private static instance;
        static SetEventSource: (eventSource: IEventSource<PlatformEvent>) => void;
        static readonly Instance: IEventSource<PlatformEvent>;
    }
}
declare module "src/common/Promise" {
    export enum PromiseState {
        None = 0,
        Resolved = 1,
        Rejected = 2,
    }
    export interface IPromise<T> {
        Result(): PromiseResult<T>;
        ContinueWith<TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => TContinuationResult): IPromise<TContinuationResult>;
        ContinueWithPromise<TContinuationResult>(continuationCallback: (promiseResult: PromiseResult<T>) => IPromise<TContinuationResult>): IPromise<TContinuationResult>;
        OnSuccessContinueWith<TContinuationResult>(continuationCallback: (result: T) => TContinuationResult): IPromise<TContinuationResult>;
        OnSuccessContinueWithPromise<TContinuationResult>(continuationCallback: (result: T) => IPromise<TContinuationResult>): IPromise<TContinuationResult>;
        On(successCallback: (result: T) => void, errorCallback: (error: string) => void): IPromise<T>;
        Finally(callback: () => void): IPromise<T>;
    }
    export interface IDeferred<T> {
        State(): PromiseState;
        Promise(): IPromise<T>;
        Resolve(result: T): IDeferred<T>;
        Reject(error: string): IDeferred<T>;
    }
    export class PromiseResult<T> {
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
    export class PromiseResultEventSource<T> {
        private onSetResult;
        private onSetError;
        SetResult: (result: T) => void;
        SetError: (error: string) => void;
        On: (onSetResult: (result: T) => void, onSetError: (error: string) => void) => void;
    }
    export class PromiseHelper {
        static WhenAll: (promises: Promise<any>[]) => Promise<boolean>;
        static FromResult: <TResult>(result: TResult) => Promise<TResult>;
        static FromError: <TResult>(error: string) => Promise<TResult>;
    }
    export class Promise<T> implements IPromise<T> {
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
    export class Deferred<T> implements IDeferred<T> {
        private promise;
        private sink;
        constructor();
        State: () => PromiseState;
        Promise: () => Promise<T>;
        Resolve: (result: T) => Deferred<T>;
        Reject: (error: string) => Deferred<T>;
    }
    export class Sink<T> {
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
declare module "src/common/List" {
    import { IDetachable } from "src/common/IDetachable";
    import { IDisposable } from "src/common/IDisposable";
    export interface IList<TItem> extends IDisposable {
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
    export class List<TItem> implements IList<TItem> {
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
declare module "src/common/Queue" {
    import { IDisposable } from "src/common/IDisposable";
    import { List } from "src/common/List";
    import { Promise } from "src/common/Promise";
    export interface IQueue<TItem> extends IDisposable {
        Enqueue(item: TItem): void;
        EnqueueFromPromise(promise: Promise<TItem>): void;
        Dequeue(): Promise<TItem>;
        Peek(): Promise<TItem>;
        Length(): number;
    }
    export class Queue<TItem> implements IQueue<TItem> {
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
declare module "src/common/Stream" {
    import { Promise } from "src/common/Promise";
    import { Queue } from "src/common/Queue";
    import { IStreamChunk } from "src/common/Stream";
    export interface IStreamChunk<TBuffer> {
        IsEnd: boolean;
        Buffer: TBuffer;
    }
    export class Stream<TBuffer> {
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
    export class StreamReader<TBuffer> {
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
declare module "src/common/IAudioSource" {
    import { AudioSourceEvent } from "src/common/AudioSourceEvents";
    import { EventSource } from "src/common/EventSource";
    import { IDetachable } from "src/common/IDetachable";
    import { Promise } from "src/common/Promise";
    import { IStreamChunk } from "src/common/Stream";
    export interface IAudioSource {
        Id(): string;
        TurnOn(): Promise<boolean>;
        Attach(audioNodeId: string): Promise<IAudioStreamNode>;
        Detach(audioNodeId: string): void;
        TurnOff(): Promise<boolean>;
        Events: EventSource<AudioSourceEvent>;
    }
    export interface IAudioStreamNode extends IDetachable {
        Id(): string;
        Read(): Promise<IStreamChunk<ArrayBuffer>>;
    }
}
declare module "src/common/IConnection" {
    import { ConnectionEvent } from "src/common/ConnectionEvents";
    import { ConnectionMessage } from "src/common/ConnectionMessage";
    import { ConnectionOpenResponse } from "src/common/ConnectionOpenResponse";
    import { EventSource } from "src/common/EventSource";
    import { IDisposable } from "src/common/IDisposable";
    import { Promise } from "src/common/Promise";
    export enum ConnectionState {
        None = 0,
        Connected = 1,
        Connecting = 2,
        Disconnected = 3,
    }
    export interface IConnection extends IDisposable {
        Id: string;
        State(): ConnectionState;
        Open(): Promise<ConnectionOpenResponse>;
        Send(message: ConnectionMessage): Promise<boolean>;
        Read(): Promise<ConnectionMessage>;
        Events: EventSource<ConnectionEvent>;
    }
}
declare module "src/common/IKeyValueStorage" {
    export interface IKeyValueStorage {
        Get(key: string): string;
        GetOrAdd(key: string, valueToAdd: string): string;
        Set(key: string, value: string): void;
        Remove(key: string): void;
    }
}
declare module "src/common/InMemoryStorage" {
    import { IKeyValueStorage } from "src/common/IKeyValueStorage";
    export class InMemoryStorage implements IKeyValueStorage {
        private store;
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare module "src/common/ITimer" {
    export interface ITimer {
        start(): void;
        stop(): void;
    }
}
declare module "src/common/RawWebsocketMessage" {
    import { MessageType } from "src/common/ConnectionMessage";
    export class RawWebsocketMessage {
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
declare module "src/common/IWebsocketMessageFormatter" {
    import { ConnectionMessage } from "src/common/ConnectionMessage";
    import { Promise } from "src/common/Promise";
    import { RawWebsocketMessage } from "src/common/RawWebsocketMessage";
    export interface IWebsocketMessageFormatter {
        ToConnectionMessage(message: RawWebsocketMessage): Promise<ConnectionMessage>;
        FromConnectionMessage(message: ConnectionMessage): Promise<RawWebsocketMessage>;
    }
}
declare module "src/common/RiffPcmEncoder" {
    export class RiffPcmEncoder {
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
declare module "src/common/Storage" {
    import { IKeyValueStorage } from "src/common/IKeyValueStorage";
    export class Storage {
        private static sessionStorage;
        private static localStorage;
        static SetSessionStorage: (sessionStorage: IKeyValueStorage) => void;
        static SetLocalStorage: (localStorage: IKeyValueStorage) => void;
        static readonly Session: IKeyValueStorage;
        static readonly Local: IKeyValueStorage;
    }
}
declare module "src/common/Exports" {
    export * from "src/common/AudioSourceEvents";
    export * from "src/common/ConnectionEvents";
    export * from "src/common/ConnectionMessage";
    export * from "src/common/ConnectionOpenResponse";
    export * from "src/common/Error";
    export * from "src/common/Events";
    export * from "src/common/EventSource";
    export * from "src/common/Guid";
    export * from "src/common/IAudioSource";
    export * from "src/common/IConnection";
    export * from "src/common/IDetachable";
    export * from "src/common/IDictionary";
    export * from "src/common/IDisposable";
    export * from "src/common/IEventSource";
    export * from "src/common/IKeyValueStorage";
    export * from "src/common/InMemoryStorage";
    export * from "src/common/ITimer";
    export * from "src/common/IWebsocketMessageFormatter";
    export * from "src/common/List";
    export * from "src/common/PlatformEvent";
    export * from "src/common/Promise";
    export * from "src/common/Queue";
    export * from "src/common/RawWebsocketMessage";
    export * from "src/common/RiffPcmEncoder";
    export * from "src/common/Storage";
    export * from "src/common/Stream";
}
declare module "src/common.browser/ConsoleLoggingListener" {
    import { EventType, IEventListener, PlatformEvent } from "src/common/Exports";
    export class ConsoleLoggingListener implements IEventListener<PlatformEvent> {
        private logLevelFilter;
        constructor(logLevelFilter?: EventType);
        OnEvent: (event: PlatformEvent) => void;
        private ToString;
    }
}
declare module "src/common.browser/IRecorder" {
    import { Stream } from "src/common/Exports";
    export interface IRecorder {
        Record(mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void;
        ReleaseMediaResources(): void;
    }
}
declare module "src/common.browser/LocalStorage" {
    import { IKeyValueStorage } from "src/common/Exports";
    export class LocalStorage implements IKeyValueStorage {
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare module "src/common.browser/MicAudioSource" {
    import { AudioSourceEvent, EventSource, IAudioSource, IAudioStreamNode, Promise } from "src/common/Exports";
    import { IRecorder } from "src/common.browser/IRecorder";
    export class MicAudioSource implements IAudioSource {
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
declare module "src/common.browser/FileAudioSource" {
    import { AudioSourceEvent, EventSource, IAudioSource, IAudioStreamNode, Promise } from "src/common/Exports";
    export class FileAudioSource implements IAudioSource {
        private static readonly SAMPLE_RATE;
        private static readonly CHUNK_SIZE;
        private static readonly UPLOAD_INTERVAL;
        private static readonly MAX_SIZE;
        private streams;
        private id;
        private events;
        private file;
        constructor(file: File, audioSourceId?: string);
        TurnOn: () => Promise<boolean>;
        Id: () => string;
        Attach: (audioNodeId: string) => Promise<IAudioStreamNode>;
        Detach: (audioNodeId: string) => void;
        TurnOff: () => Promise<boolean>;
        readonly Events: EventSource<AudioSourceEvent>;
        private Upload;
        private OnEvent;
    }
}
declare module "src/common.browser/OpusRecorder" {
    import { Stream } from "src/common/Exports";
    import { IRecorder } from "src/common.browser/IRecorder";
    export class OpusRecorder implements IRecorder {
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
declare module "src/common.browser/PCMRecorder" {
    import { Stream } from "src/common/Exports";
    import { IRecorder } from "src/common.browser/IRecorder";
    export class PcmRecorder implements IRecorder {
        private mediaResources;
        Record: (mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>) => void;
        ReleaseMediaResources: () => void;
    }
}
declare module "src/common.browser/SessionStorage" {
    import { IKeyValueStorage } from "src/common/Exports";
    export class SessionStorage implements IKeyValueStorage {
        Get: (key: string) => string;
        GetOrAdd: (key: string, valueToAdd: string) => string;
        Set: (key: string, value: string) => void;
        Remove: (key: string) => void;
    }
}
declare module "src/common.browser/Timer" {
    import { ITimer } from "src/common/Exports";
    export class Timer implements ITimer {
        private delayInMillisec;
        private timerId;
        private successCallback;
        constructor(delayInMillisec: number, successCallback: any);
        start: (...params: any[]) => void;
        stop: () => void;
    }
}
declare module "src/common.browser/WebsocketMessageAdapter" {
    import { ConnectionEvent, ConnectionMessage, ConnectionOpenResponse, ConnectionState, EventSource, IWebsocketMessageFormatter, Promise } from "src/common/Exports";
    export class WebsocketMessageAdapter {
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
        readonly Events: EventSource<ConnectionEvent>;
        private SendRawMessage;
        private OnClose;
        private ProcessSendQueue;
        private OnEvent;
    }
}
declare module "src/common.browser/WebsocketConnection" {
    import { ConnectionEvent, ConnectionMessage, ConnectionOpenResponse, ConnectionState, EventSource, IConnection, IStringDictionary, IWebsocketMessageFormatter, Promise } from "src/common/Exports";
    export class WebsocketConnection implements IConnection {
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
        readonly Events: EventSource<ConnectionEvent>;
    }
}
declare module "src/common.browser/Exports" {
    export * from "src/common.browser/ConsoleLoggingListener";
    export * from "src/common.browser/IRecorder";
    export * from "src/common.browser/LocalStorage";
    export * from "src/common.browser/MicAudioSource";
    export * from "src/common.browser/FileAudioSource";
    export * from "src/common.browser/OpusRecorder";
    export * from "src/common.browser/PCMRecorder";
    export * from "src/common.browser/SessionStorage";
    export * from "src/common.browser/Timer";
    export * from "src/common.browser/WebsocketConnection";
    export * from "src/common.browser/WebsocketMessageAdapter";
}
declare module "src/sdk/speech/IAuthentication" {
    import { Promise } from "src/common/Exports";
    export interface IAuthentication {
        Fetch(authFetchEventId: string): Promise<AuthInfo>;
        FetchOnExpiry(authFetchEventId: string): Promise<AuthInfo>;
    }
    export class AuthInfo {
        private headerName;
        private token;
        constructor(headerName: string, token: string);
        readonly HeaderName: string;
        readonly Token: string;
    }
}
declare module "src/sdk/speech/CognitiveSubscriptionKeyAuthentication" {
    import { Promise } from "src/common/Exports";
    import { AuthInfo, IAuthentication } from "src/sdk/speech/IAuthentication";
    export class CognitiveSubscriptionKeyAuthentication implements IAuthentication {
        private authInfo;
        constructor(subscriptionKey: string);
        Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
        FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
    }
}
declare module "src/sdk/speech/CognitiveTokenAuthentication" {
    import { Promise } from "src/common/Exports";
    import { AuthInfo, IAuthentication } from "src/sdk/speech/IAuthentication";
    export class CognitiveTokenAuthentication implements IAuthentication {
        private fetchCallback;
        private fetchOnExpiryCallback;
        constructor(fetchCallback: (authFetchEventId: string) => Promise<string>, fetchOnExpiryCallback: (authFetchEventId: string) => Promise<string>);
        Fetch: (authFetchEventId: string) => Promise<AuthInfo>;
        FetchOnExpiry: (authFetchEventId: string) => Promise<AuthInfo>;
    }
}
declare module "src/sdk/speech/RecognizerConfig" {
    export enum RecognitionMode {
        Interactive = 0,
        Conversation = 1,
        Dictation = 2,
    }
    export enum SpeechResultFormat {
        Simple = 0,
        Detailed = 1,
    }
    export class RecognizerConfig {
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
    export class SpeechConfig {
        private context;
        constructor(context: Context);
        Serialize: () => string;
        readonly Context: Context;
    }
    export class Context {
        private system;
        private os;
        private device;
        constructor(os: OS, device: Device);
        readonly System: System;
        readonly OS: OS;
        readonly Device: Device;
    }
    export class System {
        private version;
        constructor();
        readonly Version: string;
    }
    export class OS {
        private platform;
        private name;
        private version;
        constructor(platform: string, name: string, version: string);
        readonly Platform: string;
        readonly Name: string;
        readonly Version: string;
    }
    export class Device {
        private manufacturer;
        private model;
        private version;
        constructor(manufacturer: string, model: string, version: string);
        readonly Manufacturer: string;
        readonly Model: string;
        readonly Version: string;
    }
}
declare module "src/sdk/speech/IConnectionFactory" {
    import { IConnection } from "src/common/Exports";
    import { AuthInfo } from "src/sdk/speech/IAuthentication";
    import { RecognizerConfig } from "src/sdk/speech/RecognizerConfig";
    export interface IConnectionFactory {
        Create(config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string): IConnection;
    }
}
declare module "src/sdk/speech/SpeechResults" {
    export enum RecognitionStatus {
        Success = 0,
        NoMatch = 1,
        InitialSilenceTimeout = 2,
        BabbleTimeout = 3,
        Error = 4,
        EndOfDictation = 5,
    }
    export interface ISpeechStartDetectedResult {
        Offset?: number;
    }
    export interface ISpeechFragment {
        Text: string;
        Offset?: number;
        Duration?: number;
    }
    export interface ISpeechEndDetectedResult {
        Offset?: number;
    }
    export interface ISimpleSpeechPhrase {
        RecognitionStatus: RecognitionStatus;
        DisplayText: string;
        Duration?: number;
        Offset?: number;
    }
    export interface IDetailedSpeechPhrase {
        RecognitionStatus: RecognitionStatus;
        NBest: IPhrase[];
        Duration?: number;
        Offset?: number;
    }
    export interface IPhrase {
        Confidence?: number;
        Lexical: string;
        ITN: string;
        MaskedITN: string;
        Display: string;
    }
}
declare module "src/sdk/speech/RecognitionEvents" {
    import { EventType, PlatformEvent } from "src/common/Exports";
    import { IDetailedSpeechPhrase, ISimpleSpeechPhrase, ISpeechEndDetectedResult, ISpeechFragment, ISpeechStartDetectedResult } from "src/sdk/speech/SpeechResults";
    export class SpeechRecognitionEvent extends PlatformEvent {
        private requestId;
        constructor(eventName: string, requestId: string, eventType?: EventType);
        readonly RequestId: string;
    }
    export class SpeechRecognitionResultEvent<TResult> extends SpeechRecognitionEvent {
        private result;
        constructor(eventName: string, requestId: string, result: TResult);
        readonly Result: TResult;
    }
    export class RecognitionTriggeredEvent extends SpeechRecognitionEvent {
        private audioSourceId;
        private audioNodeId;
        constructor(requestId: string, audioSourceId: string, audioNodeId: string);
        readonly AudioSourceId: string;
        readonly AudioNodeId: string;
    }
    export class ListeningStartedEvent extends SpeechRecognitionEvent {
        private audioSourceId;
        private audioNodeId;
        constructor(requestId: string, audioSourceId: string, audioNodeId: string);
        readonly AudioSourceId: string;
        readonly AudioNodeId: string;
    }
    export class ConnectingToServiceEvent extends SpeechRecognitionEvent {
        private authFetchEventid;
        private connectionId;
        constructor(requestId: string, authFetchEventid: string, connectionId: string);
        readonly AuthFetchEventid: string;
        readonly ConnectionId: string;
    }
    export class RecognitionStartedEvent extends SpeechRecognitionEvent {
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
    export class SpeechStartDetectedEvent extends SpeechRecognitionResultEvent<ISpeechStartDetectedResult> {
        constructor(requestId: string, result: ISpeechStartDetectedResult);
    }
    export class SpeechHypothesisEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
        constructor(requestId: string, result: ISpeechFragment);
    }
    export class SpeechFragmentEvent extends SpeechRecognitionResultEvent<ISpeechFragment> {
        constructor(requestId: string, result: ISpeechFragment);
    }
    export class SpeechEndDetectedEvent extends SpeechRecognitionResultEvent<ISpeechEndDetectedResult> {
        constructor(requestId: string, result: ISpeechEndDetectedResult);
    }
    export class SpeechSimplePhraseEvent extends SpeechRecognitionResultEvent<ISimpleSpeechPhrase> {
        constructor(requestId: string, result: ISimpleSpeechPhrase);
    }
    export class SpeechDetailedPhraseEvent extends SpeechRecognitionResultEvent<IDetailedSpeechPhrase> {
        constructor(requestId: string, result: IDetailedSpeechPhrase);
    }
    export enum RecognitionCompletionStatus {
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
    export class RecognitionEndedEvent extends SpeechRecognitionEvent {
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
declare module "src/sdk/speech/ServiceTelemetryListener.Internal" {
    import { IEventListener, PlatformEvent } from "src/common/Exports";
    export class ServiceTelemetryListener implements IEventListener<PlatformEvent> {
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
declare module "src/sdk/speech/SpeechConnectionMessage.Internal" {
    import { ConnectionMessage, IStringDictionary, MessageType } from "src/common/Exports";
    export class SpeechConnectionMessage extends ConnectionMessage {
        private path;
        private requestId;
        private contentType;
        private additionalHeaders;
        constructor(messageType: MessageType, path: string, requestId: string, contentType: string, body: any, additionalHeaders?: IStringDictionary<string>, id?: string);
        readonly Path: string;
        readonly RequestId: string;
        readonly ContentType: string;
        readonly AdditionalHeaders: IStringDictionary<string>;
        static FromConnectionMessage: (message: ConnectionMessage) => SpeechConnectionMessage;
    }
}
declare module "src/sdk/speech/Recognizer" {
    import { IAudioSource, Promise } from "src/common/Exports";
    import { IAuthentication } from "src/sdk/speech/IAuthentication";
    import { IConnectionFactory } from "src/sdk/speech/IConnectionFactory";
    import { SpeechRecognitionEvent } from "src/sdk/speech/RecognitionEvents";
    import { RecognizerConfig } from "src/sdk/speech/RecognizerConfig";
    export class Recognizer {
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
declare module "src/sdk/speech/WebsocketMessageFormatter" {
    import { ConnectionMessage, IWebsocketMessageFormatter, Promise, RawWebsocketMessage } from "src/common/Exports";
    export class WebsocketMessageFormatter implements IWebsocketMessageFormatter {
        ToConnectionMessage: (message: RawWebsocketMessage) => Promise<ConnectionMessage>;
        FromConnectionMessage: (message: ConnectionMessage) => Promise<RawWebsocketMessage>;
        private MakeHeaders;
        private ParseHeaders;
    }
}
declare module "src/sdk/speech/Exports" {
    export * from "src/sdk/speech/CognitiveSubscriptionKeyAuthentication";
    export * from "src/sdk/speech/CognitiveTokenAuthentication";
    export * from "src/sdk/speech/IAuthentication";
    export * from "src/sdk/speech/IConnectionFactory";
    export * from "src/sdk/speech/RecognitionEvents";
    export * from "src/sdk/speech/Recognizer";
    export * from "src/sdk/speech/RecognizerConfig";
    export * from "src/sdk/speech/SpeechResults";
    export * from "src/sdk/speech/WebsocketMessageFormatter";
}
declare module "src/sdk/speech.browser/SpeechConnectionFactory" {
    import { IConnection } from "src/common/Exports";
    import { AuthInfo, IConnectionFactory, RecognizerConfig } from "src/sdk/speech/Exports";
    export class SpeechConnectionFactory implements IConnectionFactory {
        Create: (config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string) => IConnection;
        private readonly Host;
        private readonly InteractiveRelativeUri;
        private readonly ConversationRelativeUri;
        private readonly DictationRelativeUri;
        private readonly IsDebugModeEnabled;
    }
}
declare module "src/sdk/speech.browser/Recognizer" {
    import { IAudioSource } from "src/common/Exports";
    import { IAuthentication, Recognizer, RecognizerConfig } from "src/sdk/speech/Exports";
    const CreateRecognizer: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Recognizer;
    const CreateRecognizerWithPcmRecorder: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Recognizer;
    const CreateRecognizerWithFileAudioSource: (recognizerConfig: RecognizerConfig, authentication: IAuthentication, file: File) => Recognizer;
    const CreateRecognizerWithCustomAudioSource: (recognizerConfig: RecognizerConfig, authentication: IAuthentication, audioSource: IAudioSource) => Recognizer;
    export { CreateRecognizer, CreateRecognizerWithCustomAudioSource, CreateRecognizerWithFileAudioSource, CreateRecognizerWithPcmRecorder };
}
declare module "src/sdk/speech.browser/Exports" {
    export * from "src/sdk/speech.browser/Recognizer";
    export * from "src/sdk/speech.browser/SpeechConnectionFactory";
}
declare module "Speech.Browser.Sdk" {
    export * from "src/common/Exports";
    export * from "src/common.browser/Exports";
    export * from "src/sdk/speech/Exports";
    export * from "src/sdk/speech.browser/Exports";
}
