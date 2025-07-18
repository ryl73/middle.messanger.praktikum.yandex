import store from '@/store/store.ts';
import ChatAPI, {
	type ChatCreateRequestData,
	type ChatGetListRequestData,
	type ChatGetUsersRequestData,
} from '@/api/ChatAPI.ts';
import { WSMessageType } from '@/services/WebSocketService.ts';
import { ChatWebSocket } from '@/utils/ChatWebSocket.ts';
import ErrorHandler from '@/services/ErrorHandler.ts';

const api = new ChatAPI();

export default class ChatController {
	public async getList({ offset, title, limit = 12 }: ChatGetListRequestData) {
		try {
			const chats = await api.getList({ data: { title, limit, offset } });
			store.set('chats', chats);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}

	public async create(data: ChatCreateRequestData) {
		try {
			const id = await api.create({ data });
			await this.getList({});
			store.set('selectedChatId', id);
		} catch (e) {
			ErrorHandler.handle(e);
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
			ErrorHandler.handle(e);
		}
	}

	public async connect() {
		try {
			store.set('messages', undefined);
			const oldWS = store.getState().ws as ChatWebSocket;
			oldWS?.disconnect();
			store.set('ws', undefined);

			const chatId = store.getState().selectedChatId;
			const { token } = await api.getToken(chatId);
			const ws = new ChatWebSocket(chatId!, token);

			ws.onMessage = (messages) => {
				if (!Array.isArray(messages)) {
					if (messages.type === WSMessageType.USER_CONNECTED) {
						ws.send(WSMessageType.GET_OLD, '0');
						store.set('messages', undefined);
						return;
					}
					const oldMessages = store.getState().messages;
					store.set('messages', [messages, ...oldMessages]);
				} else {
					store.set('messages', messages);
				}

				const scrollContainer = document.querySelector('.chats-main__content');
				if (scrollContainer instanceof HTMLElement) {
					scrollContainer.scrollTop = scrollContainer.scrollHeight;
				}
			};

			ws.connect();
			store.set('ws', ws);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}

	public async sendMessage(data: { message: string }) {
		try {
			const ws = store.getState().ws as ChatWebSocket;
			ws.send(WSMessageType.MESSAGE, data.message);
		} catch (e) {
			ErrorHandler.handle(e);
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
			ErrorHandler.handle(e);
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
			ErrorHandler.handle(e);
		}
	}

	public async getUsers({ name, email, offset, limit = 12 }: ChatGetUsersRequestData) {
		try {
			const chatId = store.getState().selectedChatId;
			const users = await api.getUsers(chatId, { data: { limit, offset, name, email } });
			store.set('userSearchList', users);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}
}
