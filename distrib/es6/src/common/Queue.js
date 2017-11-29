import { InvalidOperationError, ObjectDisposedError } from "./Error";
import { List } from "./List";
import { Deferred, PromiseHelper } from "./Promise";
var SubscriberType;
(function (SubscriberType) {
    SubscriberType[SubscriberType["Dequeue"] = 0] = "Dequeue";
    SubscriberType[SubscriberType["Peek"] = 1] = "Peek";
})(SubscriberType || (SubscriberType = {}));
export class Queue {
    constructor(list) {
        this.promiseStore = new List();
        this.isDrainInProgress = false;
        this.isDisposing = false;
        this.disposeReason = null;
        this.Enqueue = (item) => {
            this.ThrowIfDispose();
            this.EnqueueFromPromise(PromiseHelper.FromResult(item));
        };
        this.EnqueueFromPromise = (promise) => {
            this.ThrowIfDispose();
            this.promiseStore.Add(promise);
            promise.Finally(() => {
                while (this.promiseStore.Length() > 0) {
                    if (!this.promiseStore.First().Result().IsCompleted) {
                        break;
                    }
                    else {
                        const p = this.promiseStore.RemoveFirst();
                        if (!p.Result().IsError) {
                            this.list.Add(p.Result().Result);
                        }
                        else {
                        }
                    }
                }
            });
        };
        this.Dequeue = () => {
            this.ThrowIfDispose();
            const deferredSubscriber = new Deferred();
            this.subscribers.Add({ deferral: deferredSubscriber, type: SubscriberType.Dequeue });
            this.Drain();
            return deferredSubscriber.Promise();
        };
        this.Peek = () => {
            this.ThrowIfDispose();
            const deferredSubscriber = new Deferred();
            this.subscribers.Add({ deferral: deferredSubscriber, type: SubscriberType.Peek });
            this.Drain();
            return deferredSubscriber.Promise();
        };
        this.Length = () => {
            this.ThrowIfDispose();
            return this.list.Length();
        };
        this.IsDisposed = () => {
            return this.subscribers == null;
        };
        this.DrainAndDispose = (pendingItemProcessor, reason) => {
            if (!this.IsDisposed() && !this.isDisposing) {
                this.disposeReason = reason;
                this.isDisposing = true;
                while (this.subscribers.Length() > 0) {
                    const subscriber = this.subscribers.RemoveFirst();
                    subscriber.deferral.Reject("Disposed");
                }
                for (const detachable of this.detachables) {
                    detachable.Detach();
                }
                if (this.promiseStore.Length() > 0 && pendingItemProcessor) {
                    return PromiseHelper
                        .WhenAll(this.promiseStore.ToArray())
                        .ContinueWith(() => {
                        this.subscribers = null;
                        this.list.ForEach((item, index) => {
                            pendingItemProcessor(item);
                        });
                        this.list = null;
                        return true;
                    });
                }
                else {
                    this.subscribers = null;
                    this.list = null;
                }
            }
            return PromiseHelper.FromResult(true);
        };
        this.Dispose = (reason) => {
            this.DrainAndDispose(null, reason);
        };
        this.Drain = () => {
            if (!this.isDrainInProgress && !this.isDisposing) {
                this.isDrainInProgress = true;
                while (this.list.Length() > 0 && this.subscribers.Length() > 0 && !this.isDisposing) {
                    const subscriber = this.subscribers.RemoveFirst();
                    if (subscriber.type === SubscriberType.Peek) {
                        subscriber.deferral.Resolve(this.list.First());
                    }
                    else {
                        const dequeuedItem = this.list.RemoveFirst();
                        subscriber.deferral.Resolve(dequeuedItem);
                    }
                }
                this.isDrainInProgress = false;
            }
        };
        this.ThrowIfDispose = () => {
            if (this.IsDisposed()) {
                if (this.disposeReason) {
                    throw new InvalidOperationError(this.disposeReason);
                }
                throw new ObjectDisposedError("Queue");
            }
            else if (this.isDisposing) {
                throw new InvalidOperationError("Queue disposing");
            }
        };
        this.list = list ? list : new List();
        this.detachables = [];
        this.subscribers = new List();
        this.detachables.push(this.list.OnAdded(this.Drain));
    }
}

//# sourceMappingURL=Queue.js.map
