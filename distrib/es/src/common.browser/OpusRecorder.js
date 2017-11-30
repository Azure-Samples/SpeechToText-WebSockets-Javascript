"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OpusRecorder = (function () {
    function OpusRecorder(options) {
        var _this = this;
        this.Record = function (context, mediaStream, outputStream) {
            var mediaRecorder = new MediaRecorder(mediaStream, _this.mediaRecorderOptions);
            var timeslice = 100;
            mediaRecorder.ondataavailable = function (dataAvailableEvent) {
                if (outputStream) {
                    var reader_1 = new FileReader();
                    reader_1.readAsArrayBuffer(dataAvailableEvent.data);
                    reader_1.onloadend = function (event) {
                        outputStream.Write(reader_1.result);
                    };
                }
            };
            _this.mediaResources = {
                recorder: mediaRecorder,
                stream: mediaStream,
            };
            mediaRecorder.start(timeslice);
        };
        this.ReleaseMediaResources = function (context) {
            if (_this.mediaResources.recorder.state !== "inactive") {
                _this.mediaResources.recorder.stop();
            }
            _this.mediaResources.stream.getTracks().forEach(function (track) { return track.stop(); });
        };
        this.mediaRecorderOptions = options;
    }
    return OpusRecorder;
}());
exports.OpusRecorder = OpusRecorder;

//# sourceMappingURL=OpusRecorder.js.map
