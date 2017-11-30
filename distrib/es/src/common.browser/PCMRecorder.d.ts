import { Stream } from "../common/Exports";
import { IRecorder } from "./IRecorder";
export declare class PcmRecorder implements IRecorder {
    private mediaResources;
    Record: (context: AudioContext, mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>) => void;
    ReleaseMediaResources: (context: AudioContext) => void;
}
