import { ConnectionMessage, Deferred, MessageType, RawWebsocketMessage, } from "../../common/Exports";
const CRLF = "\r\n";
export class WebsocketMessageFormatter {
    constructor() {
        this.ToConnectionMessage = (message) => {
            const deferral = new Deferred();
            try {
                if (message.MessageType === MessageType.Text) {
                    const textMessage = message.TextContent;
                    let headers = {};
                    let body = null;
                    if (textMessage) {
                        const headerBodySplit = textMessage.split("\r\n\r\n");
                        if (headerBodySplit && headerBodySplit.length > 0) {
                            headers = this.ParseHeaders(headerBodySplit[0]);
                            if (headerBodySplit.length > 1) {
                                body = headerBodySplit[1];
                            }
                        }
                    }
                    deferral.Resolve(new ConnectionMessage(message.MessageType, body, headers, message.Id));
                }
                else if (message.MessageType === MessageType.Binary) {
                    const binaryMessage = message.BinaryContent;
                    let headers = {};
                    let body = null;
                    if (!binaryMessage || binaryMessage.byteLength < 2) {
                        throw new Error("Invalid binary message format. Header length missing.");
                    }
                    const dataView = new DataView(binaryMessage);
                    const headerLength = dataView.getInt16(0);
                    if (binaryMessage.byteLength < headerLength + 2) {
                        throw new Error("Invalid binary message format. Header content missing.");
                    }
                    let headersString = "";
                    for (let i = 0; i < headerLength; i++) {
                        headersString += String.fromCharCode((dataView).getInt8(i + 2));
                    }
                    headers = this.ParseHeaders(headersString);
                    if (binaryMessage.byteLength > headerLength + 2) {
                        body = binaryMessage.slice(2 + headerLength);
                    }
                    deferral.Resolve(new ConnectionMessage(message.MessageType, body, headers, message.Id));
                }
            }
            catch (e) {
                deferral.Reject(`Error formatting the message. Error: ${e}`);
            }
            return deferral.Promise();
        };
        this.FromConnectionMessage = (message) => {
            const deferral = new Deferred();
            try {
                if (message.MessageType === MessageType.Text) {
                    const payload = `${this.MakeHeaders(message)}${CRLF}${message.TextBody ? message.TextBody : ""}`;
                    deferral.Resolve(new RawWebsocketMessage(MessageType.Text, payload, message.Id));
                }
                else if (message.MessageType === MessageType.Binary) {
                    const headersString = this.MakeHeaders(message);
                    const content = message.BinaryBody;
                    const fr = new FileReader();
                    fr.onload = () => {
                        const headerInt8Array = new Int8Array(fr.result);
                        const payload = new ArrayBuffer(2 + headerInt8Array.byteLength + (content ? content.byteLength : 0));
                        const dataView = new DataView(payload);
                        dataView.setInt16(0, headerInt8Array.length);
                        for (let i = 0; i < headerInt8Array.byteLength; i++) {
                            dataView.setInt8(2 + i, headerInt8Array[i]);
                        }
                        if (content) {
                            const bodyInt8Array = new Int8Array(content);
                            for (let i = 0; i < bodyInt8Array.byteLength; i++) {
                                dataView.setInt8(2 + headerInt8Array.byteLength + i, bodyInt8Array[i]);
                            }
                        }
                        deferral.Resolve(new RawWebsocketMessage(MessageType.Binary, payload, message.Id));
                    };
                    fr.onerror = () => {
                        deferral.Reject("failed to load headers into file reader");
                    };
                    fr.readAsArrayBuffer(new Blob([headersString]));
                }
            }
            catch (e) {
                deferral.Reject(`Error formatting the message. ${e}`);
            }
            return deferral.Promise();
        };
        this.MakeHeaders = (message) => {
            let headersString = "";
            if (message.Headers) {
                for (const header in message.Headers) {
                    if (header) {
                        headersString += `${header}: ${message.Headers[header]}${CRLF}`;
                    }
                }
            }
            return headersString;
        };
        this.ParseHeaders = (headersString) => {
            const headers = {};
            if (headersString) {
                const headerMatches = headersString.match(/[^\r\n]+/g);
                if (headers) {
                    for (const header of headerMatches) {
                        if (header) {
                            const separatorIndex = header.indexOf(":");
                            const headerName = separatorIndex > 0 ? header.substr(0, separatorIndex).trim().toLowerCase() : header;
                            const headerValue = separatorIndex > 0 && header.length > (separatorIndex + 1) ?
                                header.substr(separatorIndex + 1).trim() :
                                "";
                            headers[headerName] = headerValue;
                        }
                    }
                }
            }
            return headers;
        };
    }
}

//# sourceMappingURL=WebsocketMessageFormatter.js.map
