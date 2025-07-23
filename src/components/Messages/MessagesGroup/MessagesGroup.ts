import Block from '@/services/Block.ts';
import ChatMessageGroupTemplate from './MessagesGroup.hbs?raw';
import MessagesItem from '@/components/Messages/MessagesItem/MessagesItem.ts';
import { getTimeStringFromUTC } from '@/utils/getTime.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import store from '@/store/store.ts';
import type { ChatGetUsersResponseData } from '@/api/ChatAPI.ts';

type ChatMessageGroupProps = {
	title: string;
	group: Record<string, WSMessage[]>;
	ChatMessageList: MessagesItem[];
};

function getAuthor(users: ChatGetUsersResponseData[], messageUserId: number): string | undefined {
	if (users.length <= 2) return undefined;
	const authorUser = users?.find((user) => user.id === messageUserId);
	if (!authorUser) return undefined;

	return authorUser.display_name || `${authorUser.first_name} ${authorUser.second_name}`;
}

export default class MessagesGroup extends Block<ChatMessageGroupProps> {
	constructor(props: Partial<ChatMessageGroupProps>) {
		const ChatMessageList: MessagesItem[] = [];
		const groupMessages = Object.values(props.group!)[0];
		const userId = store.getState().user?.id;
		const chatUsers: ChatGetUsersResponseData[] = store.getState().chatUsers;

		groupMessages.forEach((message) => {
			const ChatMessageItem = new MessagesItem({
				content: message.file ? message.file.path : message.content,
				image: message.type === 'file' && message.file?.content_type.includes('image'),
				time: getTimeStringFromUTC(message.time),
				read: message.is_read,
				outcome: message.user_id === userId,
				author: getAuthor(chatUsers, message.user_id),
			});
			ChatMessageList.push(ChatMessageItem);
		});

		super({
			title: Object.keys(props.group!)[0],
			ChatMessageList,
		});
	}

	override render(): string {
		return ChatMessageGroupTemplate;
	}
}
