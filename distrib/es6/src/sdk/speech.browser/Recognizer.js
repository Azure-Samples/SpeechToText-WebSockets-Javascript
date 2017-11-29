import { FileAudioSource, MicAudioSource, PcmRecorder } from "../../common.browser/Exports";
import { Recognizer } from "../speech/Exports";
import { SpeechConnectionFactory } from "./SpeechConnectionFactory";
const CreateRecognizer = (recognizerConfig, authentication) => {
    return CreateRecognizerWithPcmRecorder(recognizerConfig, authentication);
};
const CreateRecognizerWithPcmRecorder = (recognizerConfig, authentication) => {
    return CreateRecognizerWithCustomAudioSource(recognizerConfig, authentication, new MicAudioSource(new PcmRecorder()));
};
const CreateRecognizerWithFileAudioSource = (recognizerConfig, authentication, file) => {
    return CreateRecognizerWithCustomAudioSource(recognizerConfig, authentication, new FileAudioSource(file));
};
const CreateRecognizerWithCustomAudioSource = (recognizerConfig, authentication, audioSource) => {
    return new Recognizer(authentication, new SpeechConnectionFactory(), audioSource, recognizerConfig);
};
export { CreateRecognizer, CreateRecognizerWithCustomAudioSource, CreateRecognizerWithFileAudioSource, CreateRecognizerWithPcmRecorder };

//# sourceMappingURL=Recognizer.js.map
