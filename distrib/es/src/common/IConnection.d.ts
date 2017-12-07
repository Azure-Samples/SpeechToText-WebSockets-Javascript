import { ConnectionEvent } from "./ConnectionEvents";
import { ConnectionMessage } from "./ConnectionMessage";
import { ConnectionOpenResponse } from "./ConnectionOpenResponse";
import { EventSource } from "./EventSource";
import { IDisposable } from "./IDisposable";
import { Promise } from "./Promise";
export declare enum ConnectionState {
    None = 0,
    Connected = 1,
    Connecting = 2,
    Disconnected = 3,
}
export interface IConnection extends IDisposable {
    Id: string;
    State(): ConnectionState;
    Open(): Promise<ConnectionOpenResponse>;
    Send(message: ConnectionMessage): Promise<boolean>;
    Read(): Promise<ConnectionMessage>;
    Events: EventSource<ConnectionEvent>;
}
