
/**
 * Provides mechanism to perform cleanup operations at the end of the instance lifetime.
 *
 * @export
 * @interface IDisposable
 */
export interface IDisposable {

    /**
     * Indicates if the current instance is disposed.
     *
     * @readonly
     * @type {boolean}
     * @memberof EventSource
     */
    IsDisposed: boolean;

    /**
     * Disposes the current instance and performs the cleanup operations associated.
     *
     * @param {string} [reason] optional reason for disposing the instance.
     * This will be used to throw errors when a operations are performed on the disposed object.
     *
     * @memberOf IDisposable
     */
    Dispose(reason?: string): void;
}
