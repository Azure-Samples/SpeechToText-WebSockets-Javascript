import { AudioSourceErrorEvent, AudioSourceInitializingEvent, AudioSourceOffEvent, AudioSourceReadyEvent, AudioStreamNodeAttachedEvent, AudioStreamNodeAttachingEvent, AudioStreamNodeDetachedEvent, AudioStreamNodeErrorEvent, CreateNoDashGuid, Events, EventSource, PromiseHelper, Stream, } from "../common/Exports";
import { Timer } from "../common.browser/Exports";
export class FileAudioSource {
    constructor(file, audioSourceId) {
        this.streams = {};
        this.TurnOn = () => {
            if (typeof FileReader === "undefined") {
                const errorMsg = "Browser does not support FileReader.";
                this.OnEvent(new AudioSourceErrorEvent(errorMsg, ""));
                return PromiseHelper.FromError(errorMsg);
            }
            else if (this.file.name.lastIndexOf(".wav") !== this.file.name.length - 4) {
                const errorMsg = this.file.name + " is not supported. Only WAVE files are allowed at the moment.";
                this.OnEvent(new AudioSourceErrorEvent(errorMsg, ""));
                return PromiseHelper.FromError(errorMsg);
            }
            else if (this.file.size > FileAudioSource.MAX_SIZE) {
                const errorMsg = this.file.name + " exceeds the maximum allowed file size (" + FileAudioSource.MAX_SIZE + ").";
                this.OnEvent(new AudioSourceErrorEvent(errorMsg, ""));
                return PromiseHelper.FromError(errorMsg);
            }
            this.OnEvent(new AudioSourceInitializingEvent(this.id));
            this.OnEvent(new AudioSourceReadyEvent(this.id));
            return PromiseHelper.FromResult(true);
        };
        this.Id = () => {
            return this.id;
        };
        this.Attach = (audioNodeId) => {
            this.OnEvent(new AudioStreamNodeAttachingEvent(this.id, audioNodeId));
            return this.Upload(audioNodeId).OnSuccessContinueWith((streamReader) => {
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
                    if (stream && !stream.IsClosed) {
                        stream.Close();
                    }
                }
            }
            this.OnEvent(new AudioSourceOffEvent(this.id));
            return PromiseHelper.FromResult(true);
        };
        this.Upload = (audioNodeId) => {
            return this.TurnOn()
                .OnSuccessContinueWith((_) => {
                const stream = new Stream(audioNodeId);
                this.streams[audioNodeId] = stream;
                const reader = new FileReader();
                let startOffset = 0;
                let endOffset = FileAudioSource.CHUNK_SIZE;
                let lastWriteTimestamp = 0;
                const processNextChunk = (event) => {
                    if (stream.IsClosed) {
                        return;
                    }
                    if (lastWriteTimestamp !== 0) {
                        const delay = Date.now() - lastWriteTimestamp;
                        if (delay < FileAudioSource.UPLOAD_INTERVAL) {
                            new Timer(FileAudioSource.UPLOAD_INTERVAL - delay, processNextChunk).start();
                            return;
                        }
                    }
                    stream.Write(reader.result);
                    lastWriteTimestamp = Date.now();
                    if (endOffset < this.file.size) {
                        startOffset = endOffset;
                        endOffset = Math.min(endOffset + FileAudioSource.CHUNK_SIZE, this.file.size);
                        const chunk = this.file.slice(startOffset, endOffset);
                        reader.readAsArrayBuffer(chunk);
                    }
                    else {
                        stream.Close();
                    }
                };
                reader.onload = processNextChunk;
                reader.onerror = (event) => {
                    const errorMsg = `Error occurred while processing '${this.file.name}'. ${event.error}`;
                    this.OnEvent(new AudioStreamNodeErrorEvent(this.id, audioNodeId, event.error));
                    throw new Error(errorMsg);
                };
                const chunk = this.file.slice(startOffset, endOffset);
                reader.readAsArrayBuffer(chunk);
                return stream.GetReader();
            });
        };
        this.OnEvent = (event) => {
            this.events.OnEvent(event);
            Events.Instance.OnEvent(event);
        };
        this.id = audioSourceId ? audioSourceId : CreateNoDashGuid();
        this.events = new EventSource();
        this.file = file;
    }
    get Events() {
        return this.events;
    }
}
FileAudioSource.SAMPLE_RATE = 16000 * 2;
FileAudioSource.CHUNK_SIZE = FileAudioSource.SAMPLE_RATE * 2 / 5;
FileAudioSource.UPLOAD_INTERVAL = 200;
FileAudioSource.MAX_SIZE = FileAudioSource.SAMPLE_RATE * 600 + 44;

//# sourceMappingURL=FileAudioSource.js.map
