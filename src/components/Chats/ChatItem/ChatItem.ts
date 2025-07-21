import Block, { type CommonBlockProps } from '@/services/Block.ts';
import ChatItemTemplate from './ChatItem.hbs?raw';
import connect from '@/store/connect';
import store from '@/store/store.ts';

export type ChatItemProps = {
	selectedChatId?: number;
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

class ChatItem extends Block {
	constructor({ selectedChatId, ...props }: ChatItemProps) {
		const active = selectedChatId === props.id;

		super({
			...props,
			active,
			events: {
				root: {
					click: async (e: Event) => {
						if (props.id === store.getState().selectedChatId) return;
						store.set('selectedChatId', props.id);
						props.onClick?.(e);
					},
				},
			},
		});
	}

	override render(): string {
		this.setProps({
			active: this.props.id === this.props.selectedChatId,
		});
		return ChatItemTemplate;
	}

	protected componentDidUpdate(
		oldProps: ChatItemProps & CommonBlockProps,
		newProps: ChatItemProps & CommonBlockProps
	): boolean {
		if (oldProps.selectedChatId !== newProps.selectedChatId && newProps.selectedChatId) {
			this.setProps({
				active: newProps.id === newProps.selectedChatId,
			});

			return true;
		}
		return false;
	}
}

const withSelectedChatId = connect((state) => ({
	selectedChatId: state.selectedChatId,
}));

export default withSelectedChatId(ChatItem);
