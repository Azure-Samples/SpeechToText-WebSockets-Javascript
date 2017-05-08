
/**
 * Provides a representation for string dictionary
 *
 * @export
 * @interface IStringDictionary
 * @template TValue
 */
export interface IStringDictionary<TValue>  {
    [propName: string]: TValue;
}

/**
 * Provides a representation for number dictionary
 *
 * @export
 * @interface INumberDictionary
 * @extends {Object}
 * @template TValue
 */
export interface INumberDictionary<TValue> extends Object {
    [propName: number]: TValue;
}
