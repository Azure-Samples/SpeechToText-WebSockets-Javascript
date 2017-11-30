import { AudioSourceErrorEvent, AudioSourceInitializingEvent, AudioSourceOffEvent, AudioSourceReadyEvent, AudioStreamNodeAttachedEvent, AudioStreamNodeAttachingEvent, AudioStreamNodeDetachedEvent, AudioStreamNodeErrorEvent, CreateNoDashGuid, Deferred, Events, EventSource, PromiseHelper, Stream, } from "../common/Exports";
export class MicAudioSource {
    constructor(recorder, audioSourceId) {
        this.streams = {};
        this.TurnOn = () => {
            if (this.initializeDeferral) {
                return this.initializeDeferral.Promise();
            }
            this.initializeDeferral = new Deferred();
            this.CreateAudioContext();
            const nav = window.navigator;
            let getUserMedia = (nav.getUserMedia ||
                nav.webkitGetUserMedia ||
                nav.mozGetUserMedia ||
                nav.msGetUserMedia);
            if (!!nav.mediaDevices) {
                getUserMedia = (constraints, successCallback, errorCallback) => {
                    nav.mediaDevices
                        .getUserMedia(constraints)
                        .then(successCallback)
                        .catch(errorCallback);
                };
            }
            if (!getUserMedia) {
                const errorMsg = "Browser does not support getUserMedia.";
                this.initializeDeferral.Reject(errorMsg);
                this.OnEvent(new AudioSourceErrorEvent(errorMsg, ""));
            }
            else {
                const next = () => {
                    this.OnEvent(new AudioSourceInitializingEvent(this.id));
                    getUserMedia({ audio: true, video: false }, (mediaStream) => {
                        this.mediaStream = mediaStream;
                        this.OnEvent(new AudioSourceReadyEvent(this.id));
                        this.initializeDeferral.Resolve(true);
                    }, (error) => {
                        const errorMsg = `Error occurred during microphone initialization: ${error}`;
                        const tmp = this.initializeDeferral;
                        this.initializeDeferral = null;
                        tmp.Reject(errorMsg);
                        this.OnEvent(new AudioSourceErrorEvent(this.id, errorMsg));
                    });
                };
                if (this.context.state === "suspended") {
                    this.context.resume().then(next, (reason) => {
                        this.initializeDeferral.Reject(`Failed to initialize audio context: ${reason}`);
                    });
                }
                else {
                    next();
                }
            }
            return this.initializeDeferral.Promise();
        };
        this.Id = () => {
            return this.id;
        };
        this.Attach = (audioNodeId) => {
            this.OnEvent(new AudioStreamNodeAttachingEvent(this.id, audioNodeId));
            return this.Listen(audioNodeId).OnSuccessContinueWith((streamReader) => {
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
        };
        this.Detach = (audioNodeId) => {
            if (audioNodeId && this.streams[audioNodeId]) {
                this.streams[audioNodeId].Close();
                delete this.streams[audioNodeId];
                this.OnEvent(new AudioStreamNodeDetachedEvent(this.id, audioNodeId));
            }
        };
        this.TurnOff = () => {
            for (const streamId in this.streams) {
                if (streamId) {
                    const stream = this.streams[streamId];
                    if (stream) {
                        stream.Close();
                    }
                }
            }
            this.OnEvent(new AudioSourceOffEvent(this.id));
            this.initializeDeferral = null;
            this.DestroyAudioContext();
            return PromiseHelper.FromResult(true);
        };
        this.Listen = (audioNodeId) => {
            return this.TurnOn()
                .OnSuccessContinueWith((_) => {
                const stream = new Stream(audioNodeId);
                this.streams[audioNodeId] = stream;
                try {
                    this.recorder.Record(this.context, this.mediaStream, stream);
                }
                catch (error) {
                    this.OnEvent(new AudioStreamNodeErrorEvent(this.id, audioNodeId, error));
                    throw error;
                }
                return stream.GetReader();
            });
        };
        this.OnEvent = (event) => {
            this.events.OnEvent(event);
            Events.Instance.OnEvent(event);
        };
        this.CreateAudioContext = () => {
            if (!!this.context) {
                return;
            }
            const AudioContext = (window.AudioContext)
                || (window.webkitAudioContext)
                || false;
            if (!AudioContext) {
                throw new Error("Browser does not support Web Audio API (AudioContext is not available).");
            }
            this.context = new AudioContext();
        };
        this.DestroyAudioContext = () => {
            if (!this.context) {
                return;
            }
            this.recorder.ReleaseMediaResources(this.context);
            if ("close" in this.context) {
                this.context.close();
                this.context = null;
            }
            else if (this.context.state === "running") {
                this.context.suspend();
            }
        };
        this.id = audioSourceId ? audioSourceId : CreateNoDashGuid();
        this.events = new EventSource();
        this.recorder = recorder;
    }
    get Events() {
        return this.events;
    }
}

//# sourceMappingURL=MicAudioSource.js.map
