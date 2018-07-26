"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["None"] = 0] = "None";
    PromiseState[PromiseState["Resolved"] = 1] = "Resolved";
    PromiseState[PromiseState["Rejected"] = 2] = "Rejected";
})(PromiseState = exports.PromiseState || (exports.PromiseState = {}));
var PromiseResult = /** @class */ (function () {
    function PromiseResult(promiseResultEventSource) {
        var _this = this;
        this.ThrowIfError = function () {
            if (_this.IsError) {
                throw _this.Error;
            }
        };
        promiseResultEventSource.On(function (result) {
            if (!_this.isCompleted) {
                _this.isCompleted = true;
                _this.isError = false;
                _this.result = result;
            }
        }, function (error) {
            if (!_this.isCompleted) {
                _this.isCompleted = true;
                _this.isError = true;
                _this.error = error;
            }
        });
    }
    Object.defineProperty(PromiseResult.prototype, "IsCompleted", {
        get: function () {
            return this.isCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseResult.prototype, "IsError", {
        get: function () {
            return this.isError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseResult.prototype, "Error", {
        get: function () {
            return this.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseResult.prototype, "Result", {
        get: function () {
            return this.result;
        },
        enumerable: true,
        configurable: true
    });
    return PromiseResult;
}());
exports.PromiseResult = PromiseResult;
// tslint:disable-next-line:max-classes-per-file
var PromiseResultEventSource = /** @class */ (function () {
    function PromiseResultEventSource() {
        var _this = this;
        this.SetResult = function (result) {
            _this.onSetResult(result);
        };
        this.SetError = function (error) {
            _this.onSetError(error);
        };
        this.On = function (onSetResult, onSetError) {
            _this.onSetResult = onSetResult;
            _this.onSetError = onSetError;
        };
    }
    return PromiseResultEventSource;
}());
exports.PromiseResultEventSource = PromiseResultEventSource;
// tslint:disable-next-line:max-classes-per-file
var PromiseHelper = /** @class */ (function () {
    function PromiseHelper() {
    }
    PromiseHelper.WhenAll = function (promises) {
        if (!promises || promises.length === 0) {
            throw new Error_1.ArgumentNullError("promises");
        }
        var deferred = new Deferred();
        var errors = [];
        var completedPromises = 0;
        var checkForCompletion = function () {
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
        for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
            var promise = promises_1[_i];
            promise.On(function (r) {
                checkForCompletion();
            }, function (e) {
                errors.push(e);
                checkForCompletion();
            });
        }
        return deferred.Promise();
    };
    PromiseHelper.FromResult = function (result) {
        var deferred = new Deferred();
        deferred.Resolve(result);
        return deferred.Promise();
    };
    PromiseHelper.FromError = function (error) {
        var deferred = new Deferred();
        deferred.Reject(error);
        return deferred.Promise();
    };
    return PromiseHelper;
}());
exports.PromiseHelper = PromiseHelper;
// TODO: replace with ES6 promises
// tslint:disable-next-line:max-classes-per-file
var Promise = /** @class */ (function () {
    function Promise(sink) {
        var _this = this;
        this.Result = function () {
            return _this.sink.Result;
        };
        this.ContinueWith = function (continuationCallback) {
            if (!continuationCallback) {
                throw new Error_1.ArgumentNullError("continuationCallback");
            }
            var continuationDeferral = new Deferred();
            _this.sink.on(function (r) {
                try {
                    var continuationResult = continuationCallback(_this.sink.Result);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + "'");
                }
            }, function (error) {
                try {
                    var continuationResult = continuationCallback(_this.sink.Result);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + ". InnerError: " + error + "'");
                }
            });
            return continuationDeferral.Promise();
        };
        this.OnSuccessContinueWith = function (continuationCallback) {
            if (!continuationCallback) {
                throw new Error_1.ArgumentNullError("continuationCallback");
            }
            var continuationDeferral = new Deferred();
            _this.sink.on(function (r) {
                try {
                    var continuationResult = continuationCallback(r);
                    continuationDeferral.Resolve(continuationResult);
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + "'");
                }
            }, function (error) {
                continuationDeferral.Reject("'Unhandled callback error: " + error + "'");
            });
            return continuationDeferral.Promise();
        };
        this.ContinueWithPromise = function (continuationCallback) {
            if (!continuationCallback) {
                throw new Error_1.ArgumentNullError("continuationCallback");
            }
            var continuationDeferral = new Deferred();
            _this.sink.on(function (r) {
                try {
                    var continuationPromise = continuationCallback(_this.sink.Result);
                    if (!continuationPromise) {
                        throw new Error("'Continuation callback did not return promise'");
                    }
                    continuationPromise.On(function (continuationResult) {
                        continuationDeferral.Resolve(continuationResult);
                    }, function (e) {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + "'");
                }
            }, function (error) {
                try {
                    var continuationPromise = continuationCallback(_this.sink.Result);
                    if (!continuationPromise) {
                        throw new Error("Continuation callback did not return promise");
                    }
                    continuationPromise.On(function (continuationResult) {
                        continuationDeferral.Resolve(continuationResult);
                    }, function (e) {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + ". InnerError: " + error + "'");
                }
            });
            return continuationDeferral.Promise();
        };
        this.OnSuccessContinueWithPromise = function (continuationCallback) {
            if (!continuationCallback) {
                throw new Error_1.ArgumentNullError("continuationCallback");
            }
            var continuationDeferral = new Deferred();
            _this.sink.on(function (r) {
                try {
                    var continuationPromise = continuationCallback(r);
                    if (!continuationPromise) {
                        throw new Error("Continuation callback did not return promise");
                    }
                    continuationPromise.On(function (continuationResult) {
                        continuationDeferral.Resolve(continuationResult);
                    }, function (e) {
                        continuationDeferral.Reject(e);
                    });
                }
                catch (e) {
                    continuationDeferral.Reject("'Unhandled callback error: " + e + "'");
                }
            }, function (error) {
                continuationDeferral.Reject("'Unhandled callback error: " + error + ".'");
            });
            return continuationDeferral.Promise();
        };
        this.On = function (successCallback, errorCallback) {
            if (!successCallback) {
                throw new Error_1.ArgumentNullError("successCallback");
            }
            if (!errorCallback) {
                throw new Error_1.ArgumentNullError("errorCallback");
            }
            _this.sink.on(successCallback, errorCallback);
            return _this;
        };
        this.Finally = function (callback) {
            if (!callback) {
                throw new Error_1.ArgumentNullError("callback");
            }
            var callbackWrapper = function (_) {
                callback();
            };
            return _this.On(callbackWrapper, callbackWrapper);
        };
        this.sink = sink;
    }
    return Promise;
}());
exports.Promise = Promise;
// tslint:disable-next-line:max-classes-per-file
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.State = function () {
            return _this.sink.State;
        };
        this.Promise = function () {
            return _this.promise;
        };
        this.Resolve = function (result) {
            _this.sink.Resolve(result);
            return _this;
        };
        this.Reject = function (error) {
            _this.sink.Reject(error);
            return _this;
        };
        this.sink = new Sink();
        this.promise = new Promise(this.sink);
    }
    return Deferred;
}());
exports.Deferred = Deferred;
// tslint:disable-next-line:max-classes-per-file
var Sink = /** @class */ (function () {
    function Sink() {
        var _this = this;
        this.state = PromiseState.None;
        this.promiseResult = null;
        this.promiseResultEvents = null;
        this.successHandlers = [];
        this.errorHandlers = [];
        this.Resolve = function (result) {
            if (_this.state !== PromiseState.None) {
                throw new Error("'Cannot resolve a completed promise'");
            }
            _this.state = PromiseState.Resolved;
            _this.promiseResultEvents.SetResult(result);
            for (var i = 0; i < _this.successHandlers.length; i++) {
                _this.ExecuteSuccessCallback(result, _this.successHandlers[i], _this.errorHandlers[i]);
            }
            _this.DetachHandlers();
        };
        this.Reject = function (error) {
            if (_this.state !== PromiseState.None) {
                throw new Error("'Cannot reject a completed promise'");
            }
            _this.state = PromiseState.Rejected;
            _this.promiseResultEvents.SetError(error);
            for (var _i = 0, _a = _this.errorHandlers; _i < _a.length; _i++) {
                var errorHandler = _a[_i];
                _this.ExecuteErrorCallback(error, errorHandler);
            }
            _this.DetachHandlers();
        };
        this.on = function (successCallback, errorCallback) {
            if (successCallback == null) {
                successCallback = function (r) { return; };
            }
            if (_this.state === PromiseState.None) {
                _this.successHandlers.push(successCallback);
                _this.errorHandlers.push(errorCallback);
            }
            else {
                if (_this.state === PromiseState.Resolved) {
                    _this.ExecuteSuccessCallback(_this.promiseResult.Result, successCallback, errorCallback);
                }
                else if (_this.state === PromiseState.Rejected) {
                    _this.ExecuteErrorCallback(_this.promiseResult.Error, errorCallback);
                }
                _this.DetachHandlers();
            }
        };
        this.ExecuteSuccessCallback = function (result, successCallback, errorCallback) {
            try {
                successCallback(result);
            }
            catch (e) {
                _this.ExecuteErrorCallback("'Unhandled callback error: " + e + "'", errorCallback);
            }
        };
        this.ExecuteErrorCallback = function (error, errorCallback) {
            if (errorCallback) {
                try {
                    errorCallback(error);
                }
                catch (e) {
                    throw new Error("'Unhandled callback error: " + e + ". InnerError: " + error + "'");
                }
            }
            else {
                throw new Error("'Unhandled error: " + error + "'");
            }
        };
        this.DetachHandlers = function () {
            _this.errorHandlers = [];
            _this.successHandlers = [];
        };
        this.promiseResultEvents = new PromiseResultEventSource();
        this.promiseResult = new PromiseResult(this.promiseResultEvents);
    }
    Object.defineProperty(Sink.prototype, "State", {
        get: function () {
            return this.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sink.prototype, "Result", {
        get: function () {
            return this.promiseResult;
        },
        enumerable: true,
        configurable: true
    });
    return Sink;
}());
exports.Sink = Sink;

//# sourceMappingURL=Promise.js.map
