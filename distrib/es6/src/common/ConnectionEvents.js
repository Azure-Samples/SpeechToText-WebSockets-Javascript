import { EventType, PlatformEvent } from "./PlatformEvent";
export class ConnectionEvent extends PlatformEvent {
    constructor(eventName, connectionId, eventType = EventType.Info) {
        super(eventName, eventType);
        this.connectionId = connectionId;
    }
    get ConnectionId() {
        return this.connectionId;
    }
}
export class ConnectionStartEvent extends ConnectionEvent {
    constructor(connectionId, uri, headers) {
        super("ConnectionStartEvent", connectionId);
        this.uri = uri;
        this.headers = headers;
    }
    get Uri() {
        return this.uri;
    }
    get Headers() {
        return this.headers;
    }
}
export class ConnectionEstablishedEvent extends ConnectionEvent {
    constructor(connectionId, metadata) {
        super("ConnectionEstablishedEvent", connectionId);
    }
}
export class ConnectionClosedEvent extends ConnectionEvent {
    constructor(connectionId, statusCode, reason) {
        super("ConnectionClosedEvent", connectionId, EventType.Warning);
        this.reason = reason;
        this.statusCode = statusCode;
    }
    get Reason() {
        return this.reason;
    }
    get StatusCode() {
        return this.statusCode;
    }
}
export class ConnectionEstablishErrorEvent extends ConnectionEvent {
    constructor(connectionId, statuscode, reason) {
        super("ConnectionEstablishErrorEvent", connectionId, EventType.Error);
        this.statusCode = statuscode;
        this.reason = reason;
    }
    get Reason() {
        return this.reason;
    }
    get StatusCode() {
        return this.statusCode;
    }
}
export class ConnectionMessageReceivedEvent extends ConnectionEvent {
    constructor(connectionId, networkReceivedTimeISO, message) {
        super("ConnectionMessageReceivedEvent", connectionId);
        this.networkReceivedTime = networkReceivedTimeISO;
        this.message = message;
    }
    get NetworkReceivedTime() {
        return this.networkReceivedTime;
    }
    get Message() {
        return this.message;
    }
}
export class ConnectionMessageSentEvent extends ConnectionEvent {
    constructor(connectionId, networkSentTimeISO, message) {
        super("ConnectionMessageSentEvent", connectionId);
        this.networkSentTime = networkSentTimeISO;
        this.message = message;
    }
    get NetworkSentTime() {
        return this.networkSentTime;
    }
    get Message() {
        return this.message;
    }
}

//# sourceMappingURL=ConnectionEvents.js.map
