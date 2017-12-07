export interface IDisposable {
    IsDisposed(): boolean;
    Dispose(reason?: string): void;
}
