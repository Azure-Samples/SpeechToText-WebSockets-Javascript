import { ArgumentNullError, ConnectionClosedEvent, ConnectionEstablishedEvent, ConnectionEstablishErrorEvent, ConnectionMessageReceivedEvent, ConnectionMessageSentEvent, ConnectionOpenResponse, ConnectionStartEvent, ConnectionState, Deferred, Events, EventSource, MessageType, PromiseHelper, Queue, RawWebsocketMessage, } from "../common/Exports";
export class WebsocketMessageAdapter {
    constructor(uri, connectionId, messageFormatter) {
        this.Open = () => {
            if (this.connectionState === ConnectionState.Disconnected) {
                return PromiseHelper.FromError(`Cannot open a connection that is in ${this.connectionState} state`);
            }
            if (this.connectionEstablishDeferral) {
                return this.connectionEstablishDeferral.Promise();
            }
            this.connectionEstablishDeferral = new Deferred();
            this.connectionState = ConnectionState.Connecting;
            this.websocketClient = new WebSocket(this.uri);
            this.receivingMessageQueue = new Queue();
            this.disconnectDeferral = new Deferred();
            this.sendMessageQueue = new Queue();
            this.ProcessSendQueue();
            this.OnEvent(new ConnectionStartEvent(this.connectionId, this.uri));
            this.websocketClient.onopen = (e) => {
                this.connectionState = ConnectionState.Connected;
                this.OnEvent(new ConnectionEstablishedEvent(this.connectionId));
                this.connectionEstablishDeferral.Resolve(new ConnectionOpenResponse(200, ""));
            };
            this.websocketClient.onerror = (e) => {
                if (this.connectionState !== ConnectionState.Connecting) {
                }
            };
            this.websocketClient.onclose = (e) => {
                if (this.connectionState === ConnectionState.Connecting) {
                    this.connectionState = ConnectionState.Disconnected;
                    this.OnEvent(new ConnectionEstablishErrorEvent(this.connectionId, e.code, e.reason));
                    this.connectionEstablishDeferral.Resolve(new ConnectionOpenResponse(e.code, e.reason));
                }
                else {
                    this.OnEvent(new ConnectionClosedEvent(this.connectionId, e.code, e.reason));
                }
                this.OnClose(e.code, e.reason);
            };
            this.websocketClient.onmessage = (e) => {
                const networkReceivedTime = new Date().toISOString();
                if (this.connectionState === ConnectionState.Connected) {
                    const deferred = new Deferred();
                    this.receivingMessageQueue.EnqueueFromPromise(deferred.Promise());
                    if (e.data instanceof Blob) {
                        const fileReader = new FileReader();
                        fileReader.onload = (le) => {
                            const rawMessage = new RawWebsocketMessage(MessageType.Binary, fileReader.result);
                            this.messageFormatter
                                .ToConnectionMessage(rawMessage)
                                .On((connectionMessage) => {
                                this.OnEvent(new ConnectionMessageReceivedEvent(this.connectionId, networkReceivedTime, connectionMessage));
                                deferred.Resolve(connectionMessage);
                            }, (error) => {
                                deferred.Reject(`Invalid binary message format. Error: ${error}`);
                            });
                        };
                        fileReader.onerror = (ev) => {
                            deferred.Reject("Binary message parse error");
                        };
                        fileReader.readAsArrayBuffer(e.data);
                    }
                    else {
                        const rawMessage = new RawWebsocketMessage(MessageType.Text, e.data);
                        this.messageFormatter
                            .ToConnectionMessage(rawMessage)
                            .On((connectionMessage) => {
                            this.OnEvent(new ConnectionMessageReceivedEvent(this.connectionId, networkReceivedTime, connectionMessage));
                            deferred.Resolve(connectionMessage);
                        }, (error) => {
                            deferred.Reject(`Invalid text message format. Error: ${error}`);
                        });
                    }
                }
            };
            return this.connectionEstablishDeferral.Promise();
        };
        this.Send = (message) => {
            if (this.connectionState !== ConnectionState.Connected) {
                return PromiseHelper.FromError(`Cannot send on connection that is in ${this.connectionState} state`);
            }
            const messageSendStatusDeferral = new Deferred();
            const messageSendDeferral = new Deferred();
            this.sendMessageQueue.EnqueueFromPromise(messageSendDeferral.Promise());
            this.messageFormatter
                .FromConnectionMessage(message)
                .On((rawMessage) => {
                messageSendDeferral.Resolve({
                    Message: message,
                    RawWebsocketMessage: rawMessage,
                    SendStatusDeferral: messageSendStatusDeferral,
                });
            }, (error) => {
                messageSendDeferral.Reject(`Error formatting the message. ${error}`);
            });
            return messageSendStatusDeferral.Promise();
        };
        this.Read = () => {
            if (this.connectionState !== ConnectionState.Connected) {
                return PromiseHelper.FromError(`Cannot read on connection that is in ${this.connectionState} state`);
            }
            return this.receivingMessageQueue.Dequeue();
        };
        this.Close = (reason) => {
            if (this.websocketClient) {
                if (this.connectionState !== ConnectionState.Connected) {
                    this.websocketClient.close(1000, reason ? reason : "Normal closure by client");
                }
            }
            else {
                const deferral = new Deferred();
                deferral.Resolve(true);
                return deferral.Promise();
            }
            return this.disconnectDeferral.Promise();
        };
        this.SendRawMessage = (sendItem) => {
            try {
                this.OnEvent(new ConnectionMessageSentEvent(this.connectionId, new Date().toISOString(), sendItem.Message));
                this.websocketClient.send(sendItem.RawWebsocketMessage.Payload);
                return PromiseHelper.FromResult(true);
            }
            catch (e) {
                return PromiseHelper.FromError(`websocket send error: ${e}`);
            }
        };
        this.OnClose = (code, reason) => {
            const closeReason = `Connection closed. ${code}: ${reason}`;
            this.connectionState = ConnectionState.Disconnected;
            this.disconnectDeferral.Resolve(true);
            this.receivingMessageQueue.Dispose(reason);
            this.receivingMessageQueue.DrainAndDispose((pendingReceiveItem) => {
            }, closeReason);
            this.sendMessageQueue.DrainAndDispose((pendingSendItem) => {
                pendingSendItem.SendStatusDeferral.Reject(closeReason);
            }, closeReason);
        };
        this.ProcessSendQueue = () => {
            this.sendMessageQueue
                .Dequeue()
                .On((sendItem) => {
                this.SendRawMessage(sendItem)
                    .On((result) => {
                    sendItem.SendStatusDeferral.Resolve(result);
                    this.ProcessSendQueue();
                }, (sendError) => {
                    sendItem.SendStatusDeferral.Reject(sendError);
                    this.ProcessSendQueue();
                });
            }, (error) => {
            });
        };
        this.OnEvent = (event) => {
            this.connectionEvents.OnEvent(event);
            Events.Instance.OnEvent(event);
        };
        if (!uri) {
            throw new ArgumentNullError("uri");
        }
        if (!messageFormatter) {
            throw new ArgumentNullError("messageFormatter");
        }
        this.connectionEvents = new EventSource();
        this.connectionId = connectionId;
        this.messageFormatter = messageFormatter;
        this.connectionState = ConnectionState.None;
        this.uri = uri;
    }
    get State() {
        return this.connectionState;
    }
    get Events() {
        return this.connectionEvents;
    }
}

//# sourceMappingURL=WebsocketMessageAdapter.js.map
