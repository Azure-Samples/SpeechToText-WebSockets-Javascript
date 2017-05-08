import { CreateNoDashGuid } from "./Guid";
import { IStringDictionary } from "./IDictionary";

export enum EventType {
    Debug,
    Info,
    Warning,
    Error,
}

export class PlatformEvent {
    private eventId: string;
    private eventTime: string;
    private eventType: EventType;

    constructor(eventType: EventType) {
        this.eventId = CreateNoDashGuid();
        this.eventTime = new Date().toISOString();
        this.eventType = eventType;
    }

    public get EventId(): string {
        return this.eventId;
    }

    public get EventTime(): string {
        return this.eventTime;
    }

    public get EventType(): EventType {
        return this.eventType;
    }
}
