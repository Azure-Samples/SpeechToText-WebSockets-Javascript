"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var List = /** @class */ (function () {
    function List(list) {
        var _this = this;
        this.subscriptionIdCounter = 0;
        this.addSubscriptions = {};
        this.removeSubscriptions = {};
        this.disposedSubscriptions = {};
        this.disposeReason = null;
        this.Get = function (itemIndex) {
            _this.ThrowIfDisposed();
            return _this.list[itemIndex];
        };
        this.First = function () {
            return _this.Get(0);
        };
        this.Last = function () {
            return _this.Get(_this.Length() - 1);
        };
        this.Add = function (item) {
            _this.ThrowIfDisposed();
            _this.InsertAt(_this.list.length, item);
        };
        this.InsertAt = function (index, item) {
            _this.ThrowIfDisposed();
            if (index === 0) {
                _this.list.unshift(item);
            }
            else if (index === _this.list.length) {
                _this.list.push(item);
            }
            else {
                _this.list.splice(index, 0, item);
            }
            _this.TriggerSubscriptions(_this.addSubscriptions);
        };
        this.RemoveFirst = function () {
            _this.ThrowIfDisposed();
            return _this.RemoveAt(0);
        };
        this.RemoveLast = function () {
            _this.ThrowIfDisposed();
            return _this.RemoveAt(_this.Length() - 1);
        };
        this.RemoveAt = function (index) {
            _this.ThrowIfDisposed();
            return _this.Remove(index, 1)[0];
        };
        this.Remove = function (index, count) {
            _this.ThrowIfDisposed();
            var removedElements = _this.list.splice(index, count);
            _this.TriggerSubscriptions(_this.removeSubscriptions);
            return removedElements;
        };
        this.Clear = function () {
            _this.ThrowIfDisposed();
            _this.Remove(0, _this.Length());
        };
        this.Length = function () {
            _this.ThrowIfDisposed();
            return _this.list.length;
        };
        this.OnAdded = function (addedCallback) {
            _this.ThrowIfDisposed();
            var subscriptionId = _this.subscriptionIdCounter++;
            _this.addSubscriptions[subscriptionId] = addedCallback;
            return {
                Detach: function () {
                    delete _this.addSubscriptions[subscriptionId];
                },
            };
        };
        this.OnRemoved = function (removedCallback) {
            _this.ThrowIfDisposed();
            var subscriptionId = _this.subscriptionIdCounter++;
            _this.removeSubscriptions[subscriptionId] = removedCallback;
            return {
                Detach: function () {
                    delete _this.removeSubscriptions[subscriptionId];
                },
            };
        };
        this.OnDisposed = function (disposedCallback) {
            _this.ThrowIfDisposed();
            var subscriptionId = _this.subscriptionIdCounter++;
            _this.disposedSubscriptions[subscriptionId] = disposedCallback;
            return {
                Detach: function () {
                    delete _this.disposedSubscriptions[subscriptionId];
                },
            };
        };
        this.Join = function (seperator) {
            _this.ThrowIfDisposed();
            return _this.list.join(seperator);
        };
        this.ToArray = function () {
            var cloneCopy = Array();
            _this.list.forEach(function (val) {
                cloneCopy.push(val);
            });
            return cloneCopy;
        };
        this.Any = function (callback) {
            _this.ThrowIfDisposed();
            if (callback) {
                return _this.Where(callback).Length() > 0;
            }
            else {
                return _this.Length() > 0;
            }
        };
        this.All = function (callback) {
            _this.ThrowIfDisposed();
            return _this.Where(callback).Length() === _this.Length();
        };
        this.ForEach = function (callback) {
            _this.ThrowIfDisposed();
            for (var i = 0; i < _this.Length(); i++) {
                callback(_this.list[i], i);
            }
        };
        this.Select = function (callback) {
            _this.ThrowIfDisposed();
            var selectList = [];
            for (var i = 0; i < _this.list.length; i++) {
                selectList.push(callback(_this.list[i], i));
            }
            return new List(selectList);
        };
        this.Where = function (callback) {
            _this.ThrowIfDisposed();
            var filteredList = new List();
            for (var i = 0; i < _this.list.length; i++) {
                if (callback(_this.list[i], i)) {
                    filteredList.Add(_this.list[i]);
                }
            }
            return filteredList;
        };
        this.OrderBy = function (compareFn) {
            _this.ThrowIfDisposed();
            var clonedArray = _this.ToArray();
            var orderedArray = clonedArray.sort(compareFn);
            return new List(orderedArray);
        };
        this.OrderByDesc = function (compareFn) {
            _this.ThrowIfDisposed();
            return _this.OrderBy(function (a, b) { return compareFn(b, a); });
        };
        this.Clone = function () {
            _this.ThrowIfDisposed();
            return new List(_this.ToArray());
        };
        this.Concat = function (list) {
            _this.ThrowIfDisposed();
            return new List(_this.list.concat(list.ToArray()));
        };
        this.ConcatArray = function (array) {
            _this.ThrowIfDisposed();
            return new List(_this.list.concat(array));
        };
        this.IsDisposed = function () {
            return _this.list == null;
        };
        this.Dispose = function (reason) {
            if (!_this.IsDisposed()) {
                _this.disposeReason = reason;
                _this.list = null;
                _this.addSubscriptions = null;
                _this.removeSubscriptions = null;
                _this.TriggerSubscriptions(_this.disposedSubscriptions);
            }
        };
        this.ThrowIfDisposed = function () {
            if (_this.IsDisposed()) {
                throw new Error_1.ObjectDisposedError("List", _this.disposeReason);
            }
        };
        this.TriggerSubscriptions = function (subscriptions) {
            if (subscriptions) {
                for (var subscriptionId in subscriptions) {
                    if (subscriptionId) {
                        subscriptions[subscriptionId]();
                    }
                }
            }
        };
        this.list = [];
        // copy the list rather than taking as is.
        if (list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                this.list.push(item);
            }
        }
    }
    return List;
}());
exports.List = List;

//# sourceMappingURL=List.js.map
