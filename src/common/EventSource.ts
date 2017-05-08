import { ObjectDisposedError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
import { IDetachable } from "./IDetachable";
import { IStringDictionary } from "./IDictionary";
import { IEventListener, IEventSource } from "./IEventSource";
import { PlatformEvent } from "./PlatformEvent";

/**
 * EventSource provides ability to emit and consume events in a standard way.
 *
 * @export
 * @class EventSource
 * @implements {IEventSource<TEvent>}
 * @template TEvent
 */
export class EventSource<TEvent extends PlatformEvent> implements IEventSource<TEvent> {
    private eventListeners: IStringDictionary<(event: TEvent) => void> = {};
    private isDisposed: boolean = false;

    /**
     * Emits an event to the event source that can be consumed by all the attached listeners.
     *
     * @param {TEvent} e The event to emit
     *
     * @memberof IEventSource
     */
    public OnEvent = (event: TEvent): void => {
        if (this.IsDisposed) {
            throw (new ObjectDisposedError("EventSource"));
        }

        for (const eventId in this.eventListeners) {
            if (eventId && this.eventListeners[eventId]) {
                this.eventListeners[eventId](event);
            }
        }
    }

    /**
     * Attach a callback listener.
     *
     * @param {(event: TEvent) => void} onEventCallback Called when an event is emitted on this EventSource.
     * @returns {IDetachable} Detachable that provides a mechanism to detach the callback listener from the EventSource.
     *
     * @memberof IEventSource
     */
    public Attach = (onEventCallback: (event: TEvent) => void): IDetachable => {
        const id = CreateNoDashGuid();
        this.eventListeners[id] = onEventCallback;
        return {
            Detach: () => {
                delete this.eventListeners[id];
            },
        };
    }

    /**
     * Attach a listener.
     *
     * @param {IEventListener<TEvent>} listener
     * @returns {IDetachable} Detachable that provides a mechanism to detach the listener from the EventSource.
     *
     * @memberof IEventSource
     */
    public AttachListener = (listener: IEventListener<TEvent>): IDetachable => {
        return this.Attach(listener.OnEvent);
    }

    /**
     * Indicates if the current instance is disposed.
     *
     * @readonly
     * @type {boolean}
     * @memberof EventSource
     */
    public get IsDisposed(): boolean {
        return this.isDisposed;
    }

    /**
     * Disposes the current instance and performs the cleanup operations associated.
     *
     * @memberof EventSource
     */
    public Dispose = (): void => {
        this.eventListeners = null;
        this.isDisposed = true;
    }
}
