import { ArgumentNullError } from "./Error";
export class InMemoryStorage {
    constructor() {
        this.store = {};
        this.Get = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            return this.store[key];
        };
        this.GetOrAdd = (key, valueToAdd) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            if (this.store[key] === undefined) {
                this.store[key] = valueToAdd;
            }
            return this.store[key];
        };
        this.Set = (key, value) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            this.store[key] = value;
        };
        this.Remove = (key) => {
            if (!key) {
                throw new ArgumentNullError("key");
            }
            if (this.store[key] !== undefined) {
                delete this.store[key];
            }
        };
    }
}

//# sourceMappingURL=InMemoryStorage.js.map
