"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var MicAudioSource = /** @class */ (function () {
    function MicAudioSource(recorder, audioSourceId) {
        var _this = this;
        this.streams = {};
        this.TurnOn = function () {
            if (_this.initializeDeferral) {
                return _this.initializeDeferral.Promise();
            }
            _this.initializeDeferral = new Exports_1.Deferred();
            _this.CreateAudioContext();
            var nav = window.navigator;
            var getUserMedia = (nav.getUserMedia ||
                nav.webkitGetUserMedia ||
                nav.mozGetUserMedia ||
                nav.msGetUserMedia);
            if (!!nav.mediaDevices) {
                getUserMedia = function (constraints, successCallback, errorCallback) {
                    nav.mediaDevices
                        .getUserMedia(constraints)
                        .then(successCallback)
                        .catch(errorCallback);
                };
            }
            if (!getUserMedia) {
                var errorMsg = "Browser does not support getUserMedia.";
                _this.initializeDeferral.Reject(errorMsg);
                _this.OnEvent(new Exports_1.AudioSourceErrorEvent(errorMsg, "")); // mic initialized error - no streamid at this point
            }
            else {
                var next = function () {
                    _this.OnEvent(new Exports_1.AudioSourceInitializingEvent(_this.id)); // no stream id
                    getUserMedia({ audio: true, video: false }, function (mediaStream) {
                        _this.mediaStream = mediaStream;
                        _this.OnEvent(new Exports_1.AudioSourceReadyEvent(_this.id));
                        _this.initializeDeferral.Resolve(true);
                    }, function (error) {
                        var errorMsg = "Error occurred during microphone initialization: " + error;
                        var tmp = _this.initializeDeferral;
                        // HACK: this should be handled through onError callbacks of all promises up the stack.
                        // Unfortunately, the current implementation does not provide an easy way to reject promises
                        // without a lot of code replication.
                        // TODO: fix promise implementation, allow for a graceful reject chaining.
                        _this.initializeDeferral = null;
                        tmp.Reject(errorMsg); // this will bubble up through the whole chain of promises,
                        // with each new level adding extra "Unhandled callback error" prefix to the error message.
                        // The following line is not guaranteed to be executed.
                        _this.OnEvent(new Exports_1.AudioSourceErrorEvent(_this.id, errorMsg));
                    });
                };
                if (_this.context.state === "suspended") {
                    // NOTE: On iOS, the Web Audio API requires sounds to be triggered from an explicit user action.
                    // https://github.com/WebAudio/web-audio-api/issues/790
                    _this.context.resume().then(next, function (reason) {
                        _this.initializeDeferral.Reject("Failed to initialize audio context: " + reason);
                    });
                }
                else {
                    next();
                }
            }
            return _this.initializeDeferral.Promise();
        };
        this.Id = function () {
            return _this.id;
        };
        this.Attach = function (audioNodeId) {
            _this.OnEvent(new Exports_1.AudioStreamNodeAttachingEvent(_this.id, audioNodeId));
            return _this.Listen(audioNodeId).OnSuccessContinueWith(function (streamReader) {
                _this.OnEvent(new Exports_1.AudioStreamNodeAttachedEvent(_this.id, audioNodeId));
                return {
                    Detach: function () {
                        streamReader.Close();
                        delete _this.streams[audioNodeId];
                        _this.OnEvent(new Exports_1.AudioStreamNodeDetachedEvent(_this.id, audioNodeId));
                        _this.TurnOff();
                    },
                    Id: function () {
                        return audioNodeId;
                    },
                    Read: function () {
                        return streamReader.Read();
                    },
                };
            });
        };
        this.Detach = function (audioNodeId) {
            if (audioNodeId && _this.streams[audioNodeId]) {
                _this.streams[audioNodeId].Close();
                delete _this.streams[audioNodeId];
                _this.OnEvent(new Exports_1.AudioStreamNodeDetachedEvent(_this.id, audioNodeId));
            }
        };
        this.TurnOff = function () {
            for (var streamId in _this.streams) {
                if (streamId) {
                    var stream = _this.streams[streamId];
                    if (stream) {
                        stream.Close();
                    }
                }
            }
            _this.OnEvent(new Exports_1.AudioSourceOffEvent(_this.id)); // no stream now
            _this.initializeDeferral = null;
            _this.DestroyAudioContext();
            return Exports_1.PromiseHelper.FromResult(true);
        };
        this.Listen = function (audioNodeId) {
            return _this.TurnOn()
                .OnSuccessContinueWith(function (_) {
                var stream = new Exports_1.Stream(audioNodeId);
                _this.streams[audioNodeId] = stream;
                try {
                    _this.recorder.Record(_this.context, _this.mediaStream, stream);
                }
                catch (error) {
                    _this.OnEvent(new Exports_1.AudioStreamNodeErrorEvent(_this.id, audioNodeId, error));
                    throw error;
                }
                return stream.GetReader();
            });
        };
        this.OnEvent = function (event) {
            _this.events.OnEvent(event);
            Exports_1.Events.Instance.OnEvent(event);
        };
        this.CreateAudioContext = function () {
            if (!!_this.context) {
                return;
            }
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
            var AudioContext = (window.AudioContext)
                || (window.webkitAudioContext)
                || false;
            if (!AudioContext) {
                throw new Error("Browser does not support Web Audio API (AudioContext is not available).");
            }
            _this.context = new AudioContext();
        };
        this.DestroyAudioContext = function () {
            if (!_this.context) {
                return;
            }
            _this.recorder.ReleaseMediaResources(_this.context);
            if ("close" in _this.context) {
                _this.context.close();
                _this.context = null;
            }
            else if (_this.context.state === "running") {
                // Suspend actually takes a callback, but analogous to the
                // resume method, it'll be only fired if suspend is called
                // in a direct response to a user action. The later is not always
                // the case, as TurnOff is also called, when we receive an
                // end-of-speech message from the service. So, doing a best effort
                // fire-and-forget here.
                _this.context.suspend();
            }
        };
        this.id = audioSourceId ? audioSourceId : Exports_1.CreateNoDashGuid();
        this.events = new Exports_1.EventSource();
        this.recorder = recorder;
    }
    Object.defineProperty(MicAudioSource.prototype, "Events", {
        get: function () {
            return this.events;
        },
        enumerable: true,
        configurable: true
    });
    return MicAudioSource;
}());
exports.MicAudioSource = MicAudioSource;

//# sourceMappingURL=MicAudioSource.js.map
