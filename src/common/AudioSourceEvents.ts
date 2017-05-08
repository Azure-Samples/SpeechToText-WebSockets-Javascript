import { ArgumentNullError } from "./Error";
import { EventType, PlatformEvent } from "./PlatformEvent";

/**
 * Base event class for all AudioSource events
 *
 * @export
 * @class AudioSourceEvent
 * @extends {PlatformEvent}
 */
export class AudioSourceEvent extends PlatformEvent {
    private audioSourceId: string;

    /**
     * Creates an instance of AudioSourceEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {EventType} [eventType=EventType.Info] The type of event.
     *
     * @memberof AudioSourceEvent
     */
    constructor(audioSourceId: string, eventType: EventType = EventType.Info) {
        if (!audioSourceId) {
            throw new ArgumentNullError("audioSourceId");
        }

        super(eventType);
        this.audioSourceId = audioSourceId;
    }

    /**
     * Unique id specific to an AudioSource instance.
     *
     * @readonly
     * @type {string}
     * @memberof AudioSourceEvent
     */
    public get AudioSourceId(): string {
        return this.audioSourceId;
    }
}

/**
 * Event emitted just prior to AudioSource initialization.
 *
 * @export
 * @class AudioSourceInitializingEvent
 * @extends {AudioSourceEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioSourceInitializingEvent extends AudioSourceEvent {
    /**
     * Creates an instance of AudioSourceInitializingEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     *
     * @memberof AudioSourceInitializingEvent
     */
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

/**
 * Event emitted when the AudioSource is ready to be read.
 *
 * @export
 * @class AudioSourceReadyEvent
 * @extends {AudioSourceEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioSourceReadyEvent extends AudioSourceEvent {
    /**
     * Creates an instance of AudioSourceReadyEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     *
     * @memberof AudioSourceReadyEvent
     */
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

/**
 * Event emitted when AudioSource is turned off.
 *
 * @export
 * @class AudioSourceOffEvent
 * @extends {AudioSourceEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioSourceOffEvent extends AudioSourceEvent {
    /**
     * Creates an instance of AudioSourceOffEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     *
     * @memberof AudioSourceOffEvent
     */
    constructor(audioSourceId: string) {
        super(audioSourceId);
    }
}

/**
 * Event emitted when an error is caught during initilizing AudioSource or while reading from it.
 *
 * @export
 * @class AudioSourceErrorEvent
 * @extends {AudioSourceEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioSourceErrorEvent extends AudioSourceEvent {
    private error: string;
    /**
     * Creates an instance of AudioSourceErrorEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} error The error caught during initilizing AudioSource or while reading from it.
     *
     * @memberof AudioSourceErrorEvent
     */
    constructor(audioSourceId: string, error: string) {
        super(audioSourceId, EventType.Error);
        this.error = error;
    }

    /**
     * The error caught during initilizing AudioSource or while reading from it.
     *
     * @readonly
     * @type {string}
     * @memberof AudioSourceErrorEvent
     */
    public get Error(): string {
        return this.error;
    }
}

/**
 * Base event class for all AudioStreamNode events
 *
 * @export
 * @class AudioStreamNodeEvent
 * @extends {AudioSourceEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeEvent extends AudioSourceEvent {
    private audioNodeId: string;

    /**
     * Creates an instance of AudioStreamNodeEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} audioNodeId Unique id specific to the AudioNode instance under use.
     *
     * @memberof AudioStreamNodeEvent
     */
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId);

        if (!audioNodeId) {
            throw new ArgumentNullError("audioNodeId");
        }

        this.audioNodeId = audioNodeId;
    }

    /**
     * Unique id specific to an AudioNode instance.
     *
     * @readonly
     * @type {string}
     * @memberof AudioStreamNodeEvent
     */
    public get AudioNodeId(): string {
        return this.audioNodeId;
    }
}

/**
 * Event emitted prior to attaching an AudioStreamNode to the AudioSource
 *
 * @export
 * @class AudioStreamNodeAttachingEvent
 * @extends {AudioStreamNodeEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
    /**
     * Creates an instance of AudioStreamNodeAttachingEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} audioNodeId Unique id specific to the AudioNode instance under use.
     *
     * @memberof AudioStreamNodeAttachingEvent
     */
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

/**
 * Event emitted once AudioStreamNode is attached successfully to the AudioSource.
 *
 * @export
 * @class AudioStreamNodeAttachedEvent
 * @extends {AudioStreamNodeEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
    /**
     * Creates an instance of AudioStreamNodeAttachedEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} audioNodeId Unique id specific to the AudioNode instance under use.
     *
     * @memberof AudioStreamNodeAttachedEvent
     */
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

/**
 * Event emitted once AudioStreamNode is detached successfully from the AudioSource.
 *
 * @export
 * @class AudioStreamNodeDetachedEvent
 * @extends {AudioStreamNodeEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
    /**
     * Creates an instance of AudioStreamNodeDetachedEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} audioNodeId Unique id specific to the AudioNode instance under use.
     *
     * @memberof AudioStreamNodeDetachedEvent
     */
    constructor(audioSourceId: string, audioNodeId: string) {
        super(audioSourceId, audioNodeId);
    }
}

/**
 * Event emitted when an error is caught while attaching an AudioStreamNode to an AudioSource or while reading from AudioSource.
 *
 * @export
 * @class AudioStreamNodeErrorEvent
 * @extends {AudioStreamNodeEvent}
 */
// tslint:disable-next-line:max-classes-per-file
export class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
    private error: string;

    /**
     * Creates an instance of AudioStreamNodeErrorEvent.
     * @param {string} audioSourceId Unique id specific to the AudioSource instance under use.
     * @param {string} audioNodeId Unique id specific to the AudioNode instance under use.
     * @param {string} error The error caught while attaching an AudioStreamNode to an AudioSource or while reading from AudioSource.
     *
     * @memberof AudioStreamNodeErrorEvent
     */
    constructor(audioSourceId: string, audioNodeId: string, error: string) {
        super(audioSourceId, audioNodeId);
        this.error = error;
    }

    /**
     * The error caught while attaching an AudioStreamNode to an AudioSource or while reading from AudioSource.
     *
     * @readonly
     * @type {string}
     * @memberof AudioStreamNodeErrorEvent
     */
    public get Error(): string {
        return this.error;
    }
}
