import { EventType } from "../common/Exports";
export class ConsoleLoggingListener {
    constructor(logLevelFilter = EventType.Warning) {
        this.OnEvent = (event) => {
            if (event.EventType >= this.logLevelFilter) {
                const log = this.ToString(event);
                switch (event.EventType) {
                    case EventType.Debug:
                        console.debug(log);
                        break;
                    case EventType.Info:
                        console.info(log);
                        break;
                    case EventType.Warning:
                        console.warn(log);
                        break;
                    case EventType.Error:
                        console.error(log);
                        break;
                    default:
                        console.log(log);
                        break;
                }
            }
        };
        this.ToString = (event) => {
            const logFragments = [
                `${event.EventTime}`,
                `${event.Name}`,
            ];
            for (const prop in event) {
                if (prop && event.hasOwnProperty(prop) && prop !== "eventTime" && prop !== "eventType" && prop !== "eventId" && prop !== "name" && prop !== "constructor") {
                    const value = event[prop];
                    let valueToLog = "<NULL>";
                    if (value !== undefined && value !== null) {
                        if (typeof (value) === "number" || typeof (value) === "string") {
                            valueToLog = value.toString();
                        }
                        else {
                            valueToLog = JSON.stringify(value);
                        }
                    }
                    logFragments.push(`${prop}: ${valueToLog}`);
                }
            }
            return logFragments.join(" | ");
        };
        this.logLevelFilter = logLevelFilter;
    }
}

//# sourceMappingURL=ConsoleLoggingListener.js.map
