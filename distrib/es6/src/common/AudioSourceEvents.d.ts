import { EventType, PlatformEvent } from "./PlatformEvent";
export declare class AudioSourceEvent extends PlatformEvent {
    private audioSourceId;
    constructor(eventName: string, audioSourceId: string, eventType?: EventType);
    readonly AudioSourceId: string;
}
export declare class AudioSourceInitializingEvent extends AudioSourceEvent {
    constructor(audioSourceId: string);
}
export declare class AudioSourceReadyEvent extends AudioSourceEvent {
    constructor(audioSourceId: string);
}
export declare class AudioSourceOffEvent extends AudioSourceEvent {
    constructor(audioSourceId: string);
}
export declare class AudioSourceErrorEvent extends AudioSourceEvent {
    private error;
    constructor(audioSourceId: string, error: string);
    readonly Error: string;
}
export declare class AudioStreamNodeEvent extends AudioSourceEvent {
    private audioNodeId;
    constructor(eventName: string, audioSourceId: string, audioNodeId: string);
    readonly AudioNodeId: string;
}
export declare class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string);
}
export declare class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string);
}
export declare class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string);
}
export declare class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
    private error;
    constructor(audioSourceId: string, audioNodeId: string, error: string);
    readonly Error: string;
}
