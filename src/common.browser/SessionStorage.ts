/// <reference path="../common/Error.ts" />
/// <reference path="../common/IKeyValueStorage.ts" />
/// <reference path="../common/IDictionary.ts" />

namespace Common.Browser {
    export class SessionStorage implements IKeyValueStorage {

        public Get = (key: string): string => {
            if (!key) {
                throw new ArgumentNullError("key");
            }

            return sessionStorage.getItem(key);
        }

        public GetOrAdd = (key: string, valueToAdd: string): string => {
            if (!key) {
                throw new ArgumentNullError("key");
            }

            const value = sessionStorage.getItem(key);
            if (value === null || value === undefined) {
                sessionStorage.setItem(key, valueToAdd);
            }

            return sessionStorage.getItem(key);
        }

        public Set = (key: string, value: string): void => {
            if (!key) {
                throw new ArgumentNullError("key");
            }

            sessionStorage.setItem(key, value);
        }

        public Remove = (key: string): void => {
            if (!key) {
                throw new ArgumentNullError("key");
            }

            sessionStorage.removeItem(key);
        }
    }
}
