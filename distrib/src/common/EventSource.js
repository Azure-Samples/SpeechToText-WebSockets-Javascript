"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var Guid_1 = require("./Guid");
var EventSource = /** @class */ (function () {
    function EventSource(metadata) {
        var _this = this;
        this.eventListeners = {};
        this.isDisposed = false;
        this.OnEvent = function (event) {
            if (_this.IsDisposed()) {
                throw (new Error_1.ObjectDisposedError("EventSource"));
            }
            if (_this.Metadata) {
                for (var paramName in _this.Metadata) {
                    if (paramName) {
                        if (event.Metadata) {
                            if (!event.Metadata[paramName]) {
                                event.Metadata[paramName] = _this.Metadata[paramName];
                            }
                        }
                    }
                }
            }
            for (var eventId in _this.eventListeners) {
                if (eventId && _this.eventListeners[eventId]) {
                    _this.eventListeners[eventId](event);
                }
            }
        };
        this.Attach = function (onEventCallback) {
            var id = Guid_1.CreateNoDashGuid();
            _this.eventListeners[id] = onEventCallback;
            return {
                Detach: function () {
                    delete _this.eventListeners[id];
                },
            };
        };
        this.AttachListener = function (listener) {
            return _this.Attach(listener.OnEvent);
        };
        this.IsDisposed = function () {
            return _this.isDisposed;
        };
        this.Dispose = function () {
            _this.eventListeners = null;
            _this.isDisposed = true;
        };
        this.metadata = metadata;
    }
    Object.defineProperty(EventSource.prototype, "Metadata", {
        get: function () {
            return this.metadata;
        },
        enumerable: true,
        configurable: true
    });
    return EventSource;
}());
exports.EventSource = EventSource;

//# sourceMappingURL=EventSource.js.map
