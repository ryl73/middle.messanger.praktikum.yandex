import Block from '@/services/Block.ts';
import ChatsMainTemplate from './ChatsMain.hbs?raw';
import ChatMessageGroup from '@/components/Chats/ChatMessageGroup/ChatMessageGroup.ts';
import MainNavbar from '@/components/Main/MainNavbar/MainNavbar.ts';
import MainSearchbar from '@/components/Main/MainSearchbar/MainSearchbar.ts';
import connect from '@/store/connect';
import store from '@/store/store.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import cloneDeep from '@/utils/cloneDeep.ts';

type ChatsMainProps = {
	messages?: WSMessage[];
	selectedChatId?: number | null;
	ChatMessageGroupList: ChatMessageGroup[];
	MainNavbar: MainNavbar;
	MainSearchbar: MainSearchbar;
};

class ChatsMain extends Block<ChatsMainProps> {
	constructor(props: Partial<ChatsMainProps>) {
		const selectedChat = store
			.getState()
			?.chats?.find((chat) => chat.id === props.selectedChatId);

		super({
			...props,
			ChatMessageGroupList: [],
			MainNavbar: new MainNavbar({
				avatar: selectedChat?.avatar,
				title: selectedChat?.title,
			}),
			MainSearchbar: new MainSearchbar(),
		});
	}

	override render(): string {
		const selectedChat = store
			.getState()
			?.chats?.find((chat) => chat.id === this.props.selectedChatId);
		if (selectedChat) {
			this.children.MainNavbar.setProps({
				avatar: selectedChat.avatar,
				title: selectedChat.title,
			});
		}
		return ChatsMainTemplate;
	}

	override componentDidUpdate(oldProps: ChatsMainProps, newProps: ChatsMainProps): boolean {
		if (newProps.messages) {
			this.setChatList(newProps.messages);
		}

		return true;
	}

	setChatList(messages: WSMessage[]) {
		const chatMessageGroupList = [
			new ChatMessageGroup({
				group: {
					'10 июля': messages,
				},
			}),
		];
		this.setLists({ ChatMessageGroupList: chatMessageGroupList });
	}
}

const withState = connect((state) => ({
	selectedChatId: state.selectedChatId,
	messages: cloneDeep(state.messages),
}));

export default withState(ChatsMain);
