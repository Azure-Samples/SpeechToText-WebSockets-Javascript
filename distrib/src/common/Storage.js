"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var InMemoryStorage_1 = require("./InMemoryStorage");
var Storage = /** @class */ (function () {
    function Storage() {
    }
    Object.defineProperty(Storage, "Session", {
        get: function () {
            return Storage.sessionStorage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Storage, "Local", {
        get: function () {
            return Storage.localStorage;
        },
        enumerable: true,
        configurable: true
    });
    Storage.sessionStorage = new InMemoryStorage_1.InMemoryStorage();
    Storage.localStorage = new InMemoryStorage_1.InMemoryStorage();
    Storage.SetSessionStorage = function (sessionStorage) {
        if (!sessionStorage) {
            throw new Error_1.ArgumentNullError("sessionStorage");
        }
        Storage.sessionStorage = sessionStorage;
    };
    Storage.SetLocalStorage = function (localStorage) {
        if (!localStorage) {
            throw new Error_1.ArgumentNullError("localStorage");
        }
        Storage.localStorage = localStorage;
    };
    return Storage;
}());
exports.Storage = Storage;

//# sourceMappingURL=Storage.js.map
