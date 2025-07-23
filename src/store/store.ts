import EventBus from '@/utils/eventBus.ts';
import set from '@/utils/set.ts';
import type { Indexed } from '@/types/store.ts';

export const StoreEvents = {
	Updated: 'updated',
} as const;

type StoreEvents = (typeof StoreEvents)[keyof typeof StoreEvents];

class Store extends EventBus {
	private state: Indexed = {};

	public getState() {
		return this.state;
	}

	public set(path: string, value: unknown) {
		set(this.state, path, value);
		this.emit(StoreEvents.Updated);
	}
}

export default new Store();
