import { ArgumentNullError, ConnectionMessage, } from "../../common/Exports";
const PathHeaderName = "path";
const ContentTypeHeaderName = "content-type";
const RequestIdHeaderName = "x-requestid";
const RequestTimestampHeaderName = "x-timestamp";
export class SpeechConnectionMessage extends ConnectionMessage {
    constructor(messageType, path, requestId, contentType, body, additionalHeaders, id) {
        if (!path) {
            throw new ArgumentNullError("path");
        }
        if (!requestId) {
            throw new ArgumentNullError("requestId");
        }
        const headers = {};
        headers[PathHeaderName] = path;
        headers[RequestIdHeaderName] = requestId;
        headers[RequestTimestampHeaderName] = new Date().toISOString();
        if (contentType) {
            headers[ContentTypeHeaderName] = contentType;
        }
        if (additionalHeaders) {
            for (const headerName in additionalHeaders) {
                if (headerName) {
                    headers[headerName] = additionalHeaders[headerName];
                }
            }
        }
        if (id) {
            super(messageType, body, headers, id);
        }
        else {
            super(messageType, body, headers);
        }
        this.path = path;
        this.requestId = requestId;
        this.contentType = contentType;
        this.additionalHeaders = additionalHeaders;
    }
    get Path() {
        return this.path;
    }
    get RequestId() {
        return this.requestId;
    }
    get ContentType() {
        return this.contentType;
    }
    get AdditionalHeaders() {
        return this.additionalHeaders;
    }
}
SpeechConnectionMessage.FromConnectionMessage = (message) => {
    let path = null;
    let requestId = null;
    let contentType = null;
    let requestTimestamp = null;
    const additionalHeaders = {};
    if (message.Headers) {
        for (const headerName in message.Headers) {
            if (headerName) {
                if (headerName.toLowerCase() === PathHeaderName.toLowerCase()) {
                    path = message.Headers[headerName];
                }
                else if (headerName.toLowerCase() === RequestIdHeaderName.toLowerCase()) {
                    requestId = message.Headers[headerName];
                }
                else if (headerName.toLowerCase() === RequestTimestampHeaderName.toLowerCase()) {
                    requestTimestamp = message.Headers[headerName];
                }
                else if (headerName.toLowerCase() === ContentTypeHeaderName.toLowerCase()) {
                    contentType = message.Headers[headerName];
                }
                else {
                    additionalHeaders[headerName] = message.Headers[headerName];
                }
            }
        }
    }
    return new SpeechConnectionMessage(message.MessageType, path, requestId, contentType, message.Body, additionalHeaders, message.Id);
};

//# sourceMappingURL=SpeechConnectionMessage.Internal.js.map
