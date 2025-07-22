import Block from '@/services/Block.ts';
import ChatItemTemplate from './ChatItem.hbs?raw';
import store from '@/store/store.ts';

export type ChatItemProps = {
	id: number;
	title: string;
	lastMessageContent: string;
	lastMessageAuthor?: string;
	time: string;
	unreadCount?: number;
	avatar: string | null;
	active?: boolean;
	onClick?: (e: Event) => void;
};

export default class ChatItem extends Block {
	constructor({ ...props }: ChatItemProps) {
		const active = store.getState().selectedChatId === props.id;

		super({
			...props,
			active,
			events: {
				root: {
					click: (e: Event) => {
						if (props.id === store.getState().selectedChatId) return;
						store.set('selectedChatId', props.id);
						props.onClick?.(e);
					},
				},
			},
		});
	}

	override render(): string {
		return ChatItemTemplate;
	}

	get id() {
		return this.props.id;
	}
}
