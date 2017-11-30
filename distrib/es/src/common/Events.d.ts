import { IEventSource } from "./IEventSource";
import { PlatformEvent } from "./PlatformEvent";
export declare class Events {
    private static instance;
    static SetEventSource: (eventSource: IEventSource<PlatformEvent>) => void;
    static readonly Instance: IEventSource<PlatformEvent>;
}
