/// <reference path="Promise.ts" />
/// <reference path="Stream.ts" />

namespace Common {

    export interface IAudioSource {
        Id(): string;
        TurnOn(): Promise<boolean>;
        Attach(audioNodeId: string): Promise<IAudioStreamNode>;
        Detach(audioNodeId: string): void;
        TurnOff(): Promise<boolean>;
        Events: EventSource<AudioSourceEvent>;
    }

    export interface IAudioStreamNode extends IDetachable {
        Id(): string;
        Read(): Promise<IStreamChunk<ArrayBuffer>>;
    }
}
