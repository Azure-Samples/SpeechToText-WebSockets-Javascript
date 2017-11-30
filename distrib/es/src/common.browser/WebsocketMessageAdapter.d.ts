import { ConnectionEvent, ConnectionMessage, ConnectionOpenResponse, ConnectionState, EventSource, IWebsocketMessageFormatter, Promise } from "../common/Exports";
export declare class WebsocketMessageAdapter {
    private connectionState;
    private messageFormatter;
    private websocketClient;
    private sendMessageQueue;
    private receivingMessageQueue;
    private connectionEstablishDeferral;
    private disconnectDeferral;
    private connectionEvents;
    private connectionId;
    private uri;
    constructor(uri: string, connectionId: string, messageFormatter: IWebsocketMessageFormatter);
    readonly State: ConnectionState;
    Open: () => Promise<ConnectionOpenResponse>;
    Send: (message: ConnectionMessage) => Promise<boolean>;
    Read: () => Promise<ConnectionMessage>;
    Close: (reason?: string) => Promise<boolean>;
    readonly Events: EventSource<ConnectionEvent>;
    private SendRawMessage;
    private OnClose;
    private ProcessSendQueue;
    private OnEvent;
}
