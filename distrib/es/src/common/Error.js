"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentNullError = (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName) {
        var _this = _super.call(this, argumentName) || this;
        _this.name = "ArgumentNull";
        _this.message = argumentName;
        return _this;
    }
    return ArgumentNullError;
}(Error));
exports.ArgumentNullError = ArgumentNullError;
var InvalidOperationError = (function (_super) {
    __extends(InvalidOperationError, _super);
    function InvalidOperationError(error) {
        var _this = _super.call(this, error) || this;
        _this.name = "InvalidOperation";
        _this.message = error;
        return _this;
    }
    return InvalidOperationError;
}(Error));
exports.InvalidOperationError = InvalidOperationError;
var ObjectDisposedError = (function (_super) {
    __extends(ObjectDisposedError, _super);
    function ObjectDisposedError(objectName, error) {
        var _this = _super.call(this, error) || this;
        _this.name = objectName + "ObjectDisposed";
        _this.message = error;
        return _this;
    }
    return ObjectDisposedError;
}(Error));
exports.ObjectDisposedError = ObjectDisposedError;

//# sourceMappingURL=Error.js.map
