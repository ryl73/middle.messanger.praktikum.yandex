import EventBus from '@/utils/eventBus.ts';
import type { ResourcesResponseData } from '@/api/ResourcesApi.ts';

export type WSMessage = {
	chat_id: number;
	content: string;
	file: ResourcesResponseData | null;
	id: number;
	is_read: boolean;
	time: string;
	type: WSMessageType;
	user_id: number;
};

export const WSMessageType = {
	MESSAGE: 'message',
	FILE: 'file',
	STICKER: 'sticker',
	GET_OLD: 'get old',
	PING: 'ping',
	PONG: 'pong',
	USER_CONNECTED: 'user connected',
} as const;

export type WSMessageType = (typeof WSMessageType)[keyof typeof WSMessageType];

export const WSEvents = {
	OPEN: 'open',
	CLOSE: 'close',
	MESSAGE: 'message',
	ERROR: 'error',
} as const;

export default class WebSocketService extends EventBus {
	private socket: WebSocket | null = null;
	private readonly url: string;
	private _interval: NodeJS.Timeout | null = null;
	private reconnectInterval = 3000;

	constructor(url: string) {
		super();
		this.url = url;
	}

	public connect(): void {
		this.socket = new WebSocket(this.url);

		this.socket.addEventListener(WSEvents.OPEN, () => {
			this.emit(WSEvents.OPEN);
			this._interval = setInterval(() => this.ping(), this.reconnectInterval);
		});

		this.socket.addEventListener(WSEvents.MESSAGE, (event: MessageEvent) => {
			const data: string = event.data;
			const dataJSON = JSON.parse(data);
			if (dataJSON.type !== WSMessageType.PONG) {
				this.emit(WSEvents.MESSAGE, dataJSON);
			}
		});

		this.socket.addEventListener(WSEvents.ERROR, (event: Event) => {
			this.emit(WSEvents.ERROR, event);
		});

		this.socket.addEventListener(WSEvents.CLOSE, (event: CloseEvent) => {
			this.emit(WSEvents.CLOSE, event);
		});
	}

	public ping(): void {
		this.send(WSMessageType.PING);
	}

	public disconnect(): void {
		this.socket?.close();
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
		}
		this.socket = null;
	}

	public send(type: WSMessageType = WSMessageType.MESSAGE, content?: string): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			const data = {
				content,
				type,
			};
			this.socket.send(JSON.stringify(data));
		} else {
			this.emit(WSEvents.ERROR, { message: 'WebSocket is not connected' });
		}
	}

	public isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN;
	}
}
