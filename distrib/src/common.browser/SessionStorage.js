"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
        this.Get = function (key) {
            if (!key) {
                throw new Exports_1.ArgumentNullError("key");
            }
            return sessionStorage.getItem(key);
        };
        this.GetOrAdd = function (key, valueToAdd) {
            if (!key) {
                throw new Exports_1.ArgumentNullError("key");
            }
            var value = sessionStorage.getItem(key);
            if (value === null || value === undefined) {
                sessionStorage.setItem(key, valueToAdd);
            }
            return sessionStorage.getItem(key);
        };
        this.Set = function (key, value) {
            if (!key) {
                throw new Exports_1.ArgumentNullError("key");
            }
            sessionStorage.setItem(key, value);
        };
        this.Remove = function (key) {
            if (!key) {
                throw new Exports_1.ArgumentNullError("key");
            }
            sessionStorage.removeItem(key);
        };
    }
    return SessionStorage;
}());
exports.SessionStorage = SessionStorage;

//# sourceMappingURL=SessionStorage.js.map
