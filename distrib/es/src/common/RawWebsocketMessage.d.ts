import { MessageType } from "./ConnectionMessage";
export declare class RawWebsocketMessage {
    private messageType;
    private payload;
    private id;
    constructor(messageType: MessageType, payload: any, id?: string);
    readonly MessageType: MessageType;
    readonly Payload: any;
    readonly TextContent: string;
    readonly BinaryContent: ArrayBuffer;
    readonly Id: string;
}
