import { ArgumentNullError } from "./Error";
import { EventSource } from "./EventSource";
export class Events {
    static get Instance() {
        return Events.instance;
    }
}
Events.instance = new EventSource();
Events.SetEventSource = (eventSource) => {
    if (!eventSource) {
        throw new ArgumentNullError("eventSource");
    }
    Events.instance = eventSource;
};

//# sourceMappingURL=Events.js.map
