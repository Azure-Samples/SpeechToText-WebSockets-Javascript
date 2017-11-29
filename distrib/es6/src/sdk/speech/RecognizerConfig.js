export var RecognitionMode;
(function (RecognitionMode) {
    RecognitionMode[RecognitionMode["Interactive"] = 0] = "Interactive";
    RecognitionMode[RecognitionMode["Conversation"] = 1] = "Conversation";
    RecognitionMode[RecognitionMode["Dictation"] = 2] = "Dictation";
})(RecognitionMode || (RecognitionMode = {}));
export var SpeechResultFormat;
(function (SpeechResultFormat) {
    SpeechResultFormat[SpeechResultFormat["Simple"] = 0] = "Simple";
    SpeechResultFormat[SpeechResultFormat["Detailed"] = 1] = "Detailed";
})(SpeechResultFormat || (SpeechResultFormat = {}));
export class RecognizerConfig {
    constructor(platformConfig, recognitionMode = RecognitionMode.Interactive, language = "en-us", format = SpeechResultFormat.Simple) {
        this.recognitionMode = RecognitionMode.Interactive;
        this.speechConfig = platformConfig ? platformConfig : new SpeechConfig(new Context(null, null));
        this.recognitionMode = recognitionMode;
        this.language = language;
        this.format = format;
        this.recognitionActivityTimeout = recognitionMode === RecognitionMode.Interactive ? 8000 : 25000;
    }
    get RecognitionMode() {
        return this.recognitionMode;
    }
    get Language() {
        return this.language;
    }
    get Format() {
        return this.format;
    }
    get SpeechConfig() {
        return this.speechConfig;
    }
    get RecognitionActivityTimeout() {
        return this.recognitionActivityTimeout;
    }
    get IsContinuousRecognition() {
        return this.recognitionMode !== RecognitionMode.Interactive;
    }
}
export class SpeechConfig {
    constructor(context) {
        this.Serialize = () => {
            return JSON.stringify(this, (key, value) => {
                if (value && typeof value === "object") {
                    const replacement = {};
                    for (const k in value) {
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
    get Context() {
        return this.context;
    }
}
export class Context {
    constructor(os, device) {
        this.system = new System();
        this.os = os;
        this.device = device;
    }
    get System() {
        return this.system;
    }
    get OS() {
        return this.os;
    }
    get Device() {
        return this.device;
    }
}
export class System {
    constructor() {
        this.version = "1.0.00000";
    }
    get Version() {
        return this.version;
    }
}
export class OS {
    constructor(platform, name, version) {
        this.platform = platform;
        this.name = name;
        this.version = version;
    }
    get Platform() {
        return this.platform;
    }
    get Name() {
        return this.name;
    }
    get Version() {
        return this.version;
    }
}
export class Device {
    constructor(manufacturer, model, version) {
        this.manufacturer = manufacturer;
        this.model = model;
        this.version = version;
    }
    get Manufacturer() {
        return this.manufacturer;
    }
    get Model() {
        return this.model;
    }
    get Version() {
        return this.version;
    }
}

//# sourceMappingURL=RecognizerConfig.js.map
