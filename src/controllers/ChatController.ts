import store from '@/store/store.ts';
import ChatAPI, {
	type ChatCreateRequestData,
	type ChatGetListRequestData,
	type ChatGetListResponseData,
	type ChatGetUsersRequestData,
} from '@/api/ChatAPI.ts';
import { WSMessageType } from '@/services/WebSocketService.ts';
import { ChatWebSocket } from '@/utils/ChatWebSocket.ts';

const api = new ChatAPI();

export default class ChatController {
	public async getList({ offset, title, limit = 12 }: ChatGetListRequestData) {
		try {
			const chats = await api.getList({ data: { title, limit, offset } });
			const oldChats = store.getState().chats;
			if (!oldChats && oldChats.length > 0) {
				store.set('chats', chats);
				chats.forEach((chat) => this.connectChat(chat.id));
			}
			store.set('chats', chats);
		} catch (e) {
			console.log(e);
		}
	}

	public async create(data: ChatCreateRequestData) {
		try {
			const id = await api.create({ data });
			await this.getList({});
			store.set('selectedChatId', id);
		} catch (e) {
			console.log(e);
		}
	}

	public async delete() {
		try {
			const chatId = store.getState().selectedChatId;
			if (chatId) {
				await api.delete({ data: { chatId } });
				await this.getList({});
				store.set('selectedChatId', undefined);
			}
		} catch (e) {
			console.log(e);
		}
	}

	public async connectChat(chatId: number) {
		const { token } = await api.getToken(chatId);
		const ws = new ChatWebSocket(chatId, token);

		ws.onMessage = (messages) => {
			if (messages.type === WSMessageType.USER_CONNECTED) {
				ws.send(WSMessageType.GET_OLD, '0');
				store.set('messages', undefined);
				return;
			}
			const oldMessages = store.getState().messages;
			if (oldMessages && oldMessages.length > 0) {
				store.set('messages', [messages, ...oldMessages]);
				this.getList({});
			} else {
				store.set('messages', messages);
			}
		};

		ws.connect();
	}

	public async connect() {
		try {
			store.set('messages', undefined);
			const oldWS = store.getState().ws as ChatWebSocket;
			oldWS?.disconnect();
			store.set('ws', undefined);

			const chatId = store.getState().selectedChatId;
			const { token } = await api.getToken(chatId);
			const ws = new ChatWebSocket(chatId, token);

			ws.onMessage = (messages) => {
				if (messages.type === WSMessageType.USER_CONNECTED) {
					ws.send(WSMessageType.GET_OLD, '0');
					store.set('messages', undefined);
					return;
				}
				const oldMessages = store.getState().messages;
				if (oldMessages && oldMessages.length > 0) {
					store.set('messages', [messages, ...oldMessages]);
					this.getList({});
				} else {
					store.set('messages', messages);
				}
			};

			ws.connect();
			store.set('ws', ws);
		} catch (e) {
			console.log(e);
		}
	}

	public async sendMessage(data: { message: string }) {
		try {
			const ws = store.getState().ws as ChatWebSocket;
			ws.send(WSMessageType.MESSAGE, data.message);
		} catch (e) {
			console.log(e);
		}
	}

	public async addUser(users: number[]) {
		try {
			const chatId: number = store.getState().selectedChatId;
			const data = {
				users,
				chatId,
			};
			await api.addUser({ data });
		} catch (e) {
			console.log(e);
		}
	}

	public async deleteUser(users: number[]) {
		try {
			const chatId: number = store.getState().selectedChatId;
			const data = {
				users,
				chatId,
			};
			await api.deleteUser({ data });
		} catch (e) {
			console.log(e);
		}
	}

	public async getUsers({ name, email, offset, limit = 12 }: ChatGetUsersRequestData) {
		try {
			const chatId = store.getState().selectedChatId;
			const users = await api.getUsers(chatId, { data: { limit, offset, name, email } });
			store.set('userSearchList', users);
		} catch (e) {
			console.log(e);
		}
	}
}
