import { ArgumentNullError, CreateNoDashGuid, } from "../common/Exports";
import { WebsocketMessageAdapter } from "./WebsocketMessageAdapter";
export class WebsocketConnection {
    constructor(uri, queryParameters, headers, messageFormatter, connectionId) {
        this.isDisposed = false;
        this.Dispose = () => {
            this.isDisposed = true;
            if (this.connectionMessageAdapter) {
                this.connectionMessageAdapter.Close();
            }
        };
        this.IsDisposed = () => {
            return this.isDisposed;
        };
        this.State = () => {
            return this.connectionMessageAdapter.State;
        };
        this.Open = () => {
            return this.connectionMessageAdapter.Open();
        };
        this.Send = (message) => {
            return this.connectionMessageAdapter.Send(message);
        };
        this.Read = () => {
            return this.connectionMessageAdapter.Read();
        };
        if (!uri) {
            throw new ArgumentNullError("uri");
        }
        if (!messageFormatter) {
            throw new ArgumentNullError("messageFormatter");
        }
        this.messageFormatter = messageFormatter;
        let queryParams = "";
        let i = 0;
        if (queryParameters) {
            for (const paramName in queryParameters) {
                if (paramName) {
                    queryParams += i === 0 ? "?" : "&";
                    const val = encodeURIComponent(queryParameters[paramName]);
                    queryParams += `${paramName}=${val}`;
                    i++;
                }
            }
        }
        if (headers) {
            for (const headerName in headers) {
                if (headerName) {
                    queryParams += i === 0 ? "?" : "&";
                    const val = encodeURIComponent(headers[headerName]);
                    queryParams += `${headerName}=${val}`;
                    i++;
                }
            }
        }
        this.uri = uri + queryParams;
        this.id = connectionId ? connectionId : CreateNoDashGuid();
        this.connectionMessageAdapter = new WebsocketMessageAdapter(this.uri, this.Id, this.messageFormatter);
    }
    get Id() {
        return this.id;
    }
    get Events() {
        return this.connectionMessageAdapter.Events;
    }
}

//# sourceMappingURL=WebsocketConnection.js.map
