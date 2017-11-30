"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var RecognitionEvents_1 = require("./RecognitionEvents");
var ServiceTelemetryListener = (function () {
    function ServiceTelemetryListener(requestId, audioSourceId, audioNodeId) {
        var _this = this;
        this.isDisposed = false;
        this.listeningTriggerMetric = null;
        this.micMetric = null;
        this.connectionEstablishMetric = null;
        this.OnEvent = function (e) {
            if (_this.isDisposed) {
                return;
            }
            if (e instanceof RecognitionEvents_1.RecognitionTriggeredEvent && e.RequestId === _this.requestId) {
                _this.listeningTriggerMetric = {
                    End: e.EventTime,
                    Name: "ListeningTrigger",
                    Start: e.EventTime,
                };
            }
            if (e instanceof Exports_1.AudioStreamNodeAttachingEvent && e.AudioSourceId === _this.audioSourceId && e.AudioNodeId === _this.audioNodeId) {
                _this.micStartTime = e.EventTime;
            }
            if (e instanceof Exports_1.AudioStreamNodeAttachedEvent && e.AudioSourceId === _this.audioSourceId && e.AudioNodeId === _this.audioNodeId) {
                _this.micStartTime = e.EventTime;
            }
            if (e instanceof Exports_1.AudioSourceErrorEvent && e.AudioSourceId === _this.audioSourceId) {
                if (!_this.micMetric) {
                    _this.micMetric = {
                        End: e.EventTime,
                        Error: e.Error,
                        Name: "Microphone",
                        Start: _this.micStartTime,
                    };
                }
            }
            if (e instanceof Exports_1.AudioStreamNodeErrorEvent && e.AudioSourceId === _this.audioSourceId && e.AudioNodeId === _this.audioNodeId) {
                if (!_this.micMetric) {
                    _this.micMetric = {
                        End: e.EventTime,
                        Error: e.Error,
                        Name: "Microphone",
                        Start: _this.micStartTime,
                    };
                }
            }
            if (e instanceof Exports_1.AudioStreamNodeDetachedEvent && e.AudioSourceId === _this.audioSourceId && e.AudioNodeId === _this.audioNodeId) {
                if (!_this.micMetric) {
                    _this.micMetric = {
                        End: e.EventTime,
                        Name: "Microphone",
                        Start: _this.micStartTime,
                    };
                }
            }
            if (e instanceof RecognitionEvents_1.ConnectingToServiceEvent && e.RequestId === _this.requestId) {
                _this.connectionId = e.ConnectionId;
            }
            if (e instanceof Exports_1.ConnectionStartEvent && e.ConnectionId === _this.connectionId) {
                _this.connectionStartTime = e.EventTime;
            }
            if (e instanceof Exports_1.ConnectionEstablishedEvent && e.ConnectionId === _this.connectionId) {
                if (!_this.connectionEstablishMetric) {
                    _this.connectionEstablishMetric = {
                        End: e.EventTime,
                        Id: _this.connectionId,
                        Name: "Connection",
                        Start: _this.connectionStartTime,
                    };
                }
            }
            if (e instanceof Exports_1.ConnectionEstablishErrorEvent && e.ConnectionId === _this.connectionId) {
                if (!_this.connectionEstablishMetric) {
                    _this.connectionEstablishMetric = {
                        End: e.EventTime,
                        Error: _this.GetConnectionError(e.StatusCode),
                        Id: _this.connectionId,
                        Name: "Connection",
                        Start: _this.connectionStartTime,
                    };
                }
            }
            if (e instanceof Exports_1.ConnectionMessageReceivedEvent && e.ConnectionId === _this.connectionId) {
                if (e.Message && e.Message.Headers && e.Message.Headers.path) {
                    if (!_this.receivedMessages[e.Message.Headers.path]) {
                        _this.receivedMessages[e.Message.Headers.path] = new Array();
                    }
                    _this.receivedMessages[e.Message.Headers.path].push(e.NetworkReceivedTime);
                }
            }
        };
        this.GetTelemetry = function () {
            var metrics = new Array();
            if (_this.listeningTriggerMetric) {
                metrics.push(_this.listeningTriggerMetric);
            }
            if (_this.micMetric) {
                metrics.push(_this.micMetric);
            }
            if (_this.connectionEstablishMetric) {
                metrics.push(_this.connectionEstablishMetric);
            }
            var telemetry = {
                Metrics: metrics,
                ReceivedMessages: _this.receivedMessages,
            };
            var json = JSON.stringify(telemetry);
            _this.receivedMessages = {};
            _this.listeningTriggerMetric = null;
            _this.micMetric = null;
            _this.connectionEstablishMetric = null;
            return json;
        };
        this.Dispose = function () {
            _this.isDisposed = true;
        };
        this.GetConnectionError = function (statusCode) {
            switch (statusCode) {
                case 400:
                case 1002:
                case 1003:
                case 1005:
                case 1007:
                case 1008:
                case 1009: return "BadRequest";
                case 401: return "Unauthorized";
                case 403: return "Forbidden";
                case 503:
                case 1001: return "ServerUnavailable";
                case 500:
                case 1011: return "ServerError";
                case 408:
                case 504: return "Timeout";
                default: return "statuscode:" + statusCode.toString();
            }
        };
        this.requestId = requestId;
        this.audioSourceId = audioSourceId;
        this.audioNodeId = audioNodeId;
        this.receivedMessages = {};
    }
    return ServiceTelemetryListener;
}());
exports.ServiceTelemetryListener = ServiceTelemetryListener;

//# sourceMappingURL=ServiceTelemetryListener.Internal.js.map
