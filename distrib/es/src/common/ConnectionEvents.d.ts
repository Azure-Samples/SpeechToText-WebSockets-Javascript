import { ConnectionMessage } from "./ConnectionMessage";
import { IStringDictionary } from "./IDictionary";
import { EventType, PlatformEvent } from "./PlatformEvent";
export declare class ConnectionEvent extends PlatformEvent {
    private connectionId;
    constructor(eventName: string, connectionId: string, eventType?: EventType);
    readonly ConnectionId: string;
}
export declare class ConnectionStartEvent extends ConnectionEvent {
    private uri;
    private headers;
    constructor(connectionId: string, uri: string, headers?: IStringDictionary<string>);
    readonly Uri: string;
    readonly Headers: IStringDictionary<string>;
}
export declare class ConnectionEstablishedEvent extends ConnectionEvent {
    constructor(connectionId: string, metadata?: IStringDictionary<string>);
}
export declare class ConnectionClosedEvent extends ConnectionEvent {
    private reason;
    private statusCode;
    constructor(connectionId: string, statusCode: number, reason: string);
    readonly Reason: string;
    readonly StatusCode: number;
}
export declare class ConnectionEstablishErrorEvent extends ConnectionEvent {
    private statusCode;
    private reason;
    constructor(connectionId: string, statuscode: number, reason: string);
    readonly Reason: string;
    readonly StatusCode: number;
}
export declare class ConnectionMessageReceivedEvent extends ConnectionEvent {
    private networkReceivedTime;
    private message;
    constructor(connectionId: string, networkReceivedTimeISO: string, message: ConnectionMessage);
    readonly NetworkReceivedTime: string;
    readonly Message: ConnectionMessage;
}
export declare class ConnectionMessageSentEvent extends ConnectionEvent {
    private networkSentTime;
    private message;
    constructor(connectionId: string, networkSentTimeISO: string, message: ConnectionMessage);
    readonly NetworkSentTime: string;
    readonly Message: ConnectionMessage;
}
