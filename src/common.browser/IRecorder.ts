/// <reference path="..\common\Stream.ts" />

namespace Common.Browser {
    export interface IRecorder {
        Record(mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void;
        ReleaseMediaResources(): void;
    }
}
