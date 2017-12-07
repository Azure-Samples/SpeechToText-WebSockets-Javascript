import { IDisposable } from "./IDisposable";
import { List } from "./List";
import { Promise } from "./Promise";
export interface IQueue<TItem> extends IDisposable {
    Enqueue(item: TItem): void;
    EnqueueFromPromise(promise: Promise<TItem>): void;
    Dequeue(): Promise<TItem>;
    Peek(): Promise<TItem>;
    Length(): number;
}
export declare class Queue<TItem> implements IQueue<TItem> {
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
