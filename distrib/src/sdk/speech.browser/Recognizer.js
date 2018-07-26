"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common.browser/Exports");
var Exports_2 = require("../speech/Exports");
var SpeechConnectionFactory_1 = require("./SpeechConnectionFactory");
var CreateRecognizer = function (recognizerConfig, authentication) {
    return CreateRecognizerWithPcmRecorder(recognizerConfig, authentication);
};
exports.CreateRecognizer = CreateRecognizer;
var CreateRecognizerWithPcmRecorder = function (recognizerConfig, authentication) {
    return CreateRecognizerWithCustomAudioSource(recognizerConfig, authentication, new Exports_1.MicAudioSource(new Exports_1.PcmRecorder()));
};
exports.CreateRecognizerWithPcmRecorder = CreateRecognizerWithPcmRecorder;
var CreateRecognizerWithFileAudioSource = function (recognizerConfig, authentication, file) {
    return CreateRecognizerWithCustomAudioSource(recognizerConfig, authentication, new Exports_1.FileAudioSource(file));
};
exports.CreateRecognizerWithFileAudioSource = CreateRecognizerWithFileAudioSource;
var CreateRecognizerWithCustomAudioSource = function (recognizerConfig, authentication, audioSource) {
    return new Exports_2.Recognizer(authentication, new SpeechConnectionFactory_1.SpeechConnectionFactory(), audioSource, recognizerConfig);
};
exports.CreateRecognizerWithCustomAudioSource = CreateRecognizerWithCustomAudioSource;

//# sourceMappingURL=Recognizer.js.map
