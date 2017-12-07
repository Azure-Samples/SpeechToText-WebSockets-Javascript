import { Stream } from "../common/Exports";
import { IRecorder } from "./IRecorder";
export declare class OpusRecorder implements IRecorder {
    private mediaResources;
    private mediaRecorderOptions;
    constructor(options?: {
        mimeType: string;
        bitsPerSecond: number;
    });
    Record: (context: AudioContext, mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>) => void;
    ReleaseMediaResources: (context: AudioContext) => void;
}
