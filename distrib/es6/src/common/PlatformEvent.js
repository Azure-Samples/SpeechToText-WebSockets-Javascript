import { CreateNoDashGuid } from "./Guid";
export var EventType;
(function (EventType) {
    EventType[EventType["Debug"] = 0] = "Debug";
    EventType[EventType["Info"] = 1] = "Info";
    EventType[EventType["Warning"] = 2] = "Warning";
    EventType[EventType["Error"] = 3] = "Error";
})(EventType || (EventType = {}));
export class PlatformEvent {
    constructor(eventName, eventType) {
        this.name = eventName;
        this.eventId = CreateNoDashGuid();
        this.eventTime = new Date().toISOString();
        this.eventType = eventType;
        this.metadata = {};
    }
    get Name() {
        return this.name;
    }
    get EventId() {
        return this.eventId;
    }
    get EventTime() {
        return this.eventTime;
    }
    get EventType() {
        return this.eventType;
    }
    get Metadata() {
        return this.metadata;
    }
}

//# sourceMappingURL=PlatformEvent.js.map
