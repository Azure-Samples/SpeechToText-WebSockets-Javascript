import { ArgumentNullError } from "../common/Exports";
export class SessionStorage {
    constructor() {
        this.Get = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            return sessionStorage.getItem(key);
        };
        this.GetOrAdd = (key, valueToAdd) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            const value = sessionStorage.getItem(key);
            if (value === null || value === undefined) {
                sessionStorage.setItem(key, valueToAdd);
            }
            return sessionStorage.getItem(key);
        };
        this.Set = (key, value) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            sessionStorage.setItem(key, value);
        };
        this.Remove = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            sessionStorage.removeItem(key);
        };
    }
}

//# sourceMappingURL=SessionStorage.js.map
