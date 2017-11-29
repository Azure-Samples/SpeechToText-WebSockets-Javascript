export class RiffPcmEncoder {
    constructor(actualSampleRate, desiredSampleRate) {
        this.channelCount = 1;
        this.Encode = (needHeader, actualAudioFrame) => {
            const audioFrame = this.DownSampleAudioFrame(actualAudioFrame, this.actualSampleRate, this.desiredSampleRate);
            if (!audioFrame) {
                return null;
            }
            const audioLength = audioFrame.length * 2;
            if (!needHeader) {
                const buffer = new ArrayBuffer(audioLength);
                const view = new DataView(buffer);
                this.FloatTo16BitPCM(view, 0, audioFrame);
                return buffer;
            }
            const buffer = new ArrayBuffer(44 + audioLength);
            const bitsPerSample = 16;
            const bytesPerSample = bitsPerSample / 8;
            const fileLength = 0;
            const view = new DataView(buffer);
            this.SetString(view, 0, "RIFF");
            view.setUint32(4, fileLength, true);
            this.SetString(view, 8, "WAVEfmt ");
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, this.channelCount, true);
            view.setUint32(24, this.desiredSampleRate, true);
            view.setUint32(28, this.desiredSampleRate * this.channelCount * bytesPerSample, true);
            view.setUint16(32, this.channelCount * bytesPerSample, true);
            view.setUint16(34, bitsPerSample, true);
            this.SetString(view, 36, "data");
            view.setUint32(40, fileLength, true);
            this.FloatTo16BitPCM(view, 44, audioFrame);
            return buffer;
        };
        this.SetString = (view, offset, str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        this.FloatTo16BitPCM = (view, offset, input) => {
            for (let i = 0; i < input.length; i++, offset += 2) {
                const s = Math.max(-1, Math.min(1, input[i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };
        this.DownSampleAudioFrame = (srcFrame, srcRate, dstRate) => {
            if (dstRate === srcRate || dstRate > srcRate) {
                return srcFrame;
            }
            const ratio = srcRate / dstRate;
            const dstLength = Math.round(srcFrame.length / ratio);
            const dstFrame = new Float32Array(dstLength);
            let srcOffset = 0;
            let dstOffset = 0;
            while (dstOffset < dstLength) {
                const nextSrcOffset = Math.round((dstOffset + 1) * ratio);
                let accum = 0;
                let count = 0;
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
}

//# sourceMappingURL=RiffPcmEncoder.js.map
