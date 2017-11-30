import { IStringDictionary } from "./IDictionary";
export declare enum MessageType {
    Text = 0,
    Binary = 1,
}
export declare class ConnectionMessage {
    private messageType;
    private headers;
    private body;
    private id;
    constructor(messageType: MessageType, body: any, headers?: IStringDictionary<string>, id?: string);
    readonly MessageType: MessageType;
    readonly Headers: any;
    readonly Body: any;
    readonly TextBody: string;
    readonly BinaryBody: ArrayBuffer;
    readonly Id: string;
}
