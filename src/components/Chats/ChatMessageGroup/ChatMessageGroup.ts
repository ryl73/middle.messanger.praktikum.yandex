import Block from '@/services/Block.ts';
import ChatMessageGroupTemplate from './ChatMessageGroup.hbs?raw';
import ChatMessage from '@/components/Chats/ChatMessage/ChatMessage.ts';
import type { Message } from '@/types/message.ts';
import { getTimeStringFromUTC } from '@/utils/getTime.ts';

type ChatMessageGroupProps = {
	title: string;
	group: Record<string, Message[]>;
	ChatMessageList: ChatMessage[];
};

export default class ChatMessageGroup extends Block<ChatMessageGroupProps> {
	constructor(props: Partial<ChatMessageGroupProps>) {
		const ChatMessageList: ChatMessage[] = [];

		Object.values(props.group!)[0].forEach((message) => {
			function isImage(content: string): boolean {
				return (
					content.includes('.jpg') || content.includes('.png') || content.includes('.svg')
				);
			}

			const ChatMessageItem = new ChatMessage({
				content: message.content,
				image: isImage(message.content),
				time: getTimeStringFromUTC(message.time),
				read: message.read,
				outcome: message.outcome,
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
