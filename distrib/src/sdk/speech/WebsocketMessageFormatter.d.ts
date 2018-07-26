import { ConnectionMessage, IWebsocketMessageFormatter, Promise, RawWebsocketMessage } from "../../common/Exports";
export declare class WebsocketMessageFormatter implements IWebsocketMessageFormatter {
    ToConnectionMessage: (message: RawWebsocketMessage) => Promise<ConnectionMessage>;
    FromConnectionMessage: (message: ConnectionMessage) => Promise<RawWebsocketMessage>;
    private MakeHeaders;
    private ParseHeaders;
    private StringToArrayBuffer;
}
