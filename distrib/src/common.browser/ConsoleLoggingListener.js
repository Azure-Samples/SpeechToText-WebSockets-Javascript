"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var ConsoleLoggingListener = /** @class */ (function () {
    function ConsoleLoggingListener(logLevelFilter) {
        if (logLevelFilter === void 0) { logLevelFilter = Exports_1.EventType.Warning; }
        var _this = this;
        this.OnEvent = function (event) {
            if (event.EventType >= _this.logLevelFilter) {
                var log = _this.ToString(event);
                switch (event.EventType) {
                    case Exports_1.EventType.Debug:
                        // tslint:disable-next-line:no-console
                        console.debug(log);
                        break;
                    case Exports_1.EventType.Info:
                        // tslint:disable-next-line:no-console
                        console.info(log);
                        break;
                    case Exports_1.EventType.Warning:
                        // tslint:disable-next-line:no-console
                        console.warn(log);
                        break;
                    case Exports_1.EventType.Error:
                        // tslint:disable-next-line:no-console
                        console.error(log);
                        break;
                    default:
                        // tslint:disable-next-line:no-console
                        console.log(log);
                        break;
                }
            }
        };
        this.ToString = function (event) {
            var logFragments = [
                "" + event.EventTime,
                "" + event.Name,
            ];
            for (var prop in event) {
                if (prop && event.hasOwnProperty(prop) && prop !== "eventTime" && prop !== "eventType" && prop !== "eventId" && prop !== "name" && prop !== "constructor") {
                    var value = event[prop];
                    var valueToLog = "<NULL>";
                    if (value !== undefined && value !== null) {
                        if (typeof (value) === "number" || typeof (value) === "string") {
                            valueToLog = value.toString();
                        }
                        else {
                            valueToLog = JSON.stringify(value);
                        }
                    }
                    logFragments.push(prop + ": " + valueToLog);
                }
            }
            return logFragments.join(" | ");
        };
        this.logLevelFilter = logLevelFilter;
    }
    return ConsoleLoggingListener;
}());
exports.ConsoleLoggingListener = ConsoleLoggingListener;

//# sourceMappingURL=ConsoleLoggingListener.js.map
