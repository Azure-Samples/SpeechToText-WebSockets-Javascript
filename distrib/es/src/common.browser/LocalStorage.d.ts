import { IKeyValueStorage } from "../common/Exports";
export declare class LocalStorage implements IKeyValueStorage {
    Get: (key: string) => string;
    GetOrAdd: (key: string, valueToAdd: string) => string;
    Set: (key: string, value: string) => void;
    Remove: (key: string) => void;
}
