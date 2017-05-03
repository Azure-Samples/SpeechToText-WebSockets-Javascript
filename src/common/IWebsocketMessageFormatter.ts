/// <reference path="Error.ts" />
/// <reference path="Promise.ts" />
/// <reference path="RawWebsocketMessage.ts" />
/// <reference path="ConnectionMessage.ts" />

namespace Common {

    export interface IWebsocketMessageFormatter {
        ToConnectionMessage(message: RawWebsocketMessage): Promise<ConnectionMessage>;
        FromConnectionMessage(message: ConnectionMessage): Promise<RawWebsocketMessage>;
    }

}
