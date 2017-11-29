import { InvalidOperationError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
import { Queue } from "./Queue";
export class Stream {
    constructor(streamId) {
        this.readerIdCounter = 1;
        this.isEnded = false;
        this.Write = (buffer) => {
            this.ThrowIfClosed();
            this.WriteStreamChunk({
                Buffer: buffer,
                IsEnd: false,
            });
        };
        this.GetReader = () => {
            const readerId = this.readerIdCounter;
            this.readerIdCounter++;
            const readerQueue = new Queue();
            const currentLength = this.streambuffer.length;
            this.readerQueues[readerId] = readerQueue;
            for (let i = 0; i < currentLength; i++) {
                readerQueue.Enqueue(this.streambuffer[i]);
            }
            return new StreamReader(this.id, readerQueue, () => {
                delete this.readerQueues[readerId];
            });
        };
        this.Close = () => {
            if (!this.isEnded) {
                this.WriteStreamChunk({
                    Buffer: null,
                    IsEnd: true,
                });
                this.isEnded = true;
            }
        };
        this.WriteStreamChunk = (streamChunk) => {
            this.ThrowIfClosed();
            this.streambuffer.push(streamChunk);
            for (const readerId in this.readerQueues) {
                if (!this.readerQueues[readerId].IsDisposed()) {
                    try {
                        this.readerQueues[readerId].Enqueue(streamChunk);
                    }
                    catch (e) {
                    }
                }
            }
        };
        this.ThrowIfClosed = () => {
            if (this.isEnded) {
                throw new InvalidOperationError("Stream closed");
            }
        };
        this.id = streamId ? streamId : CreateNoDashGuid();
        this.streambuffer = [];
        this.readerQueues = {};
    }
    get IsClosed() {
        return this.isEnded;
    }
    get Id() {
        return this.id;
    }
}
export class StreamReader {
    constructor(streamId, readerQueue, onClose) {
        this.isClosed = false;
        this.Read = () => {
            if (this.IsClosed) {
                throw new InvalidOperationError("StreamReader closed");
            }
            return this.readerQueue
                .Dequeue()
                .OnSuccessContinueWith((streamChunk) => {
                if (streamChunk.IsEnd) {
                    this.readerQueue.Dispose("End of stream reached");
                }
                return streamChunk;
            });
        };
        this.Close = () => {
            if (!this.isClosed) {
                this.isClosed = true;
                this.readerQueue.Dispose("StreamReader closed");
                this.onClose();
            }
        };
        this.readerQueue = readerQueue;
        this.onClose = onClose;
        this.streamId = streamId;
    }
    get IsClosed() {
        return this.isClosed;
    }
    get StreamId() {
        return this.streamId;
    }
}

//# sourceMappingURL=Stream.js.map
