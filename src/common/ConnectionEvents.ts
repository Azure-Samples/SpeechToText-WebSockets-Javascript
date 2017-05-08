import { ConnectionMessage } from "./ConnectionMessage";
import { ArgumentNullError } from "./Error";
import { IStringDictionary } from "./IDictionary";
import { EventType, PlatformEvent } from "./PlatformEvent";

/**
 * Base event class for all Connection events
 *
 * @export
 * @class ConnectionEvent
 * @extends {PlatformEvent}
 */
export class ConnectionEvent extends PlatformEvent {
    private connectionId: string;

    /**
     * Creates an instance of ConnectionEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {EventType} [eventType=EventType.Info] The optional event type of the event.
     *
     * @memberof ConnectionEvent
     */
    constructor(connectionId: string, eventType: EventType = EventType.Info) {
        if (!connectionId) {
            throw new ArgumentNullError("connectionId");
        }

        super(eventType);
        this.connectionId = connectionId;
    }

    /**
     * Unique id specific to the connection under use.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionEvent
     */
    public get ConnectionId(): string {
        return this.connectionId;
    }
}

/**
 * Event emitted just prior to eatablishing a connection to the service.
 *
 * @export
 * @class ConnectionStartEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionStartEvent extends ConnectionEvent {
    private uri: string;
    private headers: IStringDictionary<string>;

    /**
     * Creates an instance of ConnectionStartEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {string} uri The connection url
     * @param {IStringDictionary<string>} [headers] The connection headers
     *
     * @memberof ConnectionStartEvent
     */
    constructor(connectionId: string, uri: string, headers?: IStringDictionary<string>) {
        super(connectionId);
        this.uri = uri;
        this.headers = headers;
    }

    /**
     * The connection url
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionStartEvent
     */
    public get Uri(): string {
        return this.uri;
    }

    /**
     * The connection headers
     *
     * @readonly
     * @type {IStringDictionary<string>}
     * @memberof ConnectionStartEvent
     */
    public get Headers(): IStringDictionary<string> {
        return this.headers;
    }
}

/**
 * Event emitted once the connection is established.
 *
 * @export
 * @class ConnectionEstablishedEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionEstablishedEvent extends ConnectionEvent {
    /**
     * Creates an instance of ConnectionEstablishedEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {IStringDictionary<string>} [metadata]
     *
     * @memberof ConnectionEstablishedEvent
     */
    constructor(connectionId: string, metadata?: IStringDictionary<string>) {
        super(connectionId);
    }
}

/**
 * Event emitted once the connection is closed
 *
 * @export
 * @class ConnectionClosedEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionClosedEvent extends ConnectionEvent {
    private reason: string;
    private statusCode: number;

    /**
     * Creates an instance of ConnectionClosedEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {number} statusCode The connection close status code.
     * @param {string} reason The connection close reason.
     *
     * @memberof ConnectionClosedEvent
     */
    constructor(connectionId: string, statusCode: number, reason: string) {
        super(connectionId, EventType.Warning);
        this.reason = reason;
        this.statusCode = statusCode;
    }

    /**
     * The connection close reason.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionClosedEvent
     */
    public get Reason(): string {
        return this.reason;
    }

    /**
     * The connection close status code.
     *
     * @readonly
     * @type {number}
     * @memberof ConnectionClosedEvent
     */
    public get StatusCode(): number {
        return this.statusCode;
    }
}

/**
 * The event emitted if there is an error establishing the connection to the service.
 *
 * @export
 * @class ConnectionEstablishErrorEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionEstablishErrorEvent extends ConnectionEvent {
    private statusCode: number;
    private reason: string;

    /**
     * Creates an instance of ConnectionEstablishErrorEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {number} statuscode The connection establish error status code
     * @param {string} reason The connection establish error reason
     *
     * @memberof ConnectionEstablishErrorEvent
     */
    constructor(connectionId: string, statuscode: number, reason: string) {
        super(connectionId, EventType.Error);
        this.statusCode = statuscode;
        this.reason = reason;
    }

    /**
     *  The connection establish error reason
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionEstablishErrorEvent
     */
    public get Reason(): string {
        return this.reason;
    }

    /**
     *  The connection establish error status code
     *
     * @readonly
     * @type {number}
     * @memberof ConnectionEstablishErrorEvent
     */
    public get StatusCode(): number {
        return this.statusCode;
    }
}

/**
 * The event emitted on receving a message over the connection.
 *
 * @export
 * @class ConnectionMessageReceivedEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionMessageReceivedEvent extends ConnectionEvent {
    private networkReceivedTime: string;
    private message: ConnectionMessage;

    /**
     * Creates an instance of ConnectionMessageReceivedEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {string} networkReceivedTimeISO The time at which the message is received over the network.
     * @param {ConnectionMessage} message The message payload received.
     *
     * @memberof ConnectionMessageReceivedEvent
     */
    constructor(connectionId: string, networkReceivedTimeISO: string, message: ConnectionMessage) {
        super(connectionId);
        this.networkReceivedTime = networkReceivedTimeISO;
        this.message = message;
    }

    /**
     * The time at which the message is received over the network.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionMessageReceivedEvent
     */
    public get NetworkReceivedTime(): string {
        return this.networkReceivedTime;
    }

    /**
     * The message payload received.
     *
     * @readonly
     * @type {ConnectionMessage}
     * @memberof ConnectionMessageReceivedEvent
     */
    public get Message(): ConnectionMessage {
        return this.message;
    }
}

/**
 * The event emitted on sending a message over the connection.
 *
 * @export
 * @class ConnectionMessageSentEvent
 * @extends {ConnectionEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class ConnectionMessageSentEvent extends ConnectionEvent {
    private networkSentTime: string;
    private message: ConnectionMessage;

    /**
     * Creates an instance of ConnectionMessageSentEvent.
     * @param {string} connectionId Unique id specific to the connection under use.
     * @param {string} networkSentTimeISO The time at which the message is sent over the network.
     * @param {ConnectionMessage} message The message payload sent.
     *
     * @memberof ConnectionMessageSentEvent
     */
    constructor(connectionId: string, networkSentTimeISO: string, message: ConnectionMessage) {
        super(connectionId);
        this.networkSentTime = networkSentTimeISO;
        this.message = message;
    }

    /**
     * The time at which the message is sent over the network.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionMessageSentEvent
     */
    public get NetworkSentTime(): string {
        return this.networkSentTime;
    }

    /**
     * The message payload sent.
     *
     * @readonly
     * @type {ConnectionMessage}
     * @memberof ConnectionMessageSentEvent
     */
    public get Message(): ConnectionMessage {
        return this.message;
    }
}
