import { EventType, PlatformEvent } from "./PlatformEvent";

export class AudioSourceEvent extends PlatformEvent {
    private audioSourceId: string;

    constructor(audioSourceId: string, eventType: EventType = EventType.Info) {
        super(eventType);
        this.audioSourceId = audioSourceId;
    }

    public get AudioSourceId(): string {
        return this.audioSourceId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioSourceInitializingEvent extends AudioSourceEvent {
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioSourceReadyEvent extends AudioSourceEvent {
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioSourceOffEvent extends AudioSourceEvent {
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioSourceErrorEvent extends AudioSourceEvent {
    private error: string;
    constructor(audioSourceId: string, error: string) {
        super(audioSourceId, EventType.Error);
        this.error = error;
    }

    public get Error(): string {
        return this.error;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeEvent extends AudioSourceEvent {
    private audioNodeId: string;

    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId);
        this.audioNodeId = audioNodeId;
    }

    public get AudioNodeId(): string {
        return this.audioNodeId;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
    private error: string;

    constructor(audioSourceId: string, audioNodeId: string, error: string) {
        super(audioSourceId, audioNodeId);
        this.error = error;
    }

    public get Error(): string {
        return this.error;
    }
}
