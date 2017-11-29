import { AudioSourceErrorEvent, AudioStreamNodeAttachedEvent, AudioStreamNodeAttachingEvent, AudioStreamNodeDetachedEvent, AudioStreamNodeErrorEvent, ConnectionEstablishedEvent, ConnectionEstablishErrorEvent, ConnectionMessageReceivedEvent, ConnectionStartEvent, } from "../../common/Exports";
import { ConnectingToServiceEvent, RecognitionTriggeredEvent, } from "./RecognitionEvents";
export class ServiceTelemetryListener {
    constructor(requestId, audioSourceId, audioNodeId) {
        this.isDisposed = false;
        this.listeningTriggerMetric = null;
        this.micMetric = null;
        this.connectionEstablishMetric = null;
        this.OnEvent = (e) => {
            if (this.isDisposed) {
                return;
            }
            if (e instanceof RecognitionTriggeredEvent && e.RequestId === this.requestId) {
                this.listeningTriggerMetric = {
                    End: e.EventTime,
                    Name: "ListeningTrigger",
                    Start: e.EventTime,
                };
            }
            if (e instanceof AudioStreamNodeAttachingEvent && e.AudioSourceId === this.audioSourceId && e.AudioNodeId === this.audioNodeId) {
                this.micStartTime = e.EventTime;
            }
            if (e instanceof AudioStreamNodeAttachedEvent && e.AudioSourceId === this.audioSourceId && e.AudioNodeId === this.audioNodeId) {
                this.micStartTime = e.EventTime;
            }
            if (e instanceof AudioSourceErrorEvent && e.AudioSourceId === this.audioSourceId) {
                if (!this.micMetric) {
                    this.micMetric = {
                        End: e.EventTime,
                        Error: e.Error,
                        Name: "Microphone",
                        Start: this.micStartTime,
                    };
                }
            }
            if (e instanceof AudioStreamNodeErrorEvent && e.AudioSourceId === this.audioSourceId && e.AudioNodeId === this.audioNodeId) {
                if (!this.micMetric) {
                    this.micMetric = {
                        End: e.EventTime,
                        Error: e.Error,
                        Name: "Microphone",
                        Start: this.micStartTime,
                    };
                }
            }
            if (e instanceof AudioStreamNodeDetachedEvent && e.AudioSourceId === this.audioSourceId && e.AudioNodeId === this.audioNodeId) {
                if (!this.micMetric) {
                    this.micMetric = {
                        End: e.EventTime,
                        Name: "Microphone",
                        Start: this.micStartTime,
                    };
                }
            }
            if (e instanceof ConnectingToServiceEvent && e.RequestId === this.requestId) {
                this.connectionId = e.ConnectionId;
            }
            if (e instanceof ConnectionStartEvent && e.ConnectionId === this.connectionId) {
                this.connectionStartTime = e.EventTime;
            }
            if (e instanceof ConnectionEstablishedEvent && e.ConnectionId === this.connectionId) {
                if (!this.connectionEstablishMetric) {
                    this.connectionEstablishMetric = {
                        End: e.EventTime,
                        Id: this.connectionId,
                        Name: "Connection",
                        Start: this.connectionStartTime,
                    };
                }
            }
            if (e instanceof ConnectionEstablishErrorEvent && e.ConnectionId === this.connectionId) {
                if (!this.connectionEstablishMetric) {
                    this.connectionEstablishMetric = {
                        End: e.EventTime,
                        Error: this.GetConnectionError(e.StatusCode),
                        Id: this.connectionId,
                        Name: "Connection",
                        Start: this.connectionStartTime,
                    };
                }
            }
            if (e instanceof ConnectionMessageReceivedEvent && e.ConnectionId === this.connectionId) {
                if (e.Message && e.Message.Headers && e.Message.Headers.path) {
                    if (!this.receivedMessages[e.Message.Headers.path]) {
                        this.receivedMessages[e.Message.Headers.path] = new Array();
                    }
                    this.receivedMessages[e.Message.Headers.path].push(e.NetworkReceivedTime);
                }
            }
        };
        this.GetTelemetry = () => {
            const metrics = new Array();
            if (this.listeningTriggerMetric) {
                metrics.push(this.listeningTriggerMetric);
            }
            if (this.micMetric) {
                metrics.push(this.micMetric);
            }
            if (this.connectionEstablishMetric) {
                metrics.push(this.connectionEstablishMetric);
            }
            const telemetry = {
                Metrics: metrics,
                ReceivedMessages: this.receivedMessages,
            };
            const json = JSON.stringify(telemetry);
            this.receivedMessages = {};
            this.listeningTriggerMetric = null;
            this.micMetric = null;
            this.connectionEstablishMetric = null;
            return json;
        };
        this.Dispose = () => {
            this.isDisposed = true;
        };
        this.GetConnectionError = (statusCode) => {
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
}

//# sourceMappingURL=ServiceTelemetryListener.Internal.js.map
