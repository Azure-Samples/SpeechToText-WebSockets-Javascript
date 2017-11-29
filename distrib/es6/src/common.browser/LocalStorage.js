import { ArgumentNullError } from "../common/Exports";
export class LocalStorage {
    constructor() {
        this.Get = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            return localStorage.getItem(key);
        };
        this.GetOrAdd = (key, valueToAdd) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            const value = localStorage.getItem(key);
            if (value === null || value === undefined) {
                localStorage.setItem(key, valueToAdd);
            }
            return localStorage.getItem(key);
        };
        this.Set = (key, value) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            localStorage.setItem(key, value);
        };
        this.Remove = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            localStorage.removeItem(key);
        };
    }
}

//# sourceMappingURL=LocalStorage.js.map
