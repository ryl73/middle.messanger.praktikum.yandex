import Block from '@/services/Block.ts';
import ChatMessageGroupTemplate from './ChatMessageGroup.hbs?raw';
import ChatMessage from '@/components/Chats/ChatMessage/ChatMessage.ts';
import { getTimeStringFromUTC } from '@/utils/getTime.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import store from '@/store/store.ts';

type ChatMessageGroupProps = {
	title: string;
	group: Record<string, WSMessage[]>;
	ChatMessageList: ChatMessage[];
};

export default class ChatMessageGroup extends Block<ChatMessageGroupProps> {
	constructor(props: Partial<ChatMessageGroupProps>) {
		const ChatMessageList: ChatMessage[] = [];
		const groupMessages = Object.values(props.group!)[0];
		const userId = store.getState().user.id;
		groupMessages.forEach((message) => {
			function isImage(content: string): boolean {
				return (
					content.includes('.jpg') || content.includes('.png') || content.includes('.svg')
				);
			}

			const ChatMessageItem = new ChatMessage({
				content: message.content,
				image: false,
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
