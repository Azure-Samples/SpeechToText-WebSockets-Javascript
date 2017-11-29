import { MessageType } from "./ConnectionMessage";
import { ArgumentNullError, InvalidOperationError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
export class RawWebsocketMessage {
    constructor(messageType, payload, id) {
        this.payload = null;
        if (!payload) {
            throw new ArgumentNullError("payload");
        }
        if (messageType === MessageType.Binary && !(payload instanceof ArrayBuffer)) {
            throw new InvalidOperationError("Payload must be ArrayBuffer");
        }
        if (messageType === MessageType.Text && !(typeof (payload) === "string")) {
            throw new InvalidOperationError("Payload must be a string");
        }
        this.messageType = messageType;
        this.payload = payload;
        this.id = id ? id : CreateNoDashGuid();
    }
    get MessageType() {
        return this.messageType;
    }
    get Payload() {
        return this.payload;
    }
    get TextContent() {
        if (this.messageType === MessageType.Binary) {
            throw new InvalidOperationError("Not supported for binary message");
        }
        return this.payload;
    }
    get BinaryContent() {
        if (this.messageType === MessageType.Text) {
            throw new InvalidOperationError("Not supported for text message");
        }
        return this.payload;
    }
    get Id() {
        return this.id;
    }
}

//# sourceMappingURL=RawWebsocketMessage.js.map
