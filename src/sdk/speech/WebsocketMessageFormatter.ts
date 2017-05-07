import {
    ConnectionMessage,
    Deferred,
    IStringDictionary,
    IWebsocketMessageFormatter,
    MessageType,
    Promise,
    RawWebsocketMessage,
} from "../../common/Exports";

const CRLF: string = "\r\n";

export class WebsocketMessageFormatter implements IWebsocketMessageFormatter {

    public ToConnectionMessage = (message: RawWebsocketMessage): Promise<ConnectionMessage> => {
        const deferral = new Deferred<ConnectionMessage>();

        try {
            if (message.MessageType === MessageType.Text) {
                const textMessage: string = message.TextContent;
                let headers: IStringDictionary<string> = {};
                let body: string = null;

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
            } else if (message.MessageType === MessageType.Binary) {
                const binaryMessage: ArrayBuffer = message.BinaryContent;
                let headers: IStringDictionary<string> = {};
                let body: ArrayBuffer = null;

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
        } catch (e) {
            deferral.Reject(`Error formatting the message. Error: ${e}`);
        }

        return deferral.Promise();
    }

    public FromConnectionMessage = (message: ConnectionMessage): Promise<RawWebsocketMessage> => {
        const deferral = new Deferred<RawWebsocketMessage>();

        try {
            if (message.MessageType === MessageType.Text) {
                const payload = `${this.MakeHeaders(message)}${CRLF}${message.TextBody ? message.TextBody : ""}`;

                deferral.Resolve(new RawWebsocketMessage(MessageType.Text, payload, message.Id));

            } else if (message.MessageType === MessageType.Binary) {
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
        } catch (e) {
            deferral.Reject(`Error formatting the message. ${e}`);
        }

        return deferral.Promise();
    }

    private MakeHeaders = (message: ConnectionMessage): string => {
        let headersString: string = "";

        if (message.Headers) {
            for (const header in message.Headers) {
                if (header) {
                    headersString += `${header}: ${message.Headers[header]}${CRLF}`;
                }
            }
        }

        return headersString;
    }

    private ParseHeaders = (headersString: string): IStringDictionary<string> => {
        const headers: IStringDictionary<string> = {};

        if (headersString) {
            const headerMatches = headersString.match(/[^\r\n]+/g);
            if (headers) {
                for (const header of headerMatches) {
                    if (header) {
                        const seperatorIndex = header.indexOf(":");
                        const headerName = seperatorIndex > 0 ? header.substr(0, seperatorIndex).trim().toLowerCase() : header;
                        const headerValue =
                            seperatorIndex > 0 && header.length > (seperatorIndex + 1) ?
                                header.substr(seperatorIndex + 1).trim() :
                                "";

                        headers[headerName] = headerValue;
                    }
                }
            }
        }

        return headers;
    }
}
