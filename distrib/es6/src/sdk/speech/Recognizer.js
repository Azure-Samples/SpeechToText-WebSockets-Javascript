import { ArgumentNullError, ConnectionState, CreateNoDashGuid, Deferred, Events, MessageType, PromiseHelper, } from "../../common/Exports";
import { ConnectingToServiceEvent, ListeningStartedEvent, RecognitionCompletionStatus, RecognitionEndedEvent, RecognitionStartedEvent, RecognitionTriggeredEvent, SpeechDetailedPhraseEvent, SpeechEndDetectedEvent, SpeechFragmentEvent, SpeechHypothesisEvent, SpeechSimplePhraseEvent, SpeechStartDetectedEvent, } from "./RecognitionEvents";
import { SpeechResultFormat } from "./RecognizerConfig";
import { ServiceTelemetryListener } from "./ServiceTelemetryListener.Internal";
import { SpeechConnectionMessage } from "./SpeechConnectionMessage.Internal";
export class Recognizer {
    constructor(authentication, connectionFactory, audioSource, recognizerConfig) {
        this.Recognize = (onEventCallback, speechContextJson) => {
            const requestSession = new RequestSession(this.audioSource.Id(), onEventCallback);
            requestSession.ListenForServiceTelemetry(this.audioSource.Events);
            return this.audioSource
                .Attach(requestSession.AudioNodeId)
                .ContinueWithPromise((result) => {
                if (result.IsError) {
                    requestSession.OnAudioSourceAttachCompleted(null, true, result.Error);
                    throw new Error(result.Error);
                }
                else {
                    requestSession.OnAudioSourceAttachCompleted(result.Result, false);
                }
                const audioNode = result.Result;
                this.FetchConnection(requestSession)
                    .OnSuccessContinueWith((connection) => {
                    const messageRetrievalPromise = this.ReceiveMessage(connection, requestSession);
                    const messageSendPromise = this.SendSpeechConfig(requestSession.RequestId, connection, this.recognizerConfig.SpeechConfig.Serialize())
                        .OnSuccessContinueWithPromise((_) => {
                        return this.SendSpeechContext(requestSession.RequestId, connection, speechContextJson)
                            .OnSuccessContinueWithPromise((_) => {
                            return this.SendAudio(requestSession.RequestId, connection, audioNode, requestSession);
                        });
                    });
                    const completionPromise = PromiseHelper.WhenAll([messageRetrievalPromise, messageSendPromise]);
                    completionPromise.On((r) => {
                        requestSession.Dispose();
                        this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                    }, (error) => {
                        requestSession.Dispose(error);
                        this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                    });
                    return completionPromise;
                });
                return requestSession.CompletionPromise;
            });
        };
        this.FetchConnection = (requestSession, isUnAuthorized = false) => {
            if (this.connectionFetchPromise) {
                if (this.connectionFetchPromise.Result().IsError
                    || this.connectionFetchPromise.Result().Result.State() === ConnectionState.Disconnected) {
                    this.connectionId = null;
                    this.connectionFetchPromise = null;
                    return this.FetchConnection(requestSession);
                }
                else {
                    requestSession.OnPreConnectionStart(this.authFetchEventId, this.connectionId);
                    requestSession.OnConnectionEstablishCompleted(200);
                    requestSession.ListenForServiceTelemetry(this.connectionFetchPromise.Result().Result.Events);
                    return this.connectionFetchPromise;
                }
            }
            this.authFetchEventId = CreateNoDashGuid();
            this.connectionId = CreateNoDashGuid();
            requestSession.OnPreConnectionStart(this.authFetchEventId, this.connectionId);
            const authPromise = isUnAuthorized ? this.authentication.FetchOnExpiry(this.authFetchEventId) : this.authentication.Fetch(this.authFetchEventId);
            this.connectionFetchPromise = authPromise
                .ContinueWithPromise((result) => {
                if (result.IsError) {
                    requestSession.OnAuthCompleted(true, result.Error);
                    throw new Error(result.Error);
                }
                else {
                    requestSession.OnAuthCompleted(false);
                }
                const connection = this.connectionFactory.Create(this.recognizerConfig, result.Result, this.connectionId);
                requestSession.ListenForServiceTelemetry(connection.Events);
                return connection.Open().OnSuccessContinueWithPromise((response) => {
                    if (response.StatusCode === 200) {
                        requestSession.OnConnectionEstablishCompleted(response.StatusCode);
                        return PromiseHelper.FromResult(connection);
                    }
                    else if (response.StatusCode === 403 && !isUnAuthorized) {
                        return this.FetchConnection(requestSession, true);
                    }
                    else {
                        requestSession.OnConnectionEstablishCompleted(response.StatusCode, response.Reason);
                        return PromiseHelper.FromError(`Unable to contact server. StatusCode: ${response.StatusCode}, Reason: ${response.Reason}`);
                    }
                });
            });
            return this.connectionFetchPromise;
        };
        this.ReceiveMessage = (connection, requestSession) => {
            return connection
                .Read()
                .OnSuccessContinueWithPromise((message) => {
                const connectionMessage = SpeechConnectionMessage.FromConnectionMessage(message);
                if (connectionMessage.RequestId.toLowerCase() === requestSession.RequestId.toLowerCase()) {
                    switch (connectionMessage.Path.toLowerCase()) {
                        case "turn.start":
                            requestSession.OnServiceTurnStartResponse(JSON.parse(connectionMessage.TextBody));
                            break;
                        case "speech.startDetected":
                            requestSession.OnServiceSpeechStartDetectedResponse(JSON.parse(connectionMessage.TextBody));
                            break;
                        case "speech.hypothesis":
                            requestSession.OnServiceSpeechHypothesisResponse(JSON.parse(connectionMessage.TextBody));
                            break;
                        case "speech.fragment":
                            requestSession.OnServiceSpeechFragmentResponse(JSON.parse(connectionMessage.TextBody));
                            break;
                        case "speech.enddetected":
                            requestSession.OnServiceSpeechEndDetectedResponse(JSON.parse(connectionMessage.TextBody));
                            break;
                        case "speech.phrase":
                            if (this.recognizerConfig.IsContinuousRecognition) {
                                this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                            }
                            if (this.recognizerConfig.Format === SpeechResultFormat.Simple) {
                                requestSession.OnServiceSimpleSpeechPhraseResponse(JSON.parse(connectionMessage.TextBody));
                            }
                            else {
                                requestSession.OnServiceDetailedSpeechPhraseResponse(JSON.parse(connectionMessage.TextBody));
                            }
                            break;
                        case "turn.end":
                            requestSession.OnServiceTurnEndResponse();
                            return PromiseHelper.FromResult(true);
                        default:
                            break;
                    }
                }
                return this.ReceiveMessage(connection, requestSession);
            });
        };
        this.SendSpeechConfig = (requestId, connection, speechConfigJson) => {
            if (speechConfigJson && this.connectionId !== this.speechConfigConnectionId) {
                this.speechConfigConnectionId = this.connectionId;
                return connection
                    .Send(new SpeechConnectionMessage(MessageType.Text, "speech.config", requestId, "application/json", speechConfigJson));
            }
            return PromiseHelper.FromResult(true);
        };
        this.SendSpeechContext = (requestId, connection, speechContextJson) => {
            if (speechContextJson) {
                return connection
                    .Send(new SpeechConnectionMessage(MessageType.Text, "speech.context", requestId, "application/json", speechContextJson));
            }
            return PromiseHelper.FromResult(true);
        };
        this.SendTelemetryData = (requestId, connection, telemetryData) => {
            return connection
                .Send(new SpeechConnectionMessage(MessageType.Text, "telemetry", requestId, "application/json", telemetryData));
        };
        this.SendAudio = (requestId, connection, audioStreamNode, requestSession) => {
            const deferred = new Deferred();
            const readAndUploadCycle = (_) => {
                audioStreamNode.Read().On((audioStreamChunk) => {
                    if (requestSession.IsSpeechEnded) {
                        deferred.Resolve(true);
                        return;
                    }
                    const payload = (audioStreamChunk.IsEnd) ? null : audioStreamChunk.Buffer;
                    const uploaded = connection.Send(new SpeechConnectionMessage(MessageType.Binary, "audio", requestId, null, payload));
                    if (!audioStreamChunk.IsEnd) {
                        uploaded.OnSuccessContinueWith(readAndUploadCycle);
                    }
                    else {
                        deferred.Resolve(true);
                    }
                }, (error) => {
                    if (requestSession.IsSpeechEnded) {
                        deferred.Resolve(true);
                    }
                    else {
                        deferred.Reject(error);
                    }
                });
            };
            readAndUploadCycle(true);
            return deferred.Promise();
        };
        if (!authentication) {
            throw new ArgumentNullError("authentication");
        }
        if (!connectionFactory) {
            throw new ArgumentNullError("connectionFactory");
        }
        if (!audioSource) {
            throw new ArgumentNullError("audioSource");
        }
        if (!recognizerConfig) {
            throw new ArgumentNullError("recognizerConfig");
        }
        this.authentication = authentication;
        this.connectionFactory = connectionFactory;
        this.audioSource = audioSource;
        this.recognizerConfig = recognizerConfig;
    }
    get AudioSource() {
        return this.audioSource;
    }
}
class RequestSession {
    constructor(audioSourceId, onEventCallback) {
        this.isDisposed = false;
        this.detachables = new Array();
        this.isAudioNodeDetached = false;
        this.isCompleted = false;
        this.OnAudioSourceAttachCompleted = (audioNode, isError, error) => {
            this.audioNode = audioNode;
            if (isError) {
                this.OnComplete(RecognitionCompletionStatus.AudioSourceError, error);
            }
            else {
                this.OnEvent(new ListeningStartedEvent(this.requestId, this.audioSourceId, this.audioNodeId));
            }
        };
        this.OnPreConnectionStart = (authFetchEventId, connectionId) => {
            this.authFetchEventId = authFetchEventId;
            this.connectionId = connectionId;
            this.OnEvent(new ConnectingToServiceEvent(this.requestId, this.authFetchEventId, this.connectionId));
        };
        this.OnAuthCompleted = (isError, error) => {
            if (isError) {
                this.OnComplete(RecognitionCompletionStatus.AuthTokenFetchError, error);
            }
        };
        this.OnConnectionEstablishCompleted = (statusCode, reason) => {
            if (statusCode === 200) {
                this.OnEvent(new RecognitionStartedEvent(this.RequestId, this.audioSourceId, this.audioNodeId, this.authFetchEventId, this.connectionId));
                return;
            }
            else if (statusCode === 403) {
                this.OnComplete(RecognitionCompletionStatus.UnAuthorized, reason);
            }
            else {
                this.OnComplete(RecognitionCompletionStatus.ConnectError, reason);
            }
        };
        this.OnServiceTurnStartResponse = (response) => {
            if (response && response.context && response.context.serviceTag) {
                this.serviceTag = response.context.serviceTag;
            }
        };
        this.OnServiceSpeechStartDetectedResponse = (result) => {
            this.OnEvent(new SpeechStartDetectedEvent(this.RequestId, result));
        };
        this.OnServiceSpeechHypothesisResponse = (result) => {
            this.OnEvent(new SpeechHypothesisEvent(this.RequestId, result));
        };
        this.OnServiceSpeechFragmentResponse = (result) => {
            this.OnEvent(new SpeechFragmentEvent(this.RequestId, result));
        };
        this.OnServiceSpeechEndDetectedResponse = (result) => {
            this.DetachAudioNode();
            this.OnEvent(new SpeechEndDetectedEvent(this.RequestId, result));
        };
        this.OnServiceSimpleSpeechPhraseResponse = (result) => {
            this.OnEvent(new SpeechSimplePhraseEvent(this.RequestId, result));
        };
        this.OnServiceDetailedSpeechPhraseResponse = (result) => {
            this.OnEvent(new SpeechDetailedPhraseEvent(this.RequestId, result));
        };
        this.OnServiceTurnEndResponse = () => {
            this.OnComplete(RecognitionCompletionStatus.Success);
        };
        this.OnConnectionError = (error) => {
            this.OnComplete(RecognitionCompletionStatus.UnknownError, error);
        };
        this.Dispose = (error) => {
            if (!this.isDisposed) {
                this.OnComplete(RecognitionCompletionStatus.UnknownError, error);
                this.isDisposed = true;
                for (const detachable of this.detachables) {
                    detachable.Detach();
                }
                this.serviceTelemetryListener.Dispose();
            }
        };
        this.GetTelemetry = () => {
            return this.serviceTelemetryListener.GetTelemetry();
        };
        this.OnComplete = (status, error) => {
            if (!this.isCompleted) {
                this.isCompleted = true;
                this.DetachAudioNode();
                this.OnEvent(new RecognitionEndedEvent(this.RequestId, this.audioSourceId, this.audioNodeId, this.authFetchEventId, this.connectionId, this.serviceTag, status, error ? error : ""));
            }
        };
        this.DetachAudioNode = () => {
            if (!this.isAudioNodeDetached) {
                this.isAudioNodeDetached = true;
                if (this.audioNode) {
                    this.audioNode.Detach();
                }
            }
        };
        this.OnEvent = (event) => {
            this.serviceTelemetryListener.OnEvent(event);
            Events.Instance.OnEvent(event);
            if (this.onEventCallback) {
                this.onEventCallback(event);
            }
        };
        this.audioSourceId = audioSourceId;
        this.onEventCallback = onEventCallback;
        this.requestId = CreateNoDashGuid();
        this.audioNodeId = CreateNoDashGuid();
        this.requestCompletionDeferral = new Deferred();
        this.serviceTelemetryListener = new ServiceTelemetryListener(this.requestId, this.audioSourceId, this.audioNodeId);
        this.OnEvent(new RecognitionTriggeredEvent(this.RequestId, this.audioSourceId, this.audioNodeId));
    }
    get RequestId() {
        return this.requestId;
    }
    get AudioNodeId() {
        return this.audioNodeId;
    }
    get CompletionPromise() {
        return this.requestCompletionDeferral.Promise();
    }
    get IsSpeechEnded() {
        return this.isAudioNodeDetached;
    }
    get IsCompleted() {
        return this.isCompleted;
    }
    ListenForServiceTelemetry(eventSource) {
        this.detachables.push(eventSource.AttachListener(this.serviceTelemetryListener));
    }
}

//# sourceMappingURL=Recognizer.js.map
