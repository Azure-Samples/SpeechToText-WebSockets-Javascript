import { InvalidOperationError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Text"] = 0] = "Text";
    MessageType[MessageType["Binary"] = 1] = "Binary";
})(MessageType || (MessageType = {}));
export class ConnectionMessage {
    constructor(messageType, body, headers, id) {
        this.body = null;
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
    get MessageType() {
        return this.messageType;
    }
    get Headers() {
        return this.headers;
    }
    get Body() {
        return this.body;
    }
    get TextBody() {
        if (this.messageType === MessageType.Binary) {
            throw new InvalidOperationError("Not supported for binary message");
        }
        return this.body;
    }
    get BinaryBody() {
        if (this.messageType === MessageType.Text) {
            throw new InvalidOperationError("Not supported for text message");
        }
        return this.body;
    }
    get Id() {
        return this.id;
    }
}

//# sourceMappingURL=ConnectionMessage.js.map
