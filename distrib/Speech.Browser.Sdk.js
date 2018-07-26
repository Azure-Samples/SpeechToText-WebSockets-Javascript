"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("./src/common.browser/Exports");
var Exports_2 = require("./src/common/Exports");
// Common.Storage.SetLocalStorage(new Common.Browser.LocalStorage());
// Common.Storage.SetSessionStorage(new Common.Browser.SessionStorage());
Exports_2.Events.Instance.AttachListener(new Exports_1.ConsoleLoggingListener());
__export(require("./src/common/Exports"));
__export(require("./src/common.browser/Exports"));
__export(require("./src/sdk/speech/Exports"));
__export(require("./src/sdk/speech.browser/Exports"));

//# sourceMappingURL=Speech.Browser.Sdk.js.map
