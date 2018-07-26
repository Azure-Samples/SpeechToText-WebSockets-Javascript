import { ITimer } from "../common/Exports";
export declare class Timer implements ITimer {
    private delayInMillisec;
    private timerId;
    private successCallback;
    constructor(delayInMillisec: number, successCallback: any);
    start: (...params: any[]) => void;
    stop: () => void;
}
