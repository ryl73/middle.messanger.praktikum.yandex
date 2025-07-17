import Block from '@/services/Block.ts';
import MessagesGroupListTemplate from './MessagesGroupList.hbs?raw';
import connect from '@/store/connect';
import cloneDeep from '@/utils/cloneDeep.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import MessagesGroup from '@/components/Messages/MessagesGroup/MessagesGroup.ts';
import isEqual from '@/utils/isEqual.ts';
import groupByDate from '@/utils/groupByDate.ts';

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
	messages: WSMessage[];
};

class MessagesGroupList extends Block {
	constructor({ messages }: MessagesGroupListProps) {
		super({
			MessageList: setMessagesGroupList(messages || []),
		});
	}

	override render(): string {
		return MessagesGroupListTemplate;
	}

	override componentDidUpdate(
		oldProps: MessagesGroupListProps,
		newProps: MessagesGroupListProps
	): boolean {
		if (!isEqual(oldProps.messages!, newProps.messages!) && newProps.messages) {
			this.setLists({ MessageList: setMessagesGroupList(newProps.messages) });
			return true;
		}

		return false;
	}
}

const withState = connect((state) => ({
	messages: cloneDeep(state.messages),
}));

export default withState(MessagesGroupList);
