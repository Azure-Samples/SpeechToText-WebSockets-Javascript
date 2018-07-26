"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var CRLF = "\r\n";
var WebsocketMessageFormatter = /** @class */ (function () {
    function WebsocketMessageFormatter() {
        var _this = this;
        this.ToConnectionMessage = function (message) {
            var deferral = new Exports_1.Deferred();
            try {
                if (message.MessageType === Exports_1.MessageType.Text) {
                    var textMessage = message.TextContent;
                    var headers = {};
                    var body = null;
                    if (textMessage) {
                        var headerBodySplit = textMessage.split("\r\n\r\n");
                        if (headerBodySplit && headerBodySplit.length > 0) {
                            headers = _this.ParseHeaders(headerBodySplit[0]);
                            if (headerBodySplit.length > 1) {
                                body = headerBodySplit[1];
                            }
                        }
                    }
                    deferral.Resolve(new Exports_1.ConnectionMessage(message.MessageType, body, headers, message.Id));
                }
                else if (message.MessageType === Exports_1.MessageType.Binary) {
                    var binaryMessage = message.BinaryContent;
                    var headers = {};
                    var body = null;
                    if (!binaryMessage || binaryMessage.byteLength < 2) {
                        throw new Error("Invalid binary message format. Header length missing.");
                    }
                    var dataView = new DataView(binaryMessage);
                    var headerLength = dataView.getInt16(0);
                    if (binaryMessage.byteLength < headerLength + 2) {
                        throw new Error("Invalid binary message format. Header content missing.");
                    }
                    var headersString = "";
                    for (var i = 0; i < headerLength; i++) {
                        headersString += String.fromCharCode((dataView).getInt8(i + 2));
                    }
                    headers = _this.ParseHeaders(headersString);
                    if (binaryMessage.byteLength > headerLength + 2) {
                        body = binaryMessage.slice(2 + headerLength);
                    }
                    deferral.Resolve(new Exports_1.ConnectionMessage(message.MessageType, body, headers, message.Id));
                }
            }
            catch (e) {
                deferral.Reject("Error formatting the message. Error: " + e);
            }
            return deferral.Promise();
        };
        this.FromConnectionMessage = function (message) {
            var deferral = new Exports_1.Deferred();
            try {
                if (message.MessageType === Exports_1.MessageType.Text) {
                    var payload = "" + _this.MakeHeaders(message) + CRLF + (message.TextBody ? message.TextBody : "");
                    deferral.Resolve(new Exports_1.RawWebsocketMessage(Exports_1.MessageType.Text, payload, message.Id));
                }
                else if (message.MessageType === Exports_1.MessageType.Binary) {
                    var headersString = _this.MakeHeaders(message);
                    var content = message.BinaryBody;
                    var headerInt8Array = new Int8Array(_this.StringToArrayBuffer(headersString));
                    var payload = new ArrayBuffer(2 + headerInt8Array.byteLength + (content ? content.byteLength : 0));
                    var dataView = new DataView(payload);
                    dataView.setInt16(0, headerInt8Array.length);
                    for (var i = 0; i < headerInt8Array.byteLength; i++) {
                        dataView.setInt8(2 + i, headerInt8Array[i]);
                    }
                    if (content) {
                        var bodyInt8Array = new Int8Array(content);
                        for (var i = 0; i < bodyInt8Array.byteLength; i++) {
                            dataView.setInt8(2 + headerInt8Array.byteLength + i, bodyInt8Array[i]);
                        }
                    }
                    deferral.Resolve(new Exports_1.RawWebsocketMessage(Exports_1.MessageType.Binary, payload, message.Id));
                }
            }
            catch (e) {
                deferral.Reject("Error formatting the message. " + e);
            }
            return deferral.Promise();
        };
        this.MakeHeaders = function (message) {
            var headersString = "";
            if (message.Headers) {
                for (var header in message.Headers) {
                    if (header) {
                        headersString += header + ": " + message.Headers[header] + CRLF;
                    }
                }
            }
            return headersString;
        };
        this.ParseHeaders = function (headersString) {
            var headers = {};
            if (headersString) {
                var headerMatches = headersString.match(/[^\r\n]+/g);
                if (headers) {
                    for (var _i = 0, headerMatches_1 = headerMatches; _i < headerMatches_1.length; _i++) {
                        var header = headerMatches_1[_i];
                        if (header) {
                            var separatorIndex = header.indexOf(":");
                            var headerName = separatorIndex > 0 ? header.substr(0, separatorIndex).trim().toLowerCase() : header;
                            var headerValue = separatorIndex > 0 && header.length > (separatorIndex + 1) ?
                                header.substr(separatorIndex + 1).trim() :
                                "";
                            headers[headerName] = headerValue;
                        }
                    }
                }
            }
            return headers;
        };
        this.StringToArrayBuffer = function (str) {
            var buffer = new ArrayBuffer(str.length);
            var view = new DataView(buffer);
            for (var i = 0; i < str.length; i++) {
                view.setUint8(i, str.charCodeAt(i));
            }
            return buffer;
        };
    }
    return WebsocketMessageFormatter;
}());
exports.WebsocketMessageFormatter = WebsocketMessageFormatter;

//# sourceMappingURL=WebsocketMessageFormatter.js.map
