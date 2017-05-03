namespace Common {

    /**
     * Provides representation for string dictionary
     *
     * @export
     * @interface IStringDictionary
     * @template TValue - Type of value held in the dictionary
     */
    export interface IStringDictionary<TValue> {
        [propName: string]: TValue;
    }

    /**
     * Provides representation for number dictionary
     *
     * @export
     * @interface INumberDictionary
     * @extends {Object}
     * @template TValue - Type of value held in the dictionary
     */
    export interface INumberDictionary<TValue> extends Object {
        [propName: number]: TValue;
    }
}
