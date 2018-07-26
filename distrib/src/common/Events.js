"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var EventSource_1 = require("./EventSource");
var Events = /** @class */ (function () {
    function Events() {
    }
    Object.defineProperty(Events, "Instance", {
        get: function () {
            return Events.instance;
        },
        enumerable: true,
        configurable: true
    });
    Events.instance = new EventSource_1.EventSource();
    Events.SetEventSource = function (eventSource) {
        if (!eventSource) {
            throw new Error_1.ArgumentNullError("eventSource");
        }
        Events.instance = eventSource;
    };
    return Events;
}());
exports.Events = Events;

//# sourceMappingURL=Events.js.map
