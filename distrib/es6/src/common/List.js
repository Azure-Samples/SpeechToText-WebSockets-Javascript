import { ObjectDisposedError } from "./Error";
export class List {
    constructor(list) {
        this.subscriptionIdCounter = 0;
        this.addSubscriptions = {};
        this.removeSubscriptions = {};
        this.disposedSubscriptions = {};
        this.disposeReason = null;
        this.Get = (itemIndex) => {
            this.ThrowIfDisposed();
            return this.list[itemIndex];
        };
        this.First = () => {
            return this.Get(0);
        };
        this.Last = () => {
            return this.Get(this.Length() - 1);
        };
        this.Add = (item) => {
            this.ThrowIfDisposed();
            this.InsertAt(this.list.length, item);
        };
        this.InsertAt = (index, item) => {
            this.ThrowIfDisposed();
            if (index === 0) {
                this.list.unshift(item);
            }
            else if (index === this.list.length) {
                this.list.push(item);
            }
            else {
                this.list.splice(index, 0, item);
            }
            this.TriggerSubscriptions(this.addSubscriptions);
        };
        this.RemoveFirst = () => {
            this.ThrowIfDisposed();
            return this.RemoveAt(0);
        };
        this.RemoveLast = () => {
            this.ThrowIfDisposed();
            return this.RemoveAt(this.Length() - 1);
        };
        this.RemoveAt = (index) => {
            this.ThrowIfDisposed();
            return this.Remove(index, 1)[0];
        };
        this.Remove = (index, count) => {
            this.ThrowIfDisposed();
            const removedElements = this.list.splice(index, count);
            this.TriggerSubscriptions(this.removeSubscriptions);
            return removedElements;
        };
        this.Clear = () => {
            this.ThrowIfDisposed();
            this.Remove(0, this.Length());
        };
        this.Length = () => {
            this.ThrowIfDisposed();
            return this.list.length;
        };
        this.OnAdded = (addedCallback) => {
            this.ThrowIfDisposed();
            const subscriptionId = this.subscriptionIdCounter++;
            this.addSubscriptions[subscriptionId] = addedCallback;
            return {
                Detach: () => {
                    delete this.addSubscriptions[subscriptionId];
                },
            };
        };
        this.OnRemoved = (removedCallback) => {
            this.ThrowIfDisposed();
            const subscriptionId = this.subscriptionIdCounter++;
            this.removeSubscriptions[subscriptionId] = removedCallback;
            return {
                Detach: () => {
                    delete this.removeSubscriptions[subscriptionId];
                },
            };
        };
        this.OnDisposed = (disposedCallback) => {
            this.ThrowIfDisposed();
            const subscriptionId = this.subscriptionIdCounter++;
            this.disposedSubscriptions[subscriptionId] = disposedCallback;
            return {
                Detach: () => {
                    delete this.disposedSubscriptions[subscriptionId];
                },
            };
        };
        this.Join = (seperator) => {
            this.ThrowIfDisposed();
            return this.list.join(seperator);
        };
        this.ToArray = () => {
            const cloneCopy = Array();
            this.list.forEach((val) => {
                cloneCopy.push(val);
            });
            return cloneCopy;
        };
        this.Any = (callback) => {
            this.ThrowIfDisposed();
            if (callback) {
                return this.Where(callback).Length() > 0;
            }
            else {
                return this.Length() > 0;
            }
        };
        this.All = (callback) => {
            this.ThrowIfDisposed();
            return this.Where(callback).Length() === this.Length();
        };
        this.ForEach = (callback) => {
            this.ThrowIfDisposed();
            for (let i = 0; i < this.Length(); i++) {
                callback(this.list[i], i);
            }
        };
        this.Select = (callback) => {
            this.ThrowIfDisposed();
            const selectList = [];
            for (let i = 0; i < this.list.length; i++) {
                selectList.push(callback(this.list[i], i));
            }
            return new List(selectList);
        };
        this.Where = (callback) => {
            this.ThrowIfDisposed();
            const filteredList = new List();
            for (let i = 0; i < this.list.length; i++) {
                if (callback(this.list[i], i)) {
                    filteredList.Add(this.list[i]);
                }
            }
            return filteredList;
        };
        this.OrderBy = (compareFn) => {
            this.ThrowIfDisposed();
            const clonedArray = this.ToArray();
            const orderedArray = clonedArray.sort(compareFn);
            return new List(orderedArray);
        };
        this.OrderByDesc = (compareFn) => {
            this.ThrowIfDisposed();
            return this.OrderBy((a, b) => compareFn(b, a));
        };
        this.Clone = () => {
            this.ThrowIfDisposed();
            return new List(this.ToArray());
        };
        this.Concat = (list) => {
            this.ThrowIfDisposed();
            return new List(this.list.concat(list.ToArray()));
        };
        this.ConcatArray = (array) => {
            this.ThrowIfDisposed();
            return new List(this.list.concat(array));
        };
        this.IsDisposed = () => {
            return this.list == null;
        };
        this.Dispose = (reason) => {
            if (!this.IsDisposed()) {
                this.disposeReason = reason;
                this.list = null;
                this.addSubscriptions = null;
                this.removeSubscriptions = null;
                this.TriggerSubscriptions(this.disposedSubscriptions);
            }
        };
        this.ThrowIfDisposed = () => {
            if (this.IsDisposed()) {
                throw new ObjectDisposedError("List", this.disposeReason);
            }
        };
        this.TriggerSubscriptions = (subscriptions) => {
            if (subscriptions) {
                for (const subscriptionId in subscriptions) {
                    if (subscriptionId) {
                        subscriptions[subscriptionId]();
                    }
                }
            }
        };
        this.list = [];
        if (list) {
            for (const item of list) {
                this.list.push(item);
            }
        }
    }
}

//# sourceMappingURL=List.js.map
