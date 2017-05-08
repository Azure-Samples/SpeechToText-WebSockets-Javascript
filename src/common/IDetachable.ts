
/**
 * Provies mechanism for detaching a child resource from its parent.
 *
 * @export
 * @interface IDetachable
 */
export interface IDetachable {
    /**
     * Performs the detach operation.
     *
     * @memberof IDetachable
     */
    Detach(): void;
}
