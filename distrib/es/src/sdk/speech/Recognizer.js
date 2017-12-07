"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../../common/Exports");
var RecognitionEvents_1 = require("./RecognitionEvents");
var RecognizerConfig_1 = require("./RecognizerConfig");
var ServiceTelemetryListener_Internal_1 = require("./ServiceTelemetryListener.Internal");
var SpeechConnectionMessage_Internal_1 = require("./SpeechConnectionMessage.Internal");
var Recognizer = (function () {
    function Recognizer(authentication, connectionFactory, audioSource, recognizerConfig) {
        var _this = this;
        this.Recognize = function (onEventCallback, speechContextJson) {
            var requestSession = new RequestSession(_this.audioSource.Id(), onEventCallback);
            requestSession.ListenForServiceTelemetry(_this.audioSource.Events);
            return _this.audioSource
                .Attach(requestSession.AudioNodeId)
                .ContinueWithPromise(function (result) {
                if (result.IsError) {
                    requestSession.OnAudioSourceAttachCompleted(null, true, result.Error);
                    throw new Error(result.Error);
                }
                else {
                    requestSession.OnAudioSourceAttachCompleted(result.Result, false);
                }
                var audioNode = result.Result;
                _this.FetchConnection(requestSession)
                    .OnSuccessContinueWith(function (connection) {
                    var messageRetrievalPromise = _this.ReceiveMessage(connection, requestSession);
                    var messageSendPromise = _this.SendSpeechConfig(requestSession.RequestId, connection, _this.recognizerConfig.SpeechConfig.Serialize())
                        .OnSuccessContinueWithPromise(function (_) {
                        return _this.SendSpeechContext(requestSession.RequestId, connection, speechContextJson)
                            .OnSuccessContinueWithPromise(function (_) {
                            return _this.SendAudio(requestSession.RequestId, connection, audioNode, requestSession);
                        });
                    });
                    var completionPromise = Exports_1.PromiseHelper.WhenAll([messageRetrievalPromise, messageSendPromise]);
                    completionPromise.On(function (r) {
                        requestSession.Dispose();
                        _this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                    }, function (error) {
                        requestSession.Dispose(error);
                        _this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                    });
                    return completionPromise;
                });
                return requestSession.CompletionPromise;
            });
        };
        this.FetchConnection = function (requestSession, isUnAuthorized) {
            if (isUnAuthorized === void 0) { isUnAuthorized = false; }
            if (_this.connectionFetchPromise) {
                if (_this.connectionFetchPromise.Result().IsError
                    || _this.connectionFetchPromise.Result().Result.State() === Exports_1.ConnectionState.Disconnected) {
                    _this.connectionId = null;
                    _this.connectionFetchPromise = null;
                    return _this.FetchConnection(requestSession);
                }
                else {
                    requestSession.OnPreConnectionStart(_this.authFetchEventId, _this.connectionId);
                    requestSession.OnConnectionEstablishCompleted(200);
                    requestSession.ListenForServiceTelemetry(_this.connectionFetchPromise.Result().Result.Events);
                    return _this.connectionFetchPromise;
                }
            }
            _this.authFetchEventId = Exports_1.CreateNoDashGuid();
            _this.connectionId = Exports_1.CreateNoDashGuid();
            requestSession.OnPreConnectionStart(_this.authFetchEventId, _this.connectionId);
            var authPromise = isUnAuthorized ? _this.authentication.FetchOnExpiry(_this.authFetchEventId) : _this.authentication.Fetch(_this.authFetchEventId);
            _this.connectionFetchPromise = authPromise
                .ContinueWithPromise(function (result) {
                if (result.IsError) {
                    requestSession.OnAuthCompleted(true, result.Error);
                    throw new Error(result.Error);
                }
                else {
                    requestSession.OnAuthCompleted(false);
                }
                var connection = _this.connectionFactory.Create(_this.recognizerConfig, result.Result, _this.connectionId);
                requestSession.ListenForServiceTelemetry(connection.Events);
                return connection.Open().OnSuccessContinueWithPromise(function (response) {
                    if (response.StatusCode === 200) {
                        requestSession.OnConnectionEstablishCompleted(response.StatusCode);
                        return Exports_1.PromiseHelper.FromResult(connection);
                    }
                    else if (response.StatusCode === 403 && !isUnAuthorized) {
                        return _this.FetchConnection(requestSession, true);
                    }
                    else {
                        requestSession.OnConnectionEstablishCompleted(response.StatusCode, response.Reason);
                        return Exports_1.PromiseHelper.FromError("Unable to contact server. StatusCode: " + response.StatusCode + ", Reason: " + response.Reason);
                    }
                });
            });
            return _this.connectionFetchPromise;
        };
        this.ReceiveMessage = function (connection, requestSession) {
            return connection
                .Read()
                .OnSuccessContinueWithPromise(function (message) {
                var connectionMessage = SpeechConnectionMessage_Internal_1.SpeechConnectionMessage.FromConnectionMessage(message);
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
                            if (_this.recognizerConfig.IsContinuousRecognition) {
                                _this.SendTelemetryData(requestSession.RequestId, connection, requestSession.GetTelemetry());
                            }
                            if (_this.recognizerConfig.Format === RecognizerConfig_1.SpeechResultFormat.Simple) {
                                requestSession.OnServiceSimpleSpeechPhraseResponse(JSON.parse(connectionMessage.TextBody));
                            }
                            else {
                                requestSession.OnServiceDetailedSpeechPhraseResponse(JSON.parse(connectionMessage.TextBody));
                            }
                            break;
                        case "turn.end":
                            requestSession.OnServiceTurnEndResponse();
                            return Exports_1.PromiseHelper.FromResult(true);
                        default:
                            break;
                    }
                }
                return _this.ReceiveMessage(connection, requestSession);
            });
        };
        this.SendSpeechConfig = function (requestId, connection, speechConfigJson) {
            if (speechConfigJson && _this.connectionId !== _this.speechConfigConnectionId) {
                _this.speechConfigConnectionId = _this.connectionId;
                return connection
                    .Send(new SpeechConnectionMessage_Internal_1.SpeechConnectionMessage(Exports_1.MessageType.Text, "speech.config", requestId, "application/json", speechConfigJson));
            }
            return Exports_1.PromiseHelper.FromResult(true);
        };
        this.SendSpeechContext = function (requestId, connection, speechContextJson) {
            if (speechContextJson) {
                return connection
                    .Send(new SpeechConnectionMessage_Internal_1.SpeechConnectionMessage(Exports_1.MessageType.Text, "speech.context", requestId, "application/json", speechContextJson));
            }
            return Exports_1.PromiseHelper.FromResult(true);
        };
        this.SendTelemetryData = function (requestId, connection, telemetryData) {
            return connection
                .Send(new SpeechConnectionMessage_Internal_1.SpeechConnectionMessage(Exports_1.MessageType.Text, "telemetry", requestId, "application/json", telemetryData));
        };
        this.SendAudio = function (requestId, connection, audioStreamNode, requestSession) {
            var deferred = new Exports_1.Deferred();
            var readAndUploadCycle = function (_) {
                audioStreamNode.Read().On(function (audioStreamChunk) {
                    if (requestSession.IsSpeechEnded) {
                        deferred.Resolve(true);
                        return;
                    }
                    var payload = (audioStreamChunk.IsEnd) ? null : audioStreamChunk.Buffer;
                    var uploaded = connection.Send(new SpeechConnectionMessage_Internal_1.SpeechConnectionMessage(Exports_1.MessageType.Binary, "audio", requestId, null, payload));
                    if (!audioStreamChunk.IsEnd) {
                        uploaded.OnSuccessContinueWith(readAndUploadCycle);
                    }
                    else {
                        deferred.Resolve(true);
                    }
                }, function (error) {
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
            throw new Exports_1.ArgumentNullError("authentication");
        }
        if (!connectionFactory) {
            throw new Exports_1.ArgumentNullError("connectionFactory");
        }
        if (!audioSource) {
            throw new Exports_1.ArgumentNullError("audioSource");
        }
        if (!recognizerConfig) {
            throw new Exports_1.ArgumentNullError("recognizerConfig");
        }
        this.authentication = authentication;
        this.connectionFactory = connectionFactory;
        this.audioSource = audioSource;
        this.recognizerConfig = recognizerConfig;
    }
    Object.defineProperty(Recognizer.prototype, "AudioSource", {
        get: function () {
            return this.audioSource;
        },
        enumerable: true,
        configurable: true
    });
    return Recognizer;
}());
exports.Recognizer = Recognizer;
var RequestSession = (function () {
    function RequestSession(audioSourceId, onEventCallback) {
        var _this = this;
        this.isDisposed = false;
        this.detachables = new Array();
        this.isAudioNodeDetached = false;
        this.isCompleted = false;
        this.OnAudioSourceAttachCompleted = function (audioNode, isError, error) {
            _this.audioNode = audioNode;
            if (isError) {
                _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.AudioSourceError, error);
            }
            else {
                _this.OnEvent(new RecognitionEvents_1.ListeningStartedEvent(_this.requestId, _this.audioSourceId, _this.audioNodeId));
            }
        };
        this.OnPreConnectionStart = function (authFetchEventId, connectionId) {
            _this.authFetchEventId = authFetchEventId;
            _this.connectionId = connectionId;
            _this.OnEvent(new RecognitionEvents_1.ConnectingToServiceEvent(_this.requestId, _this.authFetchEventId, _this.connectionId));
        };
        this.OnAuthCompleted = function (isError, error) {
            if (isError) {
                _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.AuthTokenFetchError, error);
            }
        };
        this.OnConnectionEstablishCompleted = function (statusCode, reason) {
            if (statusCode === 200) {
                _this.OnEvent(new RecognitionEvents_1.RecognitionStartedEvent(_this.RequestId, _this.audioSourceId, _this.audioNodeId, _this.authFetchEventId, _this.connectionId));
                return;
            }
            else if (statusCode === 403) {
                _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.UnAuthorized, reason);
            }
            else {
                _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.ConnectError, reason);
            }
        };
        this.OnServiceTurnStartResponse = function (response) {
            if (response && response.context && response.context.serviceTag) {
                _this.serviceTag = response.context.serviceTag;
            }
        };
        this.OnServiceSpeechStartDetectedResponse = function (result) {
            _this.OnEvent(new RecognitionEvents_1.SpeechStartDetectedEvent(_this.RequestId, result));
        };
        this.OnServiceSpeechHypothesisResponse = function (result) {
            _this.OnEvent(new RecognitionEvents_1.SpeechHypothesisEvent(_this.RequestId, result));
        };
        this.OnServiceSpeechFragmentResponse = function (result) {
            _this.OnEvent(new RecognitionEvents_1.SpeechFragmentEvent(_this.RequestId, result));
        };
        this.OnServiceSpeechEndDetectedResponse = function (result) {
            _this.DetachAudioNode();
            _this.OnEvent(new RecognitionEvents_1.SpeechEndDetectedEvent(_this.RequestId, result));
        };
        this.OnServiceSimpleSpeechPhraseResponse = function (result) {
            _this.OnEvent(new RecognitionEvents_1.SpeechSimplePhraseEvent(_this.RequestId, result));
        };
        this.OnServiceDetailedSpeechPhraseResponse = function (result) {
            _this.OnEvent(new RecognitionEvents_1.SpeechDetailedPhraseEvent(_this.RequestId, result));
        };
        this.OnServiceTurnEndResponse = function () {
            _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.Success);
        };
        this.OnConnectionError = function (error) {
            _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.UnknownError, error);
        };
        this.Dispose = function (error) {
            if (!_this.isDisposed) {
                _this.OnComplete(RecognitionEvents_1.RecognitionCompletionStatus.UnknownError, error);
                _this.isDisposed = true;
                for (var _i = 0, _a = _this.detachables; _i < _a.length; _i++) {
                    var detachable = _a[_i];
                    detachable.Detach();
                }
                _this.serviceTelemetryListener.Dispose();
            }
        };
        this.GetTelemetry = function () {
            return _this.serviceTelemetryListener.GetTelemetry();
        };
        this.OnComplete = function (status, error) {
            if (!_this.isCompleted) {
                _this.isCompleted = true;
                _this.DetachAudioNode();
                _this.OnEvent(new RecognitionEvents_1.RecognitionEndedEvent(_this.RequestId, _this.audioSourceId, _this.audioNodeId, _this.authFetchEventId, _this.connectionId, _this.serviceTag, status, error ? error : ""));
            }
        };
        this.DetachAudioNode = function () {
            if (!_this.isAudioNodeDetached) {
                _this.isAudioNodeDetached = true;
                if (_this.audioNode) {
                    _this.audioNode.Detach();
                }
            }
        };
        this.OnEvent = function (event) {
            _this.serviceTelemetryListener.OnEvent(event);
            Exports_1.Events.Instance.OnEvent(event);
            if (_this.onEventCallback) {
                _this.onEventCallback(event);
            }
        };
        this.audioSourceId = audioSourceId;
        this.onEventCallback = onEventCallback;
        this.requestId = Exports_1.CreateNoDashGuid();
        this.audioNodeId = Exports_1.CreateNoDashGuid();
        this.requestCompletionDeferral = new Exports_1.Deferred();
        this.serviceTelemetryListener = new ServiceTelemetryListener_Internal_1.ServiceTelemetryListener(this.requestId, this.audioSourceId, this.audioNodeId);
        this.OnEvent(new RecognitionEvents_1.RecognitionTriggeredEvent(this.RequestId, this.audioSourceId, this.audioNodeId));
    }
    Object.defineProperty(RequestSession.prototype, "RequestId", {
        get: function () {
            return this.requestId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestSession.prototype, "AudioNodeId", {
        get: function () {
            return this.audioNodeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestSession.prototype, "CompletionPromise", {
        get: function () {
            return this.requestCompletionDeferral.Promise();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestSession.prototype, "IsSpeechEnded", {
        get: function () {
            return this.isAudioNodeDetached;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestSession.prototype, "IsCompleted", {
        get: function () {
            return this.isCompleted;
        },
        enumerable: true,
        configurable: true
    });
    RequestSession.prototype.ListenForServiceTelemetry = function (eventSource) {
        this.detachables.push(eventSource.AttachListener(this.serviceTelemetryListener));
    };
    return RequestSession;
}());

//# sourceMappingURL=Recognizer.js.map
