import { EventType, IEventListener, PlatformEvent } from "../common/Exports";
export declare class ConsoleLoggingListener implements IEventListener<PlatformEvent> {
    private logLevelFilter;
    constructor(logLevelFilter?: EventType);
    OnEvent: (event: PlatformEvent) => void;
    private ToString;
}
