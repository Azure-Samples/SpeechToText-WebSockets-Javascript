import { IStringDictionary } from "./IDictionary";
export declare enum EventType {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
}
export declare class PlatformEvent {
    private name;
    private eventId;
    private eventTime;
    private eventType;
    private metadata;
    constructor(eventName: string, eventType: EventType);
    readonly Name: string;
    readonly EventId: string;
    readonly EventTime: string;
    readonly EventType: EventType;
    readonly Metadata: IStringDictionary<string>;
}
