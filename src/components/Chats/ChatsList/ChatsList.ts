import Block from '@/services/Block.ts';
import ChatsListTemplate from './ChatsList.hbs?raw';
import type { ChatGetListResponseData, LastMessage } from '@/api/ChatAPI.ts';
import isEqual from '@/utils/isEqual.ts';
import ChatItem from '@/components/Chats/ChatItem/ChatItem.ts';
import { getTime } from '@/utils/getTime.ts';
import ChatController from '@/controllers/ChatController.ts';
import store from '@/store/store.ts';
import connect from '@/store/connect';
import cloneDeep from '@/utils/cloneDeep.ts';

type ChatsListProps = {
	chats?: ChatGetListResponseData[];
	chatTitleSearch?: string;
};

function getLastMessageContent(lastMessage: LastMessage | null): string {
	if (!lastMessage) {
		return '';
	}

	if (
		lastMessage.content.includes('.jpg') ||
		lastMessage.content.includes('.png') ||
		lastMessage.content.includes('.svg')
	) {
		return 'Изображение';
	}

	return lastMessage.content;
}

function getLastMessageAuthor(lastMessage: LastMessage | null): string | undefined {
	if (!lastMessage) {
		return '';
	}
	const userLogin = store.getState().user?.login;
	if (lastMessage.user.login === userLogin) {
		return 'Вы';
	}

	return undefined;
}

const setChatList = (chats: ChatGetListResponseData[]) => {
	const ChatList = chats.map((chat) => {
		return new ChatItem({
			id: chat.id,
			avatar: chat.avatar,
			title: chat.title,
			unreadCount: chat.unread_count > 0 ? chat.unread_count : undefined,
			lastMessageContent: getLastMessageContent(chat.last_message),
			lastMessageAuthor: getLastMessageAuthor(chat.last_message!),
			time: chat.last_message ? getTime(chat.last_message.time) : '',
			onClick: async () => {
				ChatList.forEach((item) => {
					item.setProps({
						active: item.id === store.getState().selectedChatId,
					});
				});
				const controller = new ChatController();
				await controller.connect();
			},
		});
	});
	return ChatList;
};

class ChatsList extends Block {
	private interval: NodeJS.Timeout | null = null;

	constructor({ chats }: ChatsListProps) {
		super({
			ChatList: setChatList(chats || []),
		});

		const controller = new ChatController();
		controller.getList({});
		this.interval = setInterval(async () => {
			await controller.getList({});
		}, 5000);
	}

	override render(): string {
		return ChatsListTemplate;
	}

	override componentDidUpdate(oldProps: ChatsListProps, newProps: ChatsListProps): boolean {
		if (!isEqual(oldProps.chats!, newProps.chats!) && newProps.chats) {
			this.setLists({ ChatList: setChatList(newProps.chats) });
			return true;
		}
		if (oldProps.chatTitleSearch !== newProps.chatTitleSearch && newProps.chatTitleSearch) {
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
				this.interval = setInterval(async () => {
					const controller = new ChatController();
					await controller.getList({ title: newProps.chatTitleSearch });
				}, 5000);
			}
		}

		return false;
	}
}

const withChats = connect((state) => ({
	chats: cloneDeep(state.chats),
	chatTitleSearch: state.chatTitleSearch,
}));

export default withChats(ChatsList);
