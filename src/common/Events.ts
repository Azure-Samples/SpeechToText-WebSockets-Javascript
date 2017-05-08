import { ArgumentNullError } from "./Error";
import { EventSource } from "./EventSource";
import { IEventSource } from "./IEventSource";
import { PlatformEvent } from "./PlatformEvent";

/**
 * The global source for emitting and consuming all events.
 *
 * @export
 * @class Events
 */
export class Events {
    private static instance: IEventSource<PlatformEvent> = new EventSource<PlatformEvent>();

    /**
     * Sets the global event source.
     *
     * @static
     * @param {IEventSource<PlatformEvent>} eventSource The event souce to set.
     *
     * @memberof Events
     */
    public static SetEventSource(eventSource: IEventSource<PlatformEvent>): void {
        if (!eventSource) {
            throw new ArgumentNullError("eventSource");
        }

        Events.instance = eventSource;
    }

    /**
     * The event source instance.
     *
     * @readonly
     * @static
     * @type {IEventSource<PlatformEvent>}
     * @memberof Events
     */
    public static get Instance(): IEventSource<PlatformEvent> {
        return Events.instance;
    }
}
