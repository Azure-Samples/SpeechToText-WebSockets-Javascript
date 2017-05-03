## Background
Microsoft's Speech Service is a cloud-based platform that features the most advanced algorithms available for converting spoken audio to text. The Universal Speech Protocol allows you to integrate speech recognition into your application using the Microsoft Speech Service.

## JavaScipt SDK - Sample Usage

```javascript
// Creating a shorter alias for Speech
let SR = Speech;

// Setup the recongizer before
function RecognizerSetup(recognitionMode, language, format, subscriptionKey) {
    let recognizerConfig = new SR.RecognizerConfig(
        new SR.SpeechConfig(
            new SR.Context(
                new SR.OS(navigator.userAgent, "Browser", null),
                new SR.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SR.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
        language, // Supported laguages are specific to each recognition mode. Refer to docs.
        format); // SR.SpeechResultFormat.Simple (Options - Simple/Detailed)

    // Alternatively use SR.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SR.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SR.Browser.Recognizer.Create(recognizerConfig, authentication);
}

function RecognizerStart(recognizer) {
    recognizer.Recognize((event) => {
        /*
            Alternative syntax for typescript devs.
            if (event instanceof SR.RecognitionTriggeredEvent)
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

function RecognizerStop(recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}
```

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
