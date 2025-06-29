import Block from '@/services/Block.ts';
import ChatItemTemplate from './ChatItem.hbs?raw';

export type ChatItemProps = {
	title: string;
	lastMessageContent: string;
	lastMessageAuthor?: string;
	time: string;
	unreadCount?: number;
	avatar: string | null;
	active?: boolean;
	onClick?: (e: Event) => void;
};

export default class ChatItem extends Block<ChatItemProps> {
	constructor({ active = false, ...props }: ChatItemProps) {
		super({
			...props,
			active,
			events: {
				root: {
					click: (e: Event) => {
						props.onClick?.(e);
						this.setProps({
							active: true,
						});
					},
				},
			},
		});
	}

	override render(): string {
		return ChatItemTemplate;
	}
}
