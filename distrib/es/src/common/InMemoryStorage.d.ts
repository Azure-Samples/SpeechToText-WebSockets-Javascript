import { IKeyValueStorage } from "./IKeyValueStorage";
export declare class InMemoryStorage implements IKeyValueStorage {
    private store;
    Get: (key: string) => string;
    GetOrAdd: (key: string, valueToAdd: string) => string;
    Set: (key: string, value: string) => void;
    Remove: (key: string) => void;
}
