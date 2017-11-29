export class ArgumentNullError extends Error {
    constructor(argumentName) {
        super(argumentName);
        this.name = "ArgumentNull";
        this.message = argumentName;
    }
}
export class InvalidOperationError extends Error {
    constructor(error) {
        super(error);
        this.name = "InvalidOperation";
        this.message = error;
    }
}
export class ObjectDisposedError extends Error {
    constructor(objectName, error) {
        super(error);
        this.name = objectName + "ObjectDisposed";
        this.message = error;
    }
}

//# sourceMappingURL=Error.js.map
