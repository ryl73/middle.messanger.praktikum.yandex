import Block from '@/services/Block/Block.ts';
import ChatMessageTemplate from './MessagesItem.hbs?raw';

type ChatMessageProps = {
	content: string;
	time: string;
	read?: boolean;
	outcome?: boolean;
	image?: boolean;
	author?: string;
};

export default class MessagesItem extends Block<ChatMessageProps> {
	constructor(props: ChatMessageProps) {
		super({
			...props,
		});
	}

	override render(): string {
		return ChatMessageTemplate;
	}
}
