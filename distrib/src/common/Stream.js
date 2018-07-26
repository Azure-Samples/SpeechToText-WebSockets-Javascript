"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = require("./Error");
var Guid_1 = require("./Guid");
var Queue_1 = require("./Queue");
var Stream = /** @class */ (function () {
    function Stream(streamId) {
        var _this = this;
        this.readerIdCounter = 1;
        this.isEnded = false;
        this.Write = function (buffer) {
            _this.ThrowIfClosed();
            _this.WriteStreamChunk({
                Buffer: buffer,
                IsEnd: false,
            });
        };
        this.GetReader = function () {
            var readerId = _this.readerIdCounter;
            _this.readerIdCounter++;
            var readerQueue = new Queue_1.Queue();
            var currentLength = _this.streambuffer.length;
            _this.readerQueues[readerId] = readerQueue;
            for (var i = 0; i < currentLength; i++) {
                readerQueue.Enqueue(_this.streambuffer[i]);
            }
            return new StreamReader(_this.id, readerQueue, function () {
                delete _this.readerQueues[readerId];
            });
        };
        this.Close = function () {
            if (!_this.isEnded) {
                _this.WriteStreamChunk({
                    Buffer: null,
                    IsEnd: true,
                });
                _this.isEnded = true;
            }
        };
        this.WriteStreamChunk = function (streamChunk) {
            _this.ThrowIfClosed();
            _this.streambuffer.push(streamChunk);
            for (var readerId in _this.readerQueues) {
                if (!_this.readerQueues[readerId].IsDisposed()) {
                    try {
                        _this.readerQueues[readerId].Enqueue(streamChunk);
                    }
                    catch (e) {
                        // Do nothing
                    }
                }
            }
        };
        this.ThrowIfClosed = function () {
            if (_this.isEnded) {
                throw new Error_1.InvalidOperationError("Stream closed");
            }
        };
        this.id = streamId ? streamId : Guid_1.CreateNoDashGuid();
        this.streambuffer = [];
        this.readerQueues = {};
    }
    Object.defineProperty(Stream.prototype, "IsClosed", {
        get: function () {
            return this.isEnded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    return Stream;
}());
exports.Stream = Stream;
// tslint:disable-next-line:max-classes-per-file
var StreamReader = /** @class */ (function () {
    function StreamReader(streamId, readerQueue, onClose) {
        var _this = this;
        this.isClosed = false;
        this.Read = function () {
            if (_this.IsClosed) {
                throw new Error_1.InvalidOperationError("StreamReader closed");
            }
            return _this.readerQueue
                .Dequeue()
                .OnSuccessContinueWith(function (streamChunk) {
                if (streamChunk.IsEnd) {
                    _this.readerQueue.Dispose("End of stream reached");
                }
                return streamChunk;
            });
        };
        this.Close = function () {
            if (!_this.isClosed) {
                _this.isClosed = true;
                _this.readerQueue.Dispose("StreamReader closed");
                _this.onClose();
            }
        };
        this.readerQueue = readerQueue;
        this.onClose = onClose;
        this.streamId = streamId;
    }
    Object.defineProperty(StreamReader.prototype, "IsClosed", {
        get: function () {
            return this.isClosed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamReader.prototype, "StreamId", {
        get: function () {
            return this.streamId;
        },
        enumerable: true,
        configurable: true
    });
    return StreamReader;
}());
exports.StreamReader = StreamReader;

//# sourceMappingURL=Stream.js.map
