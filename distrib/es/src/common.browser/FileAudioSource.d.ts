import { AudioSourceEvent, EventSource, IAudioSource, IAudioStreamNode, Promise } from "../common/Exports";
export declare class FileAudioSource implements IAudioSource {
    private static readonly SAMPLE_RATE;
    private static readonly CHUNK_SIZE;
    private static readonly UPLOAD_INTERVAL;
    private static readonly MAX_SIZE;
    private streams;
    private id;
    private events;
    private file;
    constructor(file: File, audioSourceId?: string);
    TurnOn: () => Promise<boolean>;
    Id: () => string;
    Attach: (audioNodeId: string) => Promise<IAudioStreamNode>;
    Detach: (audioNodeId: string) => void;
    TurnOff: () => Promise<boolean>;
    readonly Events: EventSource<AudioSourceEvent>;
    private Upload;
    private OnEvent;
}
