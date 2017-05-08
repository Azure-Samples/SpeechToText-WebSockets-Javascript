import { IDetachable } from "./IDetachable";
import { IStringDictionary } from "./IDictionary";
import { IDisposable } from "./IDisposable";
import { PlatformEvent } from "./PlatformEvent";

/**
 * Provides a mechanism for listening to events emitted on an EventSource.
 *
 * @export
 * @interface IEventListener
 * @template TEvent
 */
export interface IEventListener<TEvent extends PlatformEvent> {
    /**
     * Called when an event is emitted on the EventSource to which this is attached.
     *
     * @param {TEvent} e The event
     *
     * @memberof IEventListener
     */
    OnEvent(e: TEvent): void;
}

/**
 * Provides mechanism to emit and consume events in a standard way.
 *
 * @export
 * @interface IEventSource
 * @extends {IDisposable}
 * @template TEvent
 */
export interface IEventSource<TEvent extends PlatformEvent> extends IDisposable {

    /**
     * Emits an event to the event source that can be consumed by all the attached listeners.
     *
     * @param {TEvent} e The event to emit
     *
     * @memberof IEventSource
     */
    OnEvent(e: TEvent): void;

    /**
     * Attach a callback listener.
     *
     * @param {(event: TEvent) => void} onEventCallback Called when an event is emitted on this EventSource.
     * @returns {IDetachable} Detachable that provides a mechanism to detach the callback listener from the EventSource.
     *
     * @memberof IEventSource
     */
    Attach(onEventCallback: (event: TEvent) => void): IDetachable;

    /**
     * Attach a listener.
     *
     * @param {IEventListener<TEvent>} listener
     * @returns {IDetachable} Detachable that provides a mechanism to detach the listener from the EventSource.
     *
     * @memberof IEventSource
     */
    AttachListener(listener: IEventListener<TEvent>): IDetachable;
}
