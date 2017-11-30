export declare class ArgumentNullError extends Error {
    constructor(argumentName: string);
}
export declare class InvalidOperationError extends Error {
    constructor(error: string);
}
export declare class ObjectDisposedError extends Error {
    constructor(objectName: string, error?: string);
}
