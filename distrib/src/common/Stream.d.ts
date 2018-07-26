import { Promise } from "./Promise";
import { Queue } from "./Queue";
import { IStreamChunk } from "./Stream";
export interface IStreamChunk<TBuffer> {
    IsEnd: boolean;
    Buffer: TBuffer;
}
export declare class Stream<TBuffer> {
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
export declare class StreamReader<TBuffer> {
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
