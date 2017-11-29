import { EventType, PlatformEvent } from "./PlatformEvent";
export class AudioSourceEvent extends PlatformEvent {
    constructor(eventName, audioSourceId, eventType = EventType.Info) {
        super(eventName, eventType);
        this.audioSourceId = audioSourceId;
    }
    get AudioSourceId() {
        return this.audioSourceId;
    }
}
export class AudioSourceInitializingEvent extends AudioSourceEvent {
    constructor(audioSourceId) {
        super("AudioSourceInitializingEvent", audioSourceId);
    }
}
export class AudioSourceReadyEvent extends AudioSourceEvent {
    constructor(audioSourceId) {
        super("AudioSourceReadyEvent", audioSourceId);
    }
}
export class AudioSourceOffEvent extends AudioSourceEvent {
    constructor(audioSourceId) {
        super("AudioSourceOffEvent", audioSourceId);
    }
}
export class AudioSourceErrorEvent extends AudioSourceEvent {
    constructor(audioSourceId, error) {
        super("AudioSourceErrorEvent", audioSourceId, EventType.Error);
        this.error = error;
    }
    get Error() {
        return this.error;
    }
}
export class AudioStreamNodeEvent extends AudioSourceEvent {
    constructor(eventName, audioSourceId, audioNodeId) {
        super(eventName, audioSourceId);
        this.audioNodeId = audioNodeId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
}
export class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId, audioNodeId) {
        super("AudioStreamNodeAttachingEvent", audioSourceId, audioNodeId);
    }
}
export class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId, audioNodeId) {
        super("AudioStreamNodeAttachedEvent", audioSourceId, audioNodeId);
    }
}
export class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId, audioNodeId) {
        super("AudioStreamNodeDetachedEvent", audioSourceId, audioNodeId);
    }
}
export class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId, audioNodeId, error) {
        super("AudioStreamNodeErrorEvent", audioSourceId, audioNodeId);
        this.error = error;
    }
    get Error() {
        return this.error;
    }
}

//# sourceMappingURL=AudioSourceEvents.js.map
