"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var InMemoryStorage = /** @class */ (function () {
    function InMemoryStorage() {
        var _this = this;
        this.store = {};
        this.Get = function (key) {
            if (!key) {
                throw new Error_1.ArgumentNullError("key");
            }
            return _this.store[key];
        };
        this.GetOrAdd = function (key, valueToAdd) {
            if (!key) {
                throw new Error_1.ArgumentNullError("key");
            }
            if (_this.store[key] === undefined) {
                _this.store[key] = valueToAdd;
            }
            return _this.store[key];
        };
        this.Set = function (key, value) {
            if (!key) {
                throw new Error_1.ArgumentNullError("key");
            }
            _this.store[key] = value;
        };
        this.Remove = function (key) {
            if (!key) {
                throw new Error_1.ArgumentNullError("key");
            }
            if (_this.store[key] !== undefined) {
                delete _this.store[key];
            }
        };
    }
    return InMemoryStorage;
}());
exports.InMemoryStorage = InMemoryStorage;

//# sourceMappingURL=InMemoryStorage.js.map
