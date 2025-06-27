import Block from '@/services/Block.ts';
import ChatItemTemplate from './ChatItem.hbs?raw';

export type ChatItemProps = {
	title: string;
	lastMessageContent: string;
	lastMessageAuthor?: string;
	time: string;
	unreadCount?: number;
	avatar: string | null;
};

export default class ChatItem extends Block {
	constructor(props: ChatItemProps) {
		super({
			...props,
		});
	}

	override render(): string {
		return ChatItemTemplate;
	}
}
