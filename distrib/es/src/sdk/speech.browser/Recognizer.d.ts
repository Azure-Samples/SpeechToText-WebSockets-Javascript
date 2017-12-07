import { IAudioSource } from "../../common/Exports";
import { IAuthentication, Recognizer, RecognizerConfig } from "../speech/Exports";
declare const CreateRecognizer: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Recognizer;
declare const CreateRecognizerWithPcmRecorder: (recognizerConfig: RecognizerConfig, authentication: IAuthentication) => Recognizer;
declare const CreateRecognizerWithFileAudioSource: (recognizerConfig: RecognizerConfig, authentication: IAuthentication, file: File) => Recognizer;
declare const CreateRecognizerWithCustomAudioSource: (recognizerConfig: RecognizerConfig, authentication: IAuthentication, audioSource: IAudioSource) => Recognizer;
export { CreateRecognizer, CreateRecognizerWithCustomAudioSource, CreateRecognizerWithFileAudioSource, CreateRecognizerWithPcmRecorder };
