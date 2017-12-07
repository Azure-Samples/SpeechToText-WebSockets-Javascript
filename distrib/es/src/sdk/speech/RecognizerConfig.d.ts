export declare enum RecognitionMode {
    Interactive = 0,
    Conversation = 1,
    Dictation = 2,
}
export declare enum SpeechResultFormat {
    Simple = 0,
    Detailed = 1,
}
export declare class RecognizerConfig {
    private recognitionMode;
    private language;
    private format;
    private speechConfig;
    private recognitionActivityTimeout;
    constructor(platformConfig: SpeechConfig, recognitionMode?: RecognitionMode, language?: string, format?: SpeechResultFormat);
    readonly RecognitionMode: RecognitionMode;
    readonly Language: string;
    readonly Format: SpeechResultFormat;
    readonly SpeechConfig: SpeechConfig;
    readonly RecognitionActivityTimeout: number;
    readonly IsContinuousRecognition: boolean;
}
export declare class SpeechConfig {
    private context;
    constructor(context: Context);
    Serialize: () => string;
    readonly Context: Context;
}
export declare class Context {
    private system;
    private os;
    private device;
    constructor(os: OS, device: Device);
    readonly System: System;
    readonly OS: OS;
    readonly Device: Device;
}
export declare class System {
    private version;
    constructor();
    readonly Version: string;
}
export declare class OS {
    private platform;
    private name;
    private version;
    constructor(platform: string, name: string, version: string);
    readonly Platform: string;
    readonly Name: string;
    readonly Version: string;
}
export declare class Device {
    private manufacturer;
    private model;
    private version;
    constructor(manufacturer: string, model: string, version: string);
    readonly Manufacturer: string;
    readonly Model: string;
    readonly Version: string;
}
