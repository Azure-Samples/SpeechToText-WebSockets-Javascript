"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var PcmRecorder = /** @class */ (function () {
    function PcmRecorder() {
        var _this = this;
        this.Record = function (context, mediaStream, outputStream) {
            var desiredSampleRate = 16000;
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
            var scriptNode = (function () {
                var bufferSize = 0;
                try {
                    return context.createScriptProcessor(bufferSize, 1, 1);
                }
                catch (error) {
                    // Webkit (<= version 31) requires a valid bufferSize.
                    bufferSize = 2048;
                    var audioSampleRate = context.sampleRate;
                    while (bufferSize < 16384 && audioSampleRate >= (2 * desiredSampleRate)) {
                        bufferSize <<= 1;
                        audioSampleRate >>= 1;
                    }
                    return context.createScriptProcessor(bufferSize, 1, 1);
                }
            })();
            var waveStreamEncoder = new Exports_1.RiffPcmEncoder(context.sampleRate, desiredSampleRate);
            var needHeader = true;
            var that = _this;
            scriptNode.onaudioprocess = function (event) {
                var inputFrame = event.inputBuffer.getChannelData(0);
                if (outputStream && !outputStream.IsClosed) {
                    var waveFrame = waveStreamEncoder.Encode(needHeader, inputFrame);
                    if (!!waveFrame) {
                        outputStream.Write(waveFrame);
                        needHeader = false;
                    }
                }
            };
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
            var micInput = context.createMediaStreamSource(mediaStream);
            _this.mediaResources = {
                scriptProcessorNode: scriptNode,
                source: micInput,
                stream: mediaStream,
            };
            micInput.connect(scriptNode);
            scriptNode.connect(context.destination);
        };
        this.ReleaseMediaResources = function (context) {
            if (_this.mediaResources) {
                if (_this.mediaResources.scriptProcessorNode) {
                    _this.mediaResources.scriptProcessorNode.disconnect(context.destination);
                    _this.mediaResources.scriptProcessorNode = null;
                }
                if (_this.mediaResources.source) {
                    _this.mediaResources.source.disconnect();
                    _this.mediaResources.stream.getTracks().forEach(function (track) { return track.stop(); });
                    _this.mediaResources.source = null;
                }
            }
        };
    }
    return PcmRecorder;
}());
exports.PcmRecorder = PcmRecorder;

//# sourceMappingURL=PCMRecorder.js.map
