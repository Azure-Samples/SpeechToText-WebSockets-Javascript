/// <reference path="../../common/Promise.ts" />
/// <reference path="../../common/Storage.ts" />
/// <reference path="../../common/IAudioSource.ts" />
/// <reference path="../../common.browser/MicAudioSource.ts" />
/// <reference path="../../common.browser/PcmRecorder.ts" />
/// <reference path="../speech/IAuthentication.ts" />
/// <reference path="../speech/Recognizer.ts" />
/// <reference path="../speech/RecognizerConfig.ts" />
/// <reference path="SpeechConnectionFactory.ts" />

namespace Speech.Browser {

    export class Recognizer {

        public static Create = (recognizerConfig: RecognizerConfig, authentication: IAuthentication): Speech.Recognizer => {
            return Recognizer.CreateWithPcmRecorder(
                recognizerConfig,
                authentication);
        }

        public static CreateWithPcmRecorder = (recognizerConfig: RecognizerConfig, authentication: IAuthentication): Speech.Recognizer => {
            return Recognizer.CreateWithCustomAudioSource(
                recognizerConfig,
                authentication,
                new Common.Browser.MicAudioSource(new Common.Browser.PcmRecorder()));
        }

        public static CreateWithCustomAudioSource = (recognizerConfig: RecognizerConfig, authentication: IAuthentication, audioSource: Common.IAudioSource): Speech.Recognizer =>  {
            return new Speech.Recognizer (
                authentication,
                new SpeechConnectionFactory(),
                audioSource,
                recognizerConfig);
        }
    }
}
