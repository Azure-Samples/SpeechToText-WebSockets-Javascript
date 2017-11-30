import { AudioSourceEvent, EventSource, IAudioSource, IAudioStreamNode, Promise } from "../common/Exports";
import { IRecorder } from "./IRecorder";
export declare class MicAudioSource implements IAudioSource {
    private streams;
    private id;
    private events;
    private initializeDeferral;
    private recorder;
    private mediaStream;
    private context;
    constructor(recorder: IRecorder, audioSourceId?: string);
    TurnOn: () => Promise<boolean>;
    Id: () => string;
    Attach: (audioNodeId: string) => Promise<IAudioStreamNode>;
    Detach: (audioNodeId: string) => void;
    TurnOff: () => Promise<boolean>;
    readonly Events: EventSource<AudioSourceEvent>;
    private Listen;
    private OnEvent;
    private CreateAudioContext;
    private DestroyAudioContext;
}
