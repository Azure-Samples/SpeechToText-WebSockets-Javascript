export declare enum RecognitionStatus {
    Success = 0,
    NoMatch = 1,
    InitialSilenceTimeout = 2,
    BabbleTimeout = 3,
    Error = 4,
    EndOfDictation = 5,
}
export interface ISpeechStartDetectedResult {
    Offset?: number;
}
export interface ISpeechFragment {
    Text: string;
    Offset?: number;
    Duration?: number;
}
export interface ISpeechEndDetectedResult {
    Offset?: number;
}
export interface ISimpleSpeechPhrase {
    RecognitionStatus: RecognitionStatus;
    DisplayText: string;
    Duration?: number;
    Offset?: number;
}
export interface IDetailedSpeechPhrase {
    RecognitionStatus: RecognitionStatus;
    NBest: IPhrase[];
    Duration?: number;
    Offset?: number;
}
export interface IPhrase {
    Confidence?: number;
    Lexical: string;
    ITN: string;
    MaskedITN: string;
    Display: string;
}
