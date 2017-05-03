///<reference path="Error.ts"/>
///<reference path="IEventSource.ts"/>
///<reference path="EventSource.ts"/>
///<reference path="PlatformEvent.ts"/>

namespace Common {
    export class Events {
        private static instance: IEventSource<PlatformEvent> = new EventSource<PlatformEvent>();

        public static SetEventSource = (eventSource: IEventSource<PlatformEvent>): void => {
            if (!eventSource) {
                throw new ArgumentNullError("eventSource");
            }

            Events.instance = eventSource;
        }

        public static get Instance(): IEventSource<PlatformEvent> {
            return Events.instance;
        }
    }
}
