import WebSocketService, { WSEvents, type WSMessage } from '@/services/WebSocketService.ts';
import store from '@/store/store.ts';
import type { EventCallback } from '@/utils/eventBus.ts';

export class ChatWebSocket extends WebSocketService {
	static BASE_URL: string = 'wss://ya-praktikum.tech/ws/chats';
	public onOpen?: () => void;
	public onClose?: () => void;
	public onError?: (e: Event) => void;
	public onMessage?: (data: WSMessage | WSMessage[]) => void;

	constructor(chatId: number, token: string) {
		const userId = store.getState().user?.id;
		const url = `${ChatWebSocket.BASE_URL}/${userId}/${chatId}/${token}`;

		super(url);
		this._registerEvents();
	}

	private _registerEvents() {
		this.on(WSEvents.OPEN, this._onOpen.bind(this) as EventCallback);
		this.on(WSEvents.MESSAGE, this._onMessage.bind(this) as EventCallback);
		this.on(WSEvents.CLOSE, this._onClose.bind(this) as EventCallback);
		this.on(WSEvents.ERROR, this._onError.bind(this) as EventCallback);
	}

	private _removeEvents() {
		this.off(WSEvents.OPEN, this._onOpen.bind(this) as EventCallback);
		this.off(WSEvents.MESSAGE, this._onMessage.bind(this) as EventCallback);
		this.off(WSEvents.CLOSE, this._onClose.bind(this) as EventCallback);
		this.off(WSEvents.ERROR, this._onError.bind(this) as EventCallback);
	}

	private _onOpen() {
		this.onOpen?.();
	}

	private _onClose() {
		this.onClose?.();
	}

	private _onMessage(data: WSMessage | WSMessage[]) {
		this.onMessage?.(data);
	}

	private _onError(e: Event) {
		console.error('[ChatWebSocket] Error:', e);
		this.onError?.(e);
	}

	override disconnect() {
		this._removeEvents();
		super.disconnect();
	}
}
