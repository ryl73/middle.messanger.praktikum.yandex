import Block from '@/services/Block.ts';
import ChatMessageGroupTemplate from './MessagesGroup.hbs?raw';
import MessagesItem from '@/components/Messages/MessagesItem/MessagesItem.ts';
import { getTimeStringFromUTC } from '@/utils/getTime.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import store from '@/store/store.ts';

type ChatMessageGroupProps = {
	title: string;
	group: Record<string, WSMessage[]>;
	ChatMessageList: MessagesItem[];
};

export default class MessagesGroup extends Block<ChatMessageGroupProps> {
	constructor(props: Partial<ChatMessageGroupProps>) {
		const ChatMessageList: MessagesItem[] = [];
		const groupMessages = Object.values(props.group!)[0];
		const userId = store.getState().user?.id;

		groupMessages.forEach((message) => {
			const ChatMessageItem = new MessagesItem({
				content: message.file ? message.file.path : message.content,
				image: message.type === 'file' && message.file?.content_type.includes('image'),
				time: getTimeStringFromUTC(message.time),
				read: message.is_read,
				outcome: message.user_id === userId,
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
