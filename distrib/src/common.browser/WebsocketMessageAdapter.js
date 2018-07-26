"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var WebsocketMessageAdapter = /** @class */ (function () {
    function WebsocketMessageAdapter(uri, connectionId, messageFormatter) {
        var _this = this;
        this.Open = function () {
            if (_this.connectionState === Exports_1.ConnectionState.Disconnected) {
                return Exports_1.PromiseHelper.FromError("Cannot open a connection that is in " + _this.connectionState + " state");
            }
            if (_this.connectionEstablishDeferral) {
                return _this.connectionEstablishDeferral.Promise();
            }
            _this.connectionEstablishDeferral = new Exports_1.Deferred();
            _this.connectionState = Exports_1.ConnectionState.Connecting;
            _this.websocketClient = new WebSocket(_this.uri);
            _this.websocketClient.binaryType = "arraybuffer";
            _this.receivingMessageQueue = new Exports_1.Queue();
            _this.disconnectDeferral = new Exports_1.Deferred();
            _this.sendMessageQueue = new Exports_1.Queue();
            _this.ProcessSendQueue();
            _this.OnEvent(new Exports_1.ConnectionStartEvent(_this.connectionId, _this.uri));
            _this.websocketClient.onopen = function (e) {
                _this.connectionState = Exports_1.ConnectionState.Connected;
                _this.OnEvent(new Exports_1.ConnectionEstablishedEvent(_this.connectionId));
                _this.connectionEstablishDeferral.Resolve(new Exports_1.ConnectionOpenResponse(200, ""));
            };
            _this.websocketClient.onerror = function (e) {
                // TODO: Understand what this is error is. Will we still get onClose ?
                if (_this.connectionState !== Exports_1.ConnectionState.Connecting) {
                    // TODO: Is this required ?
                    // this.OnEvent(new ConnectionErrorEvent(errorMsg, connectionId));
                }
            };
            _this.websocketClient.onclose = function (e) {
                if (_this.connectionState === Exports_1.ConnectionState.Connecting) {
                    _this.connectionState = Exports_1.ConnectionState.Disconnected;
                    _this.OnEvent(new Exports_1.ConnectionEstablishErrorEvent(_this.connectionId, e.code, e.reason));
                    _this.connectionEstablishDeferral.Resolve(new Exports_1.ConnectionOpenResponse(e.code, e.reason));
                }
                else {
                    _this.OnEvent(new Exports_1.ConnectionClosedEvent(_this.connectionId, e.code, e.reason));
                }
                _this.OnClose(e.code, e.reason);
            };
            _this.websocketClient.onmessage = function (e) {
                var networkReceivedTime = new Date().toISOString();
                if (_this.connectionState === Exports_1.ConnectionState.Connected) {
                    var deferred_1 = new Exports_1.Deferred();
                    // let id = ++this.idCounter;
                    _this.receivingMessageQueue.EnqueueFromPromise(deferred_1.Promise());
                    if (e.data instanceof ArrayBuffer) {
                        var rawMessage = new Exports_1.RawWebsocketMessage(Exports_1.MessageType.Binary, e.data);
                        _this.messageFormatter
                            .ToConnectionMessage(rawMessage)
                            .On(function (connectionMessage) {
                            _this.OnEvent(new Exports_1.ConnectionMessageReceivedEvent(_this.connectionId, networkReceivedTime, connectionMessage));
                            deferred_1.Resolve(connectionMessage);
                        }, function (error) {
                            // TODO: Events for these ?
                            deferred_1.Reject("Invalid binary message format. Error: " + error);
                        });
                    }
                    else {
                        var rawMessage = new Exports_1.RawWebsocketMessage(Exports_1.MessageType.Text, e.data);
                        _this.messageFormatter
                            .ToConnectionMessage(rawMessage)
                            .On(function (connectionMessage) {
                            _this.OnEvent(new Exports_1.ConnectionMessageReceivedEvent(_this.connectionId, networkReceivedTime, connectionMessage));
                            deferred_1.Resolve(connectionMessage);
                        }, function (error) {
                            // TODO: Events for these ?
                            deferred_1.Reject("Invalid text message format. Error: " + error);
                        });
                    }
                }
            };
            return _this.connectionEstablishDeferral.Promise();
        };
        this.Send = function (message) {
            if (_this.connectionState !== Exports_1.ConnectionState.Connected) {
                return Exports_1.PromiseHelper.FromError("Cannot send on connection that is in " + _this.connectionState + " state");
            }
            var messageSendStatusDeferral = new Exports_1.Deferred();
            var messageSendDeferral = new Exports_1.Deferred();
            _this.sendMessageQueue.EnqueueFromPromise(messageSendDeferral.Promise());
            _this.messageFormatter
                .FromConnectionMessage(message)
                .On(function (rawMessage) {
                messageSendDeferral.Resolve({
                    Message: message,
                    RawWebsocketMessage: rawMessage,
                    SendStatusDeferral: messageSendStatusDeferral,
                });
            }, function (error) {
                messageSendDeferral.Reject("Error formatting the message. " + error);
            });
            return messageSendStatusDeferral.Promise();
        };
        this.Read = function () {
            if (_this.connectionState !== Exports_1.ConnectionState.Connected) {
                return Exports_1.PromiseHelper.FromError("Cannot read on connection that is in " + _this.connectionState + " state");
            }
            return _this.receivingMessageQueue.Dequeue();
        };
        this.Close = function (reason) {
            if (_this.websocketClient) {
                if (_this.connectionState !== Exports_1.ConnectionState.Connected) {
                    _this.websocketClient.close(1000, reason ? reason : "Normal closure by client");
                }
            }
            else {
                var deferral = new Exports_1.Deferred();
                deferral.Resolve(true);
                return deferral.Promise();
            }
            return _this.disconnectDeferral.Promise();
        };
        this.SendRawMessage = function (sendItem) {
            try {
                _this.OnEvent(new Exports_1.ConnectionMessageSentEvent(_this.connectionId, new Date().toISOString(), sendItem.Message));
                _this.websocketClient.send(sendItem.RawWebsocketMessage.Payload);
                return Exports_1.PromiseHelper.FromResult(true);
            }
            catch (e) {
                return Exports_1.PromiseHelper.FromError("websocket send error: " + e);
            }
        };
        this.OnClose = function (code, reason) {
            var closeReason = "Connection closed. " + code + ": " + reason;
            _this.connectionState = Exports_1.ConnectionState.Disconnected;
            _this.disconnectDeferral.Resolve(true);
            _this.receivingMessageQueue.Dispose(reason);
            _this.receivingMessageQueue.DrainAndDispose(function (pendingReceiveItem) {
                // TODO: Events for these ?
                // Logger.Instance.OnEvent(new LoggingEvent(LogType.Warning, null, `Failed to process received message. Reason: ${closeReason}, Message: ${JSON.stringify(pendingReceiveItem)}`));
            }, closeReason);
            _this.sendMessageQueue.DrainAndDispose(function (pendingSendItem) {
                pendingSendItem.SendStatusDeferral.Reject(closeReason);
            }, closeReason);
        };
        this.ProcessSendQueue = function () {
            _this.sendMessageQueue
                .Dequeue()
                .On(function (sendItem) {
                _this.SendRawMessage(sendItem)
                    .On(function (result) {
                    sendItem.SendStatusDeferral.Resolve(result);
                    _this.ProcessSendQueue();
                }, function (sendError) {
                    sendItem.SendStatusDeferral.Reject(sendError);
                    _this.ProcessSendQueue();
                });
            }, function (error) {
                // do nothing
            });
        };
        this.OnEvent = function (event) {
            _this.connectionEvents.OnEvent(event);
            Exports_1.Events.Instance.OnEvent(event);
        };
        if (!uri) {
            throw new Exports_1.ArgumentNullError("uri");
        }
        if (!messageFormatter) {
            throw new Exports_1.ArgumentNullError("messageFormatter");
        }
        this.connectionEvents = new Exports_1.EventSource();
        this.connectionId = connectionId;
        this.messageFormatter = messageFormatter;
        this.connectionState = Exports_1.ConnectionState.None;
        this.uri = uri;
    }
    Object.defineProperty(WebsocketMessageAdapter.prototype, "State", {
        get: function () {
            return this.connectionState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebsocketMessageAdapter.prototype, "Events", {
        get: function () {
            return this.connectionEvents;
        },
        enumerable: true,
        configurable: true
    });
    return WebsocketMessageAdapter;
}());
exports.WebsocketMessageAdapter = WebsocketMessageAdapter;

//# sourceMappingURL=WebsocketMessageAdapter.js.map
