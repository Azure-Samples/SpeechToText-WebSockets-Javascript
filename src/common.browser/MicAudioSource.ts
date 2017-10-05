import {
    AudioSourceErrorEvent,
    AudioSourceEvent,
    AudioSourceInitializingEvent,
    AudioSourceOffEvent,
    AudioSourceReadyEvent,
    AudioStreamNodeAttachedEvent,
    AudioStreamNodeAttachingEvent,
    AudioStreamNodeDetachedEvent,
    AudioStreamNodeErrorEvent,
    CreateNoDashGuid,
    Deferred,
    Events,
    EventSource,
    IAudioSource,
    IAudioStreamNode,
    IStringDictionary,
    PlatformEvent,
    Promise,
    PromiseHelper,
    Stream,
    StreamReader,
} from "../common/Exports";
import { IRecorder } from "./IRecorder";

// Extending the default definition with browser specific definitions for backward compatibility
interface INavigatorUserMedia extends NavigatorUserMedia {
    webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback) => void;
    mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback) => void;
    msGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback) => void;
}

export class MicAudioSource implements IAudioSource {

    private streams: IStringDictionary<Stream<ArrayBuffer>> = {};

    private id: string;

    private events: EventSource<AudioSourceEvent>;

    private initializeDeferral: Deferred<boolean>;

    private recorder: IRecorder;

    private mediaStream: MediaStream;

    public constructor(recorder: IRecorder, audioSourceId?: string) {
        this.id = audioSourceId ? audioSourceId : CreateNoDashGuid();
        this.events = new EventSource<AudioSourceEvent>();
        this.recorder = recorder;
    }

    public TurnOn = (): Promise<boolean> => {
        if (this.initializeDeferral) {
            return this.initializeDeferral.Promise();
        }

        this.initializeDeferral = new Deferred<boolean>();

        const nav = window.navigator as INavigatorUserMedia;
        window.navigator.getUserMedia = (
            window.navigator.getUserMedia ||
            (window.navigator as INavigatorUserMedia).webkitGetUserMedia ||
            (window.navigator as INavigatorUserMedia).mozGetUserMedia ||
            (window.navigator as INavigatorUserMedia).msGetUserMedia
        );

        if (!window.navigator.getUserMedia) {
            const errorMsg = "Browser does not support getUserMedia.";
            this.initializeDeferral.Reject(errorMsg);
            this.OnEvent(new AudioSourceErrorEvent(errorMsg, "")); // mic initialized error - no streamid at this point
        } else {
            this.OnEvent(new AudioSourceInitializingEvent(this.id)); // no stream id
            window.navigator.getUserMedia(
                { audio: true },
                (mediaStream: MediaStream) => {
                    this.mediaStream = mediaStream;
                    this.OnEvent(new AudioSourceReadyEvent(this.id));
                    this.initializeDeferral.Resolve(true);

                }, (error: MediaStreamError) => {
                    const errorMsg = `Error occured processing the user media stream. ${error}`;
                    this.initializeDeferral.Reject(errorMsg);
                    this.OnEvent(new AudioSourceErrorEvent(this.id, errorMsg));
                });
        }

        return this.initializeDeferral.Promise();
    }

    public Id = (): string => {
        return this.id;
    }

    public Attach = (audioNodeId: string): Promise<IAudioStreamNode> => {
        this.OnEvent(new AudioStreamNodeAttachingEvent(this.id, audioNodeId));

        return this.Listen(audioNodeId).OnSuccessContinueWith<IAudioStreamNode>(
            (streamReader: StreamReader<ArrayBuffer>) => {
                this.OnEvent(new AudioStreamNodeAttachedEvent(this.id, audioNodeId));
                return {
                    Detach: () => {
                        streamReader.Close();
                        delete this.streams[audioNodeId];
                        this.OnEvent(new AudioStreamNodeDetachedEvent(this.id, audioNodeId));
                        this.TurnOff();
                    },
                    Id: () => {
                        return audioNodeId;
                    },
                    Read: () => {
                        return streamReader.Read();
                    },
                };
            });
    }

    public Detach = (audioNodeId: string): void => {
        if (audioNodeId && this.streams[audioNodeId]) {
            this.streams[audioNodeId].Close();
            delete this.streams[audioNodeId];
            this.OnEvent(new AudioStreamNodeDetachedEvent(this.id, audioNodeId));
        }
    }

    public TurnOff = (): Promise<boolean> => {
        for (const streamId in this.streams) {
            if (streamId) {
                const stream = this.streams[streamId];
                if (stream) {
                    stream.Close();
                }
            }
        }

        this.recorder.ReleaseMediaResources();

        this.OnEvent(new AudioSourceOffEvent(this.id)); // no stream now
        this.initializeDeferral = null;
        return PromiseHelper.FromResult(true);
    }

    public get Events(): EventSource<AudioSourceEvent> {
        return this.events;
    }

    private Listen = (audioNodeId: string): Promise<StreamReader<ArrayBuffer>> => {
        return this.TurnOn()
            .OnSuccessContinueWith<StreamReader<ArrayBuffer>>((_: boolean) => {
                const stream = new Stream<ArrayBuffer>(audioNodeId);
                this.streams[audioNodeId] = stream;

                try {
                    this.recorder.Record(this.mediaStream, stream);
                } catch (error) {
                    this.OnEvent(new AudioStreamNodeErrorEvent(this.id, audioNodeId, error));
                    throw error;
                }

                return stream.GetReader();
            });
    }

    private OnEvent = (event: AudioSourceEvent): void => {
        this.events.OnEvent(event);
        Events.Instance.OnEvent(event);
    }
}
