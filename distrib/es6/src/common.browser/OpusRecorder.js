export class OpusRecorder {
    constructor(options) {
        this.Record = (context, mediaStream, outputStream) => {
            const mediaRecorder = new MediaRecorder(mediaStream, this.mediaRecorderOptions);
            const timeslice = 100;
            mediaRecorder.ondataavailable = (dataAvailableEvent) => {
                if (outputStream) {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(dataAvailableEvent.data);
                    reader.onloadend = (event) => {
                        outputStream.Write(reader.result);
                    };
                }
            };
            this.mediaResources = {
                recorder: mediaRecorder,
                stream: mediaStream,
            };
            mediaRecorder.start(timeslice);
        };
        this.ReleaseMediaResources = (context) => {
            if (this.mediaResources.recorder.state !== "inactive") {
                this.mediaResources.recorder.stop();
            }
            this.mediaResources.stream.getTracks().forEach((track) => track.stop());
        };
        this.mediaRecorderOptions = options;
    }
}

//# sourceMappingURL=OpusRecorder.js.map
