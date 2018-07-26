"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RiffPcmEncoder = /** @class */ (function () {
    function RiffPcmEncoder(actualSampleRate, desiredSampleRate) {
        var _this = this;
        this.channelCount = 1;
        this.Encode = function (needHeader, actualAudioFrame) {
            var audioFrame = _this.DownSampleAudioFrame(actualAudioFrame, _this.actualSampleRate, _this.desiredSampleRate);
            if (!audioFrame) {
                return null;
            }
            var audioLength = audioFrame.length * 2;
            if (!needHeader) {
                var buffer_1 = new ArrayBuffer(audioLength);
                var view_1 = new DataView(buffer_1);
                _this.FloatTo16BitPCM(view_1, 0, audioFrame);
                return buffer_1;
            }
            var buffer = new ArrayBuffer(44 + audioLength);
            var bitsPerSample = 16;
            var bytesPerSample = bitsPerSample / 8;
            // We dont know ahead of time about the length of audio to stream. So set to 0.
            var fileLength = 0;
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
            var view = new DataView(buffer);
            /* RIFF identifier */
            _this.SetString(view, 0, "RIFF");
            /* file length */
            view.setUint32(4, fileLength, true);
            /* RIFF type & Format */
            _this.SetString(view, 8, "WAVEfmt ");
            /* format chunk length */
            view.setUint32(16, 16, true);
            /* sample format (raw) */
            view.setUint16(20, 1, true);
            /* channel count */
            view.setUint16(22, _this.channelCount, true);
            /* sample rate */
            view.setUint32(24, _this.desiredSampleRate, true);
            /* byte rate (sample rate * block align) */
            view.setUint32(28, _this.desiredSampleRate * _this.channelCount * bytesPerSample, true);
            /* block align (channel count * bytes per sample) */
            view.setUint16(32, _this.channelCount * bytesPerSample, true);
            /* bits per sample */
            view.setUint16(34, bitsPerSample, true);
            /* data chunk identifier */
            _this.SetString(view, 36, "data");
            /* data chunk length */
            view.setUint32(40, fileLength, true);
            _this.FloatTo16BitPCM(view, 44, audioFrame);
            return buffer;
        };
        this.SetString = function (view, offset, str) {
            for (var i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        this.FloatTo16BitPCM = function (view, offset, input) {
            for (var i = 0; i < input.length; i++, offset += 2) {
                var s = Math.max(-1, Math.min(1, input[i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };
        this.DownSampleAudioFrame = function (srcFrame, srcRate, dstRate) {
            if (dstRate === srcRate || dstRate > srcRate) {
                return srcFrame;
            }
            var ratio = srcRate / dstRate;
            var dstLength = Math.round(srcFrame.length / ratio);
            var dstFrame = new Float32Array(dstLength);
            var srcOffset = 0;
            var dstOffset = 0;
            while (dstOffset < dstLength) {
                var nextSrcOffset = Math.round((dstOffset + 1) * ratio);
                var accum = 0;
                var count = 0;
                while (srcOffset < nextSrcOffset && srcOffset < srcFrame.length) {
                    accum += srcFrame[srcOffset++];
                    count++;
                }
                dstFrame[dstOffset++] = accum / count;
            }
            return dstFrame;
        };
        this.actualSampleRate = actualSampleRate;
        this.desiredSampleRate = desiredSampleRate;
    }
    return RiffPcmEncoder;
}());
exports.RiffPcmEncoder = RiffPcmEncoder;

//# sourceMappingURL=RiffPcmEncoder.js.map
