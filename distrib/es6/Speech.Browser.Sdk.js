import { ConsoleLoggingListener } from "./src/common.browser/Exports";
import { Events } from "./src/common/Exports";
Events.Instance.AttachListener(new ConsoleLoggingListener());
export * from "./src/common/Exports";
export * from "./src/common.browser/Exports";
export * from "./src/sdk/speech/Exports";
export * from "./src/sdk/speech.browser/Exports";

//# sourceMappingURL=Speech.Browser.Sdk.js.map
