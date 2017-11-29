import { IKeyValueStorage } from "./IKeyValueStorage";
export declare class Storage {
    private static sessionStorage;
    private static localStorage;
    static SetSessionStorage: (sessionStorage: IKeyValueStorage) => void;
    static SetLocalStorage: (localStorage: IKeyValueStorage) => void;
    static readonly Session: IKeyValueStorage;
    static readonly Local: IKeyValueStorage;
}
