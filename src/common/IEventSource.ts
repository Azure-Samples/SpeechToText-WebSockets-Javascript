/// <reference path = "IDisposable.ts" />
/// <reference path = "IDetachable.ts" />
/// <reference path = "PlatformEvent.ts" />

namespace Common {

    export interface IEventListener<TEvent extends PlatformEvent> {
        OnEvent(e: TEvent): void;
    }

    export interface IEventSource<TEvent extends PlatformEvent> extends IDisposable {
        Metadata: IStringDictionary<string>;

        OnEvent(e: TEvent): void;

        Attach(onEventCallback: (event: TEvent) => void): IDetachable;

        AttachListener(listener: IEventListener<TEvent>): IDetachable;
    }
}
