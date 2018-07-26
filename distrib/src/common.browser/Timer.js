"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timer = /** @class */ (function () {
    function Timer(delayInMillisec, successCallback) {
        var _this = this;
        this.start = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (_this.timerId) {
                _this.stop();
            }
            _this.timerId = setTimeout(_this.successCallback, _this.delayInMillisec, params);
        };
        this.stop = function () {
            clearTimeout(_this.timerId);
        };
        this.delayInMillisec = delayInMillisec;
        this.successCallback = successCallback;
    }
    return Timer;
}());
exports.Timer = Timer;

//# sourceMappingURL=Timer.js.map
