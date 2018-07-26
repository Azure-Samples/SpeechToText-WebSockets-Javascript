"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var List_1 = require("./List");
var Promise_1 = require("./Promise");
var SubscriberType;
(function (SubscriberType) {
    SubscriberType[SubscriberType["Dequeue"] = 0] = "Dequeue";
    SubscriberType[SubscriberType["Peek"] = 1] = "Peek";
})(SubscriberType || (SubscriberType = {}));
var Queue = /** @class */ (function () {
    function Queue(list) {
        var _this = this;
        this.promiseStore = new List_1.List();
        this.isDrainInProgress = false;
        this.isDisposing = false;
        this.disposeReason = null;
        this.Enqueue = function (item) {
            _this.ThrowIfDispose();
            _this.EnqueueFromPromise(Promise_1.PromiseHelper.FromResult(item));
        };
        this.EnqueueFromPromise = function (promise) {
            _this.ThrowIfDispose();
            _this.promiseStore.Add(promise);
            promise.Finally(function () {
                while (_this.promiseStore.Length() > 0) {
                    if (!_this.promiseStore.First().Result().IsCompleted) {
                        break;
                    }
                    else {
                        var p = _this.promiseStore.RemoveFirst();
                        if (!p.Result().IsError) {
                            _this.list.Add(p.Result().Result);
                        }
                        else {
                            // TODO: Log as warning.
                        }
                    }
                }
            });
        };
        this.Dequeue = function () {
            _this.ThrowIfDispose();
            var deferredSubscriber = new Promise_1.Deferred();
            _this.subscribers.Add({ deferral: deferredSubscriber, type: SubscriberType.Dequeue });
            _this.Drain();
            return deferredSubscriber.Promise();
        };
        this.Peek = function () {
            _this.ThrowIfDispose();
            var deferredSubscriber = new Promise_1.Deferred();
            _this.subscribers.Add({ deferral: deferredSubscriber, type: SubscriberType.Peek });
            _this.Drain();
            return deferredSubscriber.Promise();
        };
        this.Length = function () {
            _this.ThrowIfDispose();
            return _this.list.Length();
        };
        this.IsDisposed = function () {
            return _this.subscribers == null;
        };
        this.DrainAndDispose = function (pendingItemProcessor, reason) {
            if (!_this.IsDisposed() && !_this.isDisposing) {
                _this.disposeReason = reason;
                _this.isDisposing = true;
                while (_this.subscribers.Length() > 0) {
                    var subscriber = _this.subscribers.RemoveFirst();
                    // TODO: this needs work (Resolve(null) instead?).
                    subscriber.deferral.Reject("Disposed");
                }
                for (var _i = 0, _a = _this.detachables; _i < _a.length; _i++) {
                    var detachable = _a[_i];
                    detachable.Detach();
                }
                if (_this.promiseStore.Length() > 0 && pendingItemProcessor) {
                    return Promise_1.PromiseHelper
                        .WhenAll(_this.promiseStore.ToArray())
                        .ContinueWith(function () {
                        _this.subscribers = null;
                        _this.list.ForEach(function (item, index) {
                            pendingItemProcessor(item);
                        });
                        _this.list = null;
                        return true;
                    });
                }
                else {
                    _this.subscribers = null;
                    _this.list = null;
                }
            }
            return Promise_1.PromiseHelper.FromResult(true);
        };
        this.Dispose = function (reason) {
            _this.DrainAndDispose(null, reason);
        };
        this.Drain = function () {
            if (!_this.isDrainInProgress && !_this.isDisposing) {
                _this.isDrainInProgress = true;
                while (_this.list.Length() > 0 && _this.subscribers.Length() > 0 && !_this.isDisposing) {
                    var subscriber = _this.subscribers.RemoveFirst();
                    if (subscriber.type === SubscriberType.Peek) {
                        subscriber.deferral.Resolve(_this.list.First());
                    }
                    else {
                        var dequeuedItem = _this.list.RemoveFirst();
                        subscriber.deferral.Resolve(dequeuedItem);
                    }
                }
                _this.isDrainInProgress = false;
            }
        };
        this.ThrowIfDispose = function () {
            if (_this.IsDisposed()) {
                if (_this.disposeReason) {
                    throw new Error_1.InvalidOperationError(_this.disposeReason);
                }
                throw new Error_1.ObjectDisposedError("Queue");
            }
            else if (_this.isDisposing) {
                throw new Error_1.InvalidOperationError("Queue disposing");
            }
        };
        this.list = list ? list : new List_1.List();
        this.detachables = [];
        this.subscribers = new List_1.List();
        this.detachables.push(this.list.OnAdded(this.Drain));
    }
    return Queue;
}());
exports.Queue = Queue;

//# sourceMappingURL=Queue.js.map
