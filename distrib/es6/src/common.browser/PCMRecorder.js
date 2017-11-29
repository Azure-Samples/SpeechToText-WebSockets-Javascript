import { RiffPcmEncoder } from "../common/Exports";
export class PcmRecorder {
    constructor() {
        this.Record = (context, mediaStream, outputStream) => {
            const desiredSampleRate = 16000;
            const scriptNode = (() => {
                let bufferSize = 0;
                try {
                    return context.createScriptProcessor(bufferSize, 1, 1);
                }
                catch (error) {
                    bufferSize = 2048;
                    let audioSampleRate = context.sampleRate;
                    while (bufferSize < 16384 && audioSampleRate >= (2 * desiredSampleRate)) {
                        bufferSize <<= 1;
                        audioSampleRate >>= 1;
                    }
                    return context.createScriptProcessor(bufferSize, 1, 1);
                }
            })();
            const waveStreamEncoder = new RiffPcmEncoder(context.sampleRate, desiredSampleRate);
            let needHeader = true;
            const that = this;
            scriptNode.onaudioprocess = (event) => {
                const inputFrame = event.inputBuffer.getChannelData(0);
                if (outputStream && !outputStream.IsClosed) {
                    const waveFrame = waveStreamEncoder.Encode(needHeader, inputFrame);
                    if (!!waveFrame) {
                        outputStream.Write(waveFrame);
                        needHeader = false;
                    }
                }
            };
            const micInput = context.createMediaStreamSource(mediaStream);
            this.mediaResources = {
                scriptProcessorNode: scriptNode,
                source: micInput,
                stream: mediaStream,
            };
            micInput.connect(scriptNode);
            scriptNode.connect(context.destination);
        };
        this.ReleaseMediaResources = (context) => {
            if (this.mediaResources) {
                if (this.mediaResources.scriptProcessorNode) {
                    this.mediaResources.scriptProcessorNode.disconnect(context.destination);
                    this.mediaResources.scriptProcessorNode = null;
                }
                if (this.mediaResources.source) {
                    this.mediaResources.source.disconnect();
                    this.mediaResources.stream.getTracks().forEach((track) => track.stop());
                    this.mediaResources.source = null;
                }
            }
        };
    }
}

//# sourceMappingURL=PCMRecorder.js.map
