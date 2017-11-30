export declare class RiffPcmEncoder {
    private actualSampleRate;
    private desiredSampleRate;
    private channelCount;
    constructor(actualSampleRate: number, desiredSampleRate: number);
    Encode: (needHeader: boolean, actualAudioFrame: Float32Array) => ArrayBuffer;
    private SetString;
    private FloatTo16BitPCM;
    private DownSampleAudioFrame;
}
