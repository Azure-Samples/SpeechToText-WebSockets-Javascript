"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionMessage_1 = require("./ConnectionMessage");
var Error_1 = require("./Error");
var Guid_1 = require("./Guid");
var RawWebsocketMessage = /** @class */ (function () {
    function RawWebsocketMessage(messageType, payload, id) {
        this.payload = null;
        if (!payload) {
            throw new Error_1.ArgumentNullError("payload");
        }
        if (messageType === ConnectionMessage_1.MessageType.Binary && !(payload instanceof ArrayBuffer)) {
            throw new Error_1.InvalidOperationError("Payload must be ArrayBuffer");
        }
        if (messageType === ConnectionMessage_1.MessageType.Text && !(typeof (payload) === "string")) {
            throw new Error_1.InvalidOperationError("Payload must be a string");
        }
        this.messageType = messageType;
        this.payload = payload;
        this.id = id ? id : Guid_1.CreateNoDashGuid();
    }
    Object.defineProperty(RawWebsocketMessage.prototype, "MessageType", {
        get: function () {
            return this.messageType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawWebsocketMessage.prototype, "Payload", {
        get: function () {
            return this.payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawWebsocketMessage.prototype, "TextContent", {
        get: function () {
            if (this.messageType === ConnectionMessage_1.MessageType.Binary) {
                throw new Error_1.InvalidOperationError("Not supported for binary message");
            }
            return this.payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawWebsocketMessage.prototype, "BinaryContent", {
        get: function () {
            if (this.messageType === ConnectionMessage_1.MessageType.Text) {
                throw new Error_1.InvalidOperationError("Not supported for text message");
            }
            return this.payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawWebsocketMessage.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    return RawWebsocketMessage;
}());
exports.RawWebsocketMessage = RawWebsocketMessage;

//# sourceMappingURL=RawWebsocketMessage.js.map
