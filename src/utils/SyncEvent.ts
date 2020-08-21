export class SyncEvent {
    subscriber: (value: any) => void;
    subscribers = new Map<string, (value: any) => void>();

    subscribe(id: string, callback: (value: any) => void) {
        this.subscribers.set(id, callback);
    }

    unsubscribe(id: string) {
        this.subscribers.delete(id);
    }

    emit(value: any) {
        this.subscriber && this.subscriber(value);
        this.subscribers.forEach(s => s(value));
    }
}