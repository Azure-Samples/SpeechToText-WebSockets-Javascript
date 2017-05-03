///<reference path="..\speech\SpeechConfig.ts"/>

namespace Speech {

    export enum RecognitionMode {
        Interactive,
        Conversation,
        Dictation,
    }

    export enum SpeechResultFormat {
        Simple,
        Detailed,
    }

    export class RecognizerConfig {
        private recognitionMode: RecognitionMode = RecognitionMode.Interactive;
        private language: string;
        private format: SpeechResultFormat;
        private speechConfig: SpeechConfig;
        private recognitionActivityTimeout: number;

        constructor(
            platformConfig: SpeechConfig,
            recognitionMode: RecognitionMode = RecognitionMode.Interactive,
            language: string = "en-us",
            format: SpeechResultFormat = SpeechResultFormat.Simple) {
            this.speechConfig = platformConfig ? platformConfig : new SpeechConfig(new Context(null, null));
            this.recognitionMode = recognitionMode;
            this.language = language;
            this.format = format;
            this.recognitionActivityTimeout = recognitionMode === RecognitionMode.Interactive ? 8000 : 25000;
        }

        public get RecognitionMode(): RecognitionMode {
            return this.recognitionMode;
        }

        public get Language(): string {
            return this.language;
        }

        public get Format(): SpeechResultFormat{
            return this.format;
        }

        public get SpeechConfig(): SpeechConfig {
            return this.speechConfig;
        }

        public get RecognitionActivityTimeout(): number {
            return this.recognitionActivityTimeout;
        }

        public get IsContinuousRecognition(): boolean {
            return this.recognitionMode !== RecognitionMode.Interactive;
        }
    }
}
