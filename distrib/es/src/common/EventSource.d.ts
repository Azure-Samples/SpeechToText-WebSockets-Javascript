import { IDetachable } from "./IDetachable";
import { IStringDictionary } from "./IDictionary";
import { IEventListener, IEventSource } from "./IEventSource";
import { PlatformEvent } from "./PlatformEvent";
export declare class EventSource<TEvent extends PlatformEvent> implements IEventSource<TEvent> {
    private eventListeners;
    private metadata;
    private isDisposed;
    constructor(metadata?: IStringDictionary<string>);
    OnEvent: (event: TEvent) => void;
    Attach: (onEventCallback: (event: TEvent) => void) => IDetachable;
    AttachListener: (listener: IEventListener<TEvent>) => IDetachable;
    IsDisposed: () => boolean;
    Dispose: () => void;
    readonly Metadata: IStringDictionary<string>;
}
