"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exports_1 = require("../common/Exports");
var WebsocketMessageAdapter_1 = require("./WebsocketMessageAdapter");
var WebsocketConnection = /** @class */ (function () {
    function WebsocketConnection(uri, queryParameters, headers, messageFormatter, connectionId) {
        var _this = this;
        this.isDisposed = false;
        this.Dispose = function () {
            _this.isDisposed = true;
            if (_this.connectionMessageAdapter) {
                _this.connectionMessageAdapter.Close();
            }
        };
        this.IsDisposed = function () {
            return _this.isDisposed;
        };
        this.State = function () {
            return _this.connectionMessageAdapter.State;
        };
        this.Open = function () {
            return _this.connectionMessageAdapter.Open();
        };
        this.Send = function (message) {
            return _this.connectionMessageAdapter.Send(message);
        };
        this.Read = function () {
            return _this.connectionMessageAdapter.Read();
        };
        if (!uri) {
            throw new Exports_1.ArgumentNullError("uri");
        }
        if (!messageFormatter) {
            throw new Exports_1.ArgumentNullError("messageFormatter");
        }
        this.messageFormatter = messageFormatter;
        var queryParams = "";
        var i = 0;
        if (queryParameters) {
            for (var paramName in queryParameters) {
                if (paramName) {
                    queryParams += i === 0 ? "?" : "&";
                    var val = encodeURIComponent(queryParameters[paramName]);
                    queryParams += paramName + "=" + val;
                    i++;
                }
            }
        }
        if (headers) {
            for (var headerName in headers) {
                if (headerName) {
                    queryParams += i === 0 ? "?" : "&";
                    var val = encodeURIComponent(headers[headerName]);
                    queryParams += headerName + "=" + val;
                    i++;
                }
            }
        }
        this.uri = uri + queryParams;
        this.id = connectionId ? connectionId : Exports_1.CreateNoDashGuid();
        this.connectionMessageAdapter = new WebsocketMessageAdapter_1.WebsocketMessageAdapter(this.uri, this.Id, this.messageFormatter);
    }
    Object.defineProperty(WebsocketConnection.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebsocketConnection.prototype, "Events", {
        get: function () {
            return this.connectionMessageAdapter.Events;
        },
        enumerable: true,
        configurable: true
    });
    return WebsocketConnection;
}());
exports.WebsocketConnection = WebsocketConnection;

//# sourceMappingURL=WebsocketConnection.js.map
