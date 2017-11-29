import { ObjectDisposedError } from "./Error";
import { CreateNoDashGuid } from "./Guid";
export class EventSource {
    constructor(metadata) {
        this.eventListeners = {};
        this.isDisposed = false;
        this.OnEvent = (event) => {
            if (this.IsDisposed()) {
                throw (new ObjectDisposedError("EventSource"));
            }
            if (this.Metadata) {
                for (const paramName in this.Metadata) {
                    if (paramName) {
                        if (event.Metadata) {
                            if (!event.Metadata[paramName]) {
                                event.Metadata[paramName] = this.Metadata[paramName];
                            }
                        }
                    }
                }
            }
            for (const eventId in this.eventListeners) {
                if (eventId && this.eventListeners[eventId]) {
                    this.eventListeners[eventId](event);
                }
            }
        };
        this.Attach = (onEventCallback) => {
            const id = CreateNoDashGuid();
            this.eventListeners[id] = onEventCallback;
            return {
                Detach: () => {
                    delete this.eventListeners[id];
                },
            };
        };
        this.AttachListener = (listener) => {
            return this.Attach(listener.OnEvent);
        };
        this.IsDisposed = () => {
            return this.isDisposed;
        };
        this.Dispose = () => {
            this.eventListeners = null;
            this.isDisposed = true;
        };
        this.metadata = metadata;
    }
    get Metadata() {
        return this.metadata;
    }
}

//# sourceMappingURL=EventSource.js.map
