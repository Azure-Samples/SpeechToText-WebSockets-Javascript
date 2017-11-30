export declare enum PromiseState {
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
export declare class PromiseResult<T> {
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
export declare class PromiseResultEventSource<T> {
    private onSetResult;
    private onSetError;
    SetResult: (result: T) => void;
    SetError: (error: string) => void;
    On: (onSetResult: (result: T) => void, onSetError: (error: string) => void) => void;
}
export declare class PromiseHelper {
    static WhenAll: (promises: Promise<any>[]) => Promise<boolean>;
    static FromResult: <TResult>(result: TResult) => Promise<TResult>;
    static FromError: <TResult>(error: string) => Promise<TResult>;
}
export declare class Promise<T> implements IPromise<T> {
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
export declare class Deferred<T> implements IDeferred<T> {
    private promise;
    private sink;
    constructor();
    State: () => PromiseState;
    Promise: () => Promise<T>;
    Resolve: (result: T) => Deferred<T>;
    Reject: (error: string) => Deferred<T>;
}
export declare class Sink<T> {
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
