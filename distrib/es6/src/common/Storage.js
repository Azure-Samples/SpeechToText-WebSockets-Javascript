import { ArgumentNullError } from "./Error";
import { InMemoryStorage } from "./InMemoryStorage";
export class Storage {
    static get Session() {
        return Storage.sessionStorage;
    }
    static get Local() {
        return Storage.localStorage;
    }
}
Storage.sessionStorage = new InMemoryStorage();
Storage.localStorage = new InMemoryStorage();
Storage.SetSessionStorage = (sessionStorage) => {
    if (!sessionStorage) {
        throw new ArgumentNullError("sessionStorage");
    }
    Storage.sessionStorage = sessionStorage;
};
Storage.SetLocalStorage = (localStorage) => {
    if (!localStorage) {
        throw new ArgumentNullError("localStorage");
    }
    Storage.localStorage = localStorage;
};

//# sourceMappingURL=Storage.js.map
