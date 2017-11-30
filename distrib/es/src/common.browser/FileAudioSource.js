"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var Exports_2 = require("../common.browser/Exports");
var FileAudioSource = (function () {
    function FileAudioSource(file, audioSourceId) {
        var _this = this;
        this.streams = {};
        this.TurnOn = function () {
            if (typeof FileReader === "undefined") {
                var errorMsg = "Browser does not support FileReader.";
                _this.OnEvent(new Exports_1.AudioSourceErrorEvent(errorMsg, ""));
                return Exports_1.PromiseHelper.FromError(errorMsg);
            }
            else if (_this.file.name.lastIndexOf(".wav") !== _this.file.name.length - 4) {
                var errorMsg = _this.file.name + " is not supported. Only WAVE files are allowed at the moment.";
                _this.OnEvent(new Exports_1.AudioSourceErrorEvent(errorMsg, ""));
                return Exports_1.PromiseHelper.FromError(errorMsg);
            }
            else if (_this.file.size > FileAudioSource.MAX_SIZE) {
                var errorMsg = _this.file.name + " exceeds the maximum allowed file size (" + FileAudioSource.MAX_SIZE + ").";
                _this.OnEvent(new Exports_1.AudioSourceErrorEvent(errorMsg, ""));
                return Exports_1.PromiseHelper.FromError(errorMsg);
            }
            _this.OnEvent(new Exports_1.AudioSourceInitializingEvent(_this.id));
            _this.OnEvent(new Exports_1.AudioSourceReadyEvent(_this.id));
            return Exports_1.PromiseHelper.FromResult(true);
        };
        this.Id = function () {
            return _this.id;
        };
        this.Attach = function (audioNodeId) {
            _this.OnEvent(new Exports_1.AudioStreamNodeAttachingEvent(_this.id, audioNodeId));
            return _this.Upload(audioNodeId).OnSuccessContinueWith(function (streamReader) {
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
                    if (stream && !stream.IsClosed) {
                        stream.Close();
                    }
                }
            }
            _this.OnEvent(new Exports_1.AudioSourceOffEvent(_this.id));
            return Exports_1.PromiseHelper.FromResult(true);
        };
        this.Upload = function (audioNodeId) {
            return _this.TurnOn()
                .OnSuccessContinueWith(function (_) {
                var stream = new Exports_1.Stream(audioNodeId);
                _this.streams[audioNodeId] = stream;
                var reader = new FileReader();
                var startOffset = 0;
                var endOffset = FileAudioSource.CHUNK_SIZE;
                var lastWriteTimestamp = 0;
                var processNextChunk = function (event) {
                    if (stream.IsClosed) {
                        return;
                    }
                    if (lastWriteTimestamp !== 0) {
                        var delay = Date.now() - lastWriteTimestamp;
                        if (delay < FileAudioSource.UPLOAD_INTERVAL) {
                            new Exports_2.Timer(FileAudioSource.UPLOAD_INTERVAL - delay, processNextChunk).start();
                            return;
                        }
                    }
                    stream.Write(reader.result);
                    lastWriteTimestamp = Date.now();
                    if (endOffset < _this.file.size) {
                        startOffset = endOffset;
                        endOffset = Math.min(endOffset + FileAudioSource.CHUNK_SIZE, _this.file.size);
                        var chunk_1 = _this.file.slice(startOffset, endOffset);
                        reader.readAsArrayBuffer(chunk_1);
                    }
                    else {
                        stream.Close();
                    }
                };
                reader.onload = processNextChunk;
                reader.onerror = function (event) {
                    var errorMsg = "Error occurred while processing '" + _this.file.name + "'. " + event.error;
                    _this.OnEvent(new Exports_1.AudioStreamNodeErrorEvent(_this.id, audioNodeId, event.error));
                    throw new Error(errorMsg);
                };
                var chunk = _this.file.slice(startOffset, endOffset);
                reader.readAsArrayBuffer(chunk);
                return stream.GetReader();
            });
        };
        this.OnEvent = function (event) {
            _this.events.OnEvent(event);
            Exports_1.Events.Instance.OnEvent(event);
        };
        this.id = audioSourceId ? audioSourceId : Exports_1.CreateNoDashGuid();
        this.events = new Exports_1.EventSource();
        this.file = file;
    }
    Object.defineProperty(FileAudioSource.prototype, "Events", {
        get: function () {
            return this.events;
        },
        enumerable: true,
        configurable: true
    });
    FileAudioSource.SAMPLE_RATE = 16000 * 2;
    FileAudioSource.CHUNK_SIZE = FileAudioSource.SAMPLE_RATE * 2 / 5;
    FileAudioSource.UPLOAD_INTERVAL = 200;
    FileAudioSource.MAX_SIZE = FileAudioSource.SAMPLE_RATE * 600 + 44;
    return FileAudioSource;
}());
exports.FileAudioSource = FileAudioSource;

//# sourceMappingURL=FileAudioSource.js.map
