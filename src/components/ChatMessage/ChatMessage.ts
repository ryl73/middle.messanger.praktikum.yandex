import Block from '@/services/Block.ts';
import ChatMessageTemplate from './ChatMessage.hbs?raw';

type ChatMessageProps = {
	content: string;
	time: string;
	read?: boolean;
	outcome?: boolean;
	image?: boolean;
};

export default class ChatMessage extends Block {
	constructor(props: ChatMessageProps) {
		super({
			...props,
		});
	}

	override render(): string {
		return ChatMessageTemplate;
	}
}
