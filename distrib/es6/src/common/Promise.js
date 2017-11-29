import { ArgumentNullError } from "./Error";
export var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["None"] = 0] = "None";
    PromiseState[PromiseState["Resolved"] = 1] = "Resolved";
    PromiseState[PromiseState["Rejected"] = 2] = "Rejected";
})(PromiseState || (PromiseState = {}));
export class PromiseResult {
    constructor(promiseResultEventSource) {
        this.ThrowIfError = () => {
            if (this.IsError) {
                throw this.Error;
            }
        };
        promiseResultEventSource.On((result) => {
            if (!this.isCompleted) {
                this.isCompleted = true;
                this.isError = false;
                this.result = result;
            }
        }, (error) => {
            if (!this.isCompleted) {
                this.isCompleted = true;
                this.isError = true;
                this.error = error;
            }
        });
    }
    get IsCompleted() {
        return this.isCompleted;
    }
    get IsError() {
        return this.isError;
    }
    get Error() {
        return this.error;
    }
    get Result() {
        return this.result;
    }
}
export class PromiseResultEventSource {
    constructor() {
        this.SetResult = (result) => {
            this.onSetResult(result);
        };
        this.SetError = (error) => {
            this.onSetError(error);
        };
        this.On = (onSetResult, onSetError) => {
            this.onSetResult = onSetResult;
            this.onSetError = onSetError;
        };
    }
}
export class PromiseHelper {
}
PromiseHelper.WhenAll = (promises) => {
    if (!promises || promises.length === 0) {
        throw new ArgumentNullError("promises");
    }
    const deferred = new Deferred();
    const errors = [];
    let completedPromises = 0;
    const checkForCompletion = () => {
        completedPromises++;
        if (completedPromises === promises.length) {
            if (errors.length === 0) {
                deferred.Resolve(true);
            }
            else {
                deferred.Reject(errors.join(", "));
            }
        }
    };
    for (const promise of promises) {
        promise.On((r) => {
            checkForCompletion();
        }, (e) => {
            errors.push(e);
            checkForCompletion();
        });
    }
    return deferred.Promise();
};
PromiseHelper.FromResult = (result) => {
    const deferred = new Deferred();
    deferred.Resolve(result);
    return deferred.Promise();
};
PromiseHelper.FromError = (error) => {
    const deferred = new Deferred();
    deferred.Reject(error);
    return deferred.Promise();
};
export class Promise {
    constructor(sink) {
        this.Result = () => {
            return this.sink.Result;
        };
        this.ContinueWith = (continuationCallback) => {
            if (!continuationCallback) {
                throw new ArgumentNullError("continuationCallback");
            }
            const continuationDeferral = new Deferred();
            this.sink.on((r) => {
                try {
                    const continuationResult = continuationCallback(this.sink.Result);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}'`);
                }
            }, (error) => {
                try {
                    const continuationResult = continuationCallback(this.sink.Result);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}. InnerError: ${error}'`);
                }
            });
            return continuationDeferral.Promise();
        };
        this.OnSuccessContinueWith = (continuationCallback) => {
            if (!continuationCallback) {
                throw new ArgumentNullError("continuationCallback");
            }
            const continuationDeferral = new Deferred();
            this.sink.on((r) => {
                try {
                    const continuationResult = continuationCallback(r);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}'`);
                }
            }, (error) => {
                continuationDeferral.Reject(`'Unhandled callback error: ${error}'`);
            });
            return continuationDeferral.Promise();
        };
        this.ContinueWithPromise = (continuationCallback) => {
            if (!continuationCallback) {
                throw new ArgumentNullError("continuationCallback");
            }
            const continuationDeferral = new Deferred();
            this.sink.on((r) => {
                try {
                    const continuationPromise = continuationCallback(this.sink.Result);
                    if (!continuationPromise) {
                        throw new Error("'Continuation callback did not return promise'");
                    }
                    continuationPromise.On((continuationResult) => {
                        continuationDeferral.Resolve(continuationResult);
                    }, (e) => {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}'`);
                }
            }, (error) => {
                try {
                    const continuationPromise = continuationCallback(this.sink.Result);
                    if (!continuationPromise) {
                        throw new Error("Continuation callback did not return promise");
                    }
                    continuationPromise.On((continuationResult) => {
                        continuationDeferral.Resolve(continuationResult);
                    }, (e) => {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}. InnerError: ${error}'`);
                }
            });
            return continuationDeferral.Promise();
        };
        this.OnSuccessContinueWithPromise = (continuationCallback) => {
            if (!continuationCallback) {
                throw new ArgumentNullError("continuationCallback");
            }
            const continuationDeferral = new Deferred();
            this.sink.on((r) => {
                try {
                    const continuationPromise = continuationCallback(r);
                    if (!continuationPromise) {
                        throw new Error("Continuation callback did not return promise");
                    }
                    continuationPromise.On((continuationResult) => {
                        continuationDeferral.Resolve(continuationResult);
                    }, (e) => {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject(`'Unhandled callback error: ${e}'`);
                }
            }, (error) => {
                continuationDeferral.Reject(`'Unhandled callback error: ${error}.'`);
            });
            return continuationDeferral.Promise();
        };
        this.On = (successCallback, errorCallback) => {
            if (!successCallback) {
                throw new ArgumentNullError("successCallback");
            }
            if (!errorCallback) {
                throw new ArgumentNullError("errorCallback");
            }
            this.sink.on(successCallback, errorCallback);
            return this;
        };
        this.Finally = (callback) => {
            if (!callback) {
                throw new ArgumentNullError("callback");
            }
            const callbackWrapper = (_) => {
                callback();
            };
            return this.On(callbackWrapper, callbackWrapper);
        };
        this.sink = sink;
    }
}
export class Deferred {
    constructor() {
        this.State = () => {
            return this.sink.State;
        };
        this.Promise = () => {
            return this.promise;
        };
        this.Resolve = (result) => {
            this.sink.Resolve(result);
            return this;
        };
        this.Reject = (error) => {
            this.sink.Reject(error);
            return this;
        };
        this.sink = new Sink();
        this.promise = new Promise(this.sink);
    }
}
export class Sink {
    constructor() {
        this.state = PromiseState.None;
        this.promiseResult = null;
        this.promiseResultEvents = null;
        this.successHandlers = [];
        this.errorHandlers = [];
        this.Resolve = (result) => {
            if (this.state !== PromiseState.None) {
                throw new Error("'Cannot resolve a completed promise'");
            }
            this.state = PromiseState.Resolved;
            this.promiseResultEvents.SetResult(result);
            for (let i = 0; i < this.successHandlers.length; i++) {
                this.ExecuteSuccessCallback(result, this.successHandlers[i], this.errorHandlers[i]);
            }
            this.DetachHandlers();
        };
        this.Reject = (error) => {
            if (this.state !== PromiseState.None) {
                throw new Error("'Cannot reject a completed promise'");
            }
            this.state = PromiseState.Rejected;
            this.promiseResultEvents.SetError(error);
            for (const errorHandler of this.errorHandlers) {
                this.ExecuteErrorCallback(error, errorHandler);
            }
            this.DetachHandlers();
        };
        this.on = (successCallback, errorCallback) => {
            if (successCallback == null) {
                successCallback = (r) => { return; };
            }
            if (this.state === PromiseState.None) {
                this.successHandlers.push(successCallback);
                this.errorHandlers.push(errorCallback);
            }
            else {
                if (this.state === PromiseState.Resolved) {
                    this.ExecuteSuccessCallback(this.promiseResult.Result, successCallback, errorCallback);
                }
                else if (this.state === PromiseState.Rejected) {
                    this.ExecuteErrorCallback(this.promiseResult.Error, errorCallback);
                }
                this.DetachHandlers();
            }
        };
        this.ExecuteSuccessCallback = (result, successCallback, errorCallback) => {
            try {
                successCallback(result);
            }
            catch (e) {
                this.ExecuteErrorCallback(`'Unhandled callback error: ${e}'`, errorCallback);
            }
        };
        this.ExecuteErrorCallback = (error, errorCallback) => {
            if (errorCallback) {
                try {
                    errorCallback(error);
                }
                catch (e) {
                    throw new Error(`'Unhandled callback error: ${e}. InnerError: ${error}'`);
                }
            }
            else {
                throw new Error(`'Unhandled error: ${error}'`);
            }
        };
        this.DetachHandlers = () => {
            this.errorHandlers = [];
            this.successHandlers = [];
        };
        this.promiseResultEvents = new PromiseResultEventSource();
        this.promiseResult = new PromiseResult(this.promiseResultEvents);
    }
    get State() {
        return this.state;
    }
    get Result() {
        return this.promiseResult;
    }
}

//# sourceMappingURL=Promise.js.map
