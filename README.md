[![npm version](https://badge.fury.io/js/microsoft-speech-browser-sdk.svg)](https://www.npmjs.com/package/microsoft-speech-browser-sdk)

## Background
Microsoft's Speech Service is a cloud-based platform that features the most advanced algorithms available for converting spoken audio to text. The Universal Speech Protocol allows you to integrate speech recognition into your application using the Microsoft Speech Service.

## Install
To install [npm package](https://www.npmjs.com/package/microsoft-speech-browser-sdk) run
```
npm install microsoft-speech-browser-sdk
```

## JavaScipt SDK - Sample Usage
[RequireJs](http://requirejs.org/) is a dependency. Make sure to reference it in your page before using the SDK.

```javascript
// Resolve the SDK dependecy using RequireJs
require(["Speech.Browser.Sdk"], function(SDK) {
    // Now start using the SDK
});

// Setup the recongizer
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    let recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
        language, // Supported laguages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SDK.Recognizer.Create(recognizerConfig, authentication);
}

function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        /*
            Alternative syntax for typescript devs.
            if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent" :
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent" :
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent" :
                UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
        }
    })
    .On(() => {
        // The request succeeded. Nothing to do here.
    },
    (error) => {
        console.error(error);
    });
}

function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}
```

## Try the sample out
What to try the sample ? All you need is a subscription key. [Sign up](https://www.microsoft.com/cognitive-services/en-us/sign-up) to get one.

Here is a handy link to our [Sample](https://htmlpreview.github.io/?https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/samples/browser/Sample.html)  that you can try out. (Rendered using [htmlPreview](https://github.com/htmlpreview/htmlpreview.github.com))

**Note:** Some browsers block microphone access on un-secure origin. So, it is recommended to host the 'sample'/'your app' on https to get it working on all supported browsers. 

## Docs
The sdk is a reference implementation for the speech websocket protocol. Check the [API reference](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/api-reference-rest/bingvoicerecognition#websocket) and [Websocket protocol reference](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/api-reference-rest/websocketprotocol) for more details.

## Browser support
The SDK depends on WebRTC apis to get access to the microphone and read the audio stream. Most of todays browsers(Edge/Chrome/Firefox) support this. For more details about supported browsers refer to [navigator.getUserMedia#BrowserCompatibility](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#Browser_compatibility)

**Note:** The sdk currently depends on [navigator.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#Browser_compatibility) api. However this api is in process of being dropped as browsers are moving towards newer [MediaDevices.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) instead. The sdk will add support to the newer api soon.

## Contributing
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
