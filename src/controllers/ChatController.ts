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
	private observer: IntersectionObserver | null = null;
	private sentinel: Element | null = null;

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
			scrollBottom();
			const oldWS = store.getState().ws as ChatWebSocket;
			oldWS?.disconnect();
			store.set('ws', undefined);

			const chatId = store.getState().selectedChatId;
			const { token } = await api.getToken(chatId);
			const ws = new ChatWebSocket(chatId!, token);

			function scrollBottom() {
				const scrollContainer = document.querySelector('.chats-main__content');
				if (scrollContainer instanceof HTMLElement) {
					scrollContainer.scrollTop = scrollContainer.scrollHeight;
				}
			}

			ws.onOpen = () => {
				const oldMessages = store.getState().messages;
				const isAllMessages = store.getState().isAllMessages;
				if (!oldMessages || !oldMessages[chatId]) {
					ws.send(WSMessageType.GET_OLD, '0');
				}
				if (!isAllMessages || !isAllMessages[chatId]) {
					this.observe();
				}
			};

			ws.onMessage = (messages) => {
				if (!Array.isArray(messages)) {
					if (messages.type === WSMessageType.USER_CONNECTED) {
						ws.send(WSMessageType.GET_OLD, '0');
						store.set(`messages.${chatId}`, undefined);
						return;
					}
					const oldMessages = store.getState().messages[chatId];
					store.set(`messages.${chatId}`, [messages, ...oldMessages]);
				} else {
					const oldMessages = store.getState().messages;
					if (oldMessages && oldMessages[chatId]) {
						const scrollContainer = document.querySelector('.chats-main__content');
						if (!scrollContainer) return;
						const prevScrollHeight = scrollContainer.scrollHeight;

						store.set(`messages.${chatId}`, [...oldMessages[chatId], ...messages]);

						requestAnimationFrame(() => {
							const newScrollHeight = scrollContainer.scrollHeight;
							scrollContainer.scrollTop = newScrollHeight - prevScrollHeight + 10;
						});

						if (messages.length < 20) {
							this.observer?.unobserve(this.sentinel!);
							this.observer = null;
							store.set(`isAllMessages.${chatId}`, true);
						}
					} else {
						store.set(`messages.${chatId}`, messages);
					}
				}
				scrollBottom();
			};

			ws.connect();
			store.set('ws', ws);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}

	public observe() {
		this.observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					const ws = store.getState().ws as ChatWebSocket;
					ws.send(WSMessageType.GET_OLD, '20');
				}
			},
			{
				root: document.querySelector('.chats-main__content'),
				rootMargin: '0px',
				threshold: 0.1,
			}
		);

		this.sentinel = document.querySelector('#top-sentinel');
		if (this.sentinel) {
			setTimeout(() => {
				this.observer?.observe(this.sentinel!);
			}, 100);
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

	public async getNewMessages() {
		try {
			const chatId = store.getState().selectedChatId;
			const { unread_count } = await api.getNewMessages(chatId, {});
			return unread_count;
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}
}
