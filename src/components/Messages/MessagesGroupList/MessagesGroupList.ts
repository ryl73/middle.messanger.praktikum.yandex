import Block from '@/services/Block.ts';
import MessagesGroupListTemplate from './MessagesGroupList.hbs?raw';
import connect from '@/store/connect';
import type { WSMessage } from '@/services/WebSocketService.ts';
import MessagesGroup from '@/components/Messages/MessagesGroup/MessagesGroup.ts';
import groupByDate from '@/utils/groupByDate.ts';
import cloneDeep from '@/utils/cloneDeep.ts';

const setMessagesGroupList = (messages: WSMessage[]) => {
	return Object.entries(groupByDate(messages)).map(([date, messages]) => {
		return new MessagesGroup({
			group: {
				[date]: messages,
			},
		});
	});
};

type MessagesGroupListProps = {
	messages?: Record<string, WSMessage[]>;
	selectedChatId?: number;
};

class MessagesGroupList extends Block {
	constructor({ messages, selectedChatId }: MessagesGroupListProps) {
		super({
			MessageList: setMessagesGroupList(messages?.[selectedChatId!] || []),
		});
	}

	override render(): string {
		return MessagesGroupListTemplate;
	}

	override componentDidUpdate(
		_: MessagesGroupListProps,
		newProps: MessagesGroupListProps
	): boolean {
		const newMessages = newProps.messages;
		const newSelectedChatId = newProps.selectedChatId;

		if (newMessages && newSelectedChatId && newMessages[newSelectedChatId]) {
			this.setLists({ MessageList: setMessagesGroupList(newMessages[newSelectedChatId]) });
			return true;
		}

		return false;
	}
}

const withState = connect((state) => ({
	messages: cloneDeep(state.messages),
	selectedChatId: state.selectedChatId,
}));

export default withState(MessagesGroupList);
