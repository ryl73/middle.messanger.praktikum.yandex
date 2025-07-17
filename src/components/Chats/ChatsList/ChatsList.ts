import Block from '@/services/Block.ts';
import ChatsListTemplate from './ChatsList.hbs?raw';
import type { ChatGetListResponseData, LastMessage } from '@/api/ChatAPI.ts';
import withChats from '@/store/connect/withChats.ts';
import isEqual from '@/utils/isEqual.ts';
import ChatItem from '@/components/Chats/ChatItem/ChatItem.ts';
import { getTime } from '@/utils/getTime.ts';
import ChatController from '@/controllers/ChatController.ts';
import store from '@/store/store.ts';

type ChatsListProps = {
	chats?: ChatGetListResponseData[];
};

function getLastMessageContent(lastMessage: LastMessage): string {
	if (
		lastMessage.content.includes('.jpg') ||
		lastMessage.content.includes('.png') ||
		lastMessage.content.includes('.svg')
	) {
		return 'Изображение';
	}

	return lastMessage.content;
}

function getLastMessageAuthor(lastMessage: LastMessage): string | undefined {
	const userLogin = store.getState().user?.login;
	if (lastMessage.user.login === userLogin) {
		return 'Вы';
	}

	return undefined;
}

const setChatList = (chats: ChatGetListResponseData[]) => {
	return chats.map((chat) => {
		return new ChatItem({
			id: chat.id,
			avatar: chat.avatar,
			title: chat.title,
			unreadCount: chat.unread_count > 0 ? chat.unread_count : undefined,
			lastMessageContent: chat.last_message ? getLastMessageContent(chat.last_message) : '',
			lastMessageAuthor: getLastMessageAuthor(chat.last_message!),
			time: chat.last_message ? getTime(chat.last_message.time) : '',
			onClick: async () => {
				const controller = new ChatController();
				await controller.connect();
			},
		});
	});
};

class ChatsList extends Block {
	constructor({ chats }: ChatsListProps) {
		super({
			ChatList: setChatList(chats || []),
		});
	}

	override render(): string {
		return ChatsListTemplate;
	}

	override componentDidUpdate(oldProps: ChatsListProps, newProps: ChatsListProps): boolean {
		if (!isEqual(oldProps.chats!, newProps.chats!) && newProps.chats) {
			this.setLists({ ChatList: setChatList(newProps.chats) });
			return true;
		}

		return false;
	}
}

export default withChats(ChatsList);
