import { InvalidOperationError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
import { IStringDictionary } from "./IDictionary";

/**
 * The type of message
 *
 * @export
 * @enum {number}
 */
export enum MessageType {
    /**
     * Text message
     */
    Text,
    /**
     * Binary message
     */
    Binary,
}

/**
 * Message sent or received on a Connection.
 *
 * @export
 * @class ConnectionMessage
 */
export class ConnectionMessage {

    private messageType: MessageType;
    private headers: IStringDictionary<string>;
    private body: string | ArrayBuffer = null;
    private id: string;

    /**
     * Creates an instance of ConnectionMessage.
     * @param {MessageType} messageType The type of connection message.
     * @param {string | ArrayBuffer} body The body part of the message. Body must be a 'string for Text messages' Or 'ArrayBuffer for Binary messages'.
     * @param {IStringDictionary<string>} [headers] Optional headers part of the message.
     * @param {string} [id] The unique id specific to the message. Auto-generated if not provided.
     *
     * @memberof ConnectionMessage
     */
    public constructor(
        messageType: MessageType,
        body: string | ArrayBuffer,
        headers?: IStringDictionary<string>,
        id?: string) {

        if (messageType === MessageType.Text && body && !(typeof (body) === "string")) {
            throw new InvalidOperationError("Payload must be a string");
        }

        if (messageType === MessageType.Binary && body && !(body instanceof ArrayBuffer)) {
            throw new InvalidOperationError("Payload must be ArrayBuffer");
        }

        this.messageType = messageType;
        this.body = body;
        this.headers = headers ? headers : {};
        this.id = id ? id : CreateNoDashGuid();
    }

    /**
     * The type of connection message.
     *
     * @readonly
     * @type {MessageType}
     * @memberof ConnectionMessage
     */
    public get MessageType(): MessageType {
        return this.messageType;
    }

    /**
     * The headers part of the message.
     *
     * @readonly
     * @type {*}
     * @memberof ConnectionMessage
     */
    public get Headers(): any {
        return this.headers;
    }

    /**
     *  The body part of the message. Body will be a 'string for Text messages' Or 'ArrayBuffer for Binary messages'.
     *
     * @readonly
     * @type {string | ArrayBuffer}
     * @memberof ConnectionMessage
     */
    public get Body(): string | ArrayBuffer {
        return this.body;
    }

    /**
     * The text body for a Text message. Throws an error for non-Text messages.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionMessage
     */
    public get TextBody(): string {
        if (this.messageType === MessageType.Binary) {
            throw new InvalidOperationError("Not supported for binary message");
        }

        return this.body as string;
    }

    /**
     * The binary body for a Binary message. Throws an error for non-Binary messages.
     *
     * @readonly
     * @type {ArrayBuffer}
     * @memberof ConnectionMessage
     */
    public get BinaryBody(): ArrayBuffer {
        if (this.messageType === MessageType.Text) {
            throw new InvalidOperationError("Not supported for text message");
        }

        return this.body as ArrayBuffer;
    }

    /**
     * The unique id specific to the message.
     *
     * @readonly
     * @type {string}
     * @memberof ConnectionMessage
     */
    public get Id(): string {
        return this.id;
    }
}
