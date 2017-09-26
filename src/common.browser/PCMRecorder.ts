import { RiffPcmEncoder, Stream } from "../common/Exports";
import { IRecorder } from "./IRecorder";

export class PcmRecorder implements IRecorder {
    private mediaResources: IMediaResources;
    public Record = (mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void => {
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
        const contextCtor = ((window as any).AudioContext)
            || ((window as any).webkitAudioContext)
            || false;

        if (!contextCtor) {
            throw new Error("Browser does not support Web Audio API (AudioContext is not available).");
        }

        const audioContext = new contextCtor();

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
        const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);

        const desiredSampleRate = 16000;
        // let compressionRatio = mediaStreamSource.context.sampleRate / desiredSampleRate;
        let bufferSize = 2048;
        let isFirstFrameWritten: boolean = false;
        if (desiredSampleRate * 4 <= mediaStreamSource.context.sampleRate) {
            bufferSize = 8192;
        } else if (desiredSampleRate * 2 <= mediaStreamSource.context.sampleRate) {
            bufferSize = 4096;
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
        const scriptNode = mediaStreamSource.context.createScriptProcessor(bufferSize, 1, 1);
        const waveStreamEncoder = new RiffPcmEncoder(mediaStreamSource.context.sampleRate, desiredSampleRate);

        scriptNode.onaudioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
            const monoAudioChunk = audioProcessingEvent.inputBuffer.getChannelData(0);

            let encodedAudioFrameWithRiffHeader: ArrayBuffer;
            let encodedAudioFrame: ArrayBuffer;
            if (outputStream) {
                if (isFirstFrameWritten) {
                    if (!encodedAudioFrame) {
                        encodedAudioFrame = waveStreamEncoder.Encode(false, monoAudioChunk);
                    }

                    outputStream.Write(encodedAudioFrame);
                } else {
                    if (!encodedAudioFrameWithRiffHeader) {
                        encodedAudioFrameWithRiffHeader =
                            waveStreamEncoder.Encode(true, monoAudioChunk);
                    }

                    outputStream.Write(encodedAudioFrameWithRiffHeader);
                    isFirstFrameWritten = true;
                }
            }
        };

        this.mediaResources = {
            context: audioContext,
            scriptProcessorNode: scriptNode,
            source: mediaStreamSource,
            stream: mediaStream,
        };

        mediaStreamSource.connect(scriptNode);
        scriptNode.connect(mediaStreamSource.context.destination);
    }

    public ReleaseMediaResources = (): void => {
        if (this.mediaResources) {
            if (this.mediaResources.scriptProcessorNode) {
                this.mediaResources.scriptProcessorNode.disconnect();
                this.mediaResources.scriptProcessorNode = null;
            }
            if (this.mediaResources.source) {
                this.mediaResources.source.disconnect();
                this.mediaResources.stream.getTracks().forEach((track: any) => track.stop());
                this.mediaResources.source = null;
            }
            if (this.mediaResources.context && this.mediaResources.context.state !== "closed") {
                this.mediaResources.context.close();
            }
        }
    }
}

interface IMediaResources {
    context: AudioContext;
    source: MediaStreamAudioSourceNode;
    scriptProcessorNode: ScriptProcessorNode;
    stream: MediaStream;
}
