import { Stream } from "../common/Exports";

export interface IRecorder {
    Record(mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void;
    ReleaseMediaResources(): void;
}
