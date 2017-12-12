[![npm version](https://badge.fury.io/js/microsoft-speech-browser-SDK.svg)](https://www.npmjs.com/package/microsoft-speech-browser-SDK)

## Background
Microsoft's Speech Service is a cloud-based platform that features the most advanced algorithms available for converting spoken audio to text. The Universal Speech Protocol allows you to integrate speech recognition into your application using the Microsoft Speech Service.

## Install
To install [npm package](https://www.npmjs.com/package/microsoft-speech-browser-SDK) run
```
npm install microsoft-speech-browser-SDK
```

## JavaScript SDK - Sample Usage

### As a Node module

If you're building a node app and want to use the Speech SDK, all you need to do is add the following import statement:

```javascript
import * as SDK from 'microsoft-speech-browser-SDK';
```

<a name="reco_setup"></a>and setup the recognizer:

```javascript
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    let recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
        language, // Supported languages are specific to each recognition mode Refer to docs.
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
            case "SpeechFragmentEvent" :
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


### In a Browser, as a native ES6 module

...in progress, check back a little later.

### In a Browser, using Webpack

Currently, the TypeScript code in this SDK is compiled using the default module system (CommonJS), which means that the compilation produces a number of distinct JS source files. To make the SDK usable in a browser, it first needs to be "browserified" (all the javascript sources need to be glued together). Towards this end, this is what you need to do:

1. Add `require` statement to you web app source file, for instance (take a look at [sample_app.js](samples/browser/sample_app.js)):

    ```javascript
        var SDK = require('<path_to_speech_SDK>/Speech.Browser.Sdk.js');
    ```

2. Setup the recognizer, same as [above](#reco_setup).

3. Run your web-app through the webpack (see "bundle" task in [gulpfile.js](gulpfile.js), to execute it, run `npm run bundle`).

4. Add the generated bundle to your html page:

    ```
    <script src="../../distrib/speech.sdk.bundle.js"></script>
    ```

## Try the sample out
What to try the sample ? All you need is a subscription key. [Sign up](https://www.microsoft.com/cognitive-services/en-us/sign-up) to get one.

Here is a handy link to our [Sample](https://htmlpreview.github.io/?https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/preview/samples/browser/Sample.html)  that you can try out. (Rendered using [htmlPreview](https://github.com/htmlpreview/htmlpreview.github.com))

**Note:** Some browsers block microphone access on un-secure origin. So, it is recommended to host the 'sample'/'your app' on https to get it working on all supported browsers. 

## Docs
The SDK is a reference implementation for the speech websocket protocol. Check the [API reference](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/API-reference-rest/bingvoicerecognition#websocket) and [Websocket protocol reference](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/API-reference-rest/websocketprotocol) for more details.

## Browser support
The SDK depends on WebRTC APIs to get access to the microphone and read the audio stream. Most of todays browsers(Edge/Chrome/Firefox) support this. For more details about supported browsers refer to [navigator.getUserMedia#BrowserCompatibility](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#Browser_compatibility)

**Note:** The SDK currently depends on [navigator.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#Browser_compatibility) API. However this API is in process of being dropped as browsers are moving towards newer [MediaDevices.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) instead. The SDK will add support to the newer API soon.

## Contributing
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
