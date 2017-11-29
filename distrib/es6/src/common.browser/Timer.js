export class Timer {
    constructor(delayInMillisec, successCallback) {
        this.start = (...params) => {
            if (this.timerId) {
                this.stop();
            }
            this.timerId = setTimeout(this.successCallback, this.delayInMillisec, params);
        };
        this.stop = () => {
            clearTimeout(this.timerId);
        };
        this.delayInMillisec = delayInMillisec;
        this.successCallback = successCallback;
    }
}

//# sourceMappingURL=Timer.js.map
