import { ConnectionMessage, IStringDictionary, MessageType } from "../../common/Exports";
export declare class SpeechConnectionMessage extends ConnectionMessage {
    private path;
    private requestId;
    private contentType;
    private additionalHeaders;
    constructor(messageType: MessageType, path: string, requestId: string, contentType: string, body: any, additionalHeaders?: IStringDictionary<string>, id?: string);
    readonly Path: string;
    readonly RequestId: string;
    readonly ContentType: string;
    readonly AdditionalHeaders: IStringDictionary<string>;
    static FromConnectionMessage: (message: ConnectionMessage) => SpeechConnectionMessage;
}
