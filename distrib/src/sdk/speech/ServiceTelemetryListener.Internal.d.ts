import { IEventListener, PlatformEvent } from "../../common/Exports";
export declare class ServiceTelemetryListener implements IEventListener<PlatformEvent> {
    private isDisposed;
    private requestId;
    private audioSourceId;
    private audioNodeId;
    private listeningTriggerMetric;
    private micMetric;
    private connectionEstablishMetric;
    private micStartTime;
    private connectionId;
    private connectionStartTime;
    private receivedMessages;
    constructor(requestId: string, audioSourceId: string, audioNodeId: string);
    OnEvent: (e: PlatformEvent) => void;
    GetTelemetry: () => string;
    Dispose: () => void;
    private GetConnectionError;
}
