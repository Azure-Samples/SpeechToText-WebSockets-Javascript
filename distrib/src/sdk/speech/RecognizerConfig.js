"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RecognitionMode;
(function (RecognitionMode) {
    RecognitionMode[RecognitionMode["Interactive"] = 0] = "Interactive";
    RecognitionMode[RecognitionMode["Conversation"] = 1] = "Conversation";
    RecognitionMode[RecognitionMode["Dictation"] = 2] = "Dictation";
})(RecognitionMode = exports.RecognitionMode || (exports.RecognitionMode = {}));
var SpeechResultFormat;
(function (SpeechResultFormat) {
    SpeechResultFormat[SpeechResultFormat["Simple"] = 0] = "Simple";
    SpeechResultFormat[SpeechResultFormat["Detailed"] = 1] = "Detailed";
})(SpeechResultFormat = exports.SpeechResultFormat || (exports.SpeechResultFormat = {}));
var RecognizerConfig = /** @class */ (function () {
    function RecognizerConfig(platformConfig, recognitionMode, language, format) {
        if (recognitionMode === void 0) { recognitionMode = RecognitionMode.Interactive; }
        if (language === void 0) { language = "en-us"; }
        if (format === void 0) { format = SpeechResultFormat.Simple; }
        this.recognitionMode = RecognitionMode.Interactive;
        this.speechConfig = platformConfig ? platformConfig : new SpeechConfig(new Context(null, null));
        this.recognitionMode = recognitionMode;
        this.language = language;
        this.format = format;
        this.recognitionActivityTimeout = recognitionMode === RecognitionMode.Interactive ? 8000 : 25000;
    }
    Object.defineProperty(RecognizerConfig.prototype, "RecognitionMode", {
        get: function () {
            return this.recognitionMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognizerConfig.prototype, "Language", {
        get: function () {
            return this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognizerConfig.prototype, "Format", {
        get: function () {
            return this.format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognizerConfig.prototype, "SpeechConfig", {
        get: function () {
            return this.speechConfig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognizerConfig.prototype, "RecognitionActivityTimeout", {
        get: function () {
            return this.recognitionActivityTimeout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecognizerConfig.prototype, "IsContinuousRecognition", {
        get: function () {
            return this.recognitionMode !== RecognitionMode.Interactive;
        },
        enumerable: true,
        configurable: true
    });
    return RecognizerConfig;
}());
exports.RecognizerConfig = RecognizerConfig;
// tslint:disable-next-line:max-classes-per-file
var SpeechConfig = /** @class */ (function () {
    function SpeechConfig(context) {
        var _this = this;
        this.Serialize = function () {
            return JSON.stringify(_this, function (key, value) {
                if (value && typeof value === "object") {
                    var replacement = {};
                    for (var k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            replacement[k && k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                        }
                    }
                    return replacement;
                }
                return value;
            });
        };
        this.context = context;
    }
    Object.defineProperty(SpeechConfig.prototype, "Context", {
        get: function () {
            return this.context;
        },
        enumerable: true,
        configurable: true
    });
    return SpeechConfig;
}());
exports.SpeechConfig = SpeechConfig;
// tslint:disable-next-line:max-classes-per-file
var Context = /** @class */ (function () {
    function Context(os, device) {
        this.system = new System();
        this.os = os;
        this.device = device;
    }
    Object.defineProperty(Context.prototype, "System", {
        get: function () {
            return this.system;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "OS", {
        get: function () {
            return this.os;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "Device", {
        get: function () {
            return this.device;
        },
        enumerable: true,
        configurable: true
    });
    return Context;
}());
exports.Context = Context;
// tslint:disable-next-line:max-classes-per-file
var System = /** @class */ (function () {
    function System() {
        // TODO: Tie this with the sdk Version somehow
        this.version = "1.0.00000";
    }
    Object.defineProperty(System.prototype, "Version", {
        get: function () {
            // Controlled by sdk
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    return System;
}());
exports.System = System;
// tslint:disable-next-line:max-classes-per-file
var OS = /** @class */ (function () {
    function OS(platform, name, version) {
        this.platform = platform;
        this.name = name;
        this.version = version;
    }
    Object.defineProperty(OS.prototype, "Platform", {
        get: function () {
            return this.platform;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OS.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OS.prototype, "Version", {
        get: function () {
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    return OS;
}());
exports.OS = OS;
// tslint:disable-next-line:max-classes-per-file
var Device = /** @class */ (function () {
    function Device(manufacturer, model, version) {
        this.manufacturer = manufacturer;
        this.model = model;
        this.version = version;
    }
    Object.defineProperty(Device.prototype, "Manufacturer", {
        get: function () {
            return this.manufacturer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "Model", {
        get: function () {
            return this.model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "Version", {
        get: function () {
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    return Device;
}());
exports.Device = Device;

//# sourceMappingURL=RecognizerConfig.js.map
