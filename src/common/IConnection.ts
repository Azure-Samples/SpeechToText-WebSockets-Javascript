/// <reference path="IDisposable.ts" />
/// <reference path="Promise.ts" />
/// <reference path="EventSource.ts" />
/// <reference path="ConnectionMessage.ts" />
/// <reference path="ConnectionOpenResponse.ts" />
/// <reference path="ConnectionEvents.ts" />

namespace Common {

    export enum ConnectionState {
        None,
        Connected,
        Connecting,
        Disconnected,
    }

    export interface IConnection extends IDisposable {
        Id: string;
        State(): ConnectionState;
        Open(): Promise<ConnectionOpenResponse>;
        Send(message: ConnectionMessage): Promise<boolean>;
        Read(): Promise<ConnectionMessage>;
        Events: EventSource<ConnectionEvent>;
    }
}
