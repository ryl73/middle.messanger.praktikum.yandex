import Block from '@/services/Block.ts';
import MessengerMainTemplate from './MessengerMain.hbs?raw';
import store from '@/store/store.ts';
import type { WSMessage } from '@/services/WebSocketService.ts';
import MessengerMainSearchbar from '@/components/Messanger/MessengerMain/MessengerMainSearchbar/MessengerMainSearchbar.ts';
import MessengerMainNavbar from '@/components/Messanger/MessengerMain/MessengerMainNavbar/MessengerMainNavbar.ts';
import connect from '@/store/connect';
import MessagesGroupList from '@/components/Messages/MessagesGroupList/MessagesGroupList.ts';
import type { ChatGetListResponseData } from '@/api/ChatAPI.ts';

type ChatsMainProps = {
	messages?: WSMessage[];
	selectedChatId?: number | null;
};

class MessengerMain extends Block {
	constructor(props: Partial<ChatsMainProps>) {
		const selectedChat = store
			.getState()
			?.chats?.find((chat: ChatGetListResponseData) => chat.id === props.selectedChatId);

		super({
			...props,
			MessageGroupList: new MessagesGroupList({}),
			Navbar: new MessengerMainNavbar({
				avatar: selectedChat?.avatar,
				title: selectedChat?.title,
			}),
			Searchbar: new MessengerMainSearchbar(),
		});
	}

	override render(): string {
		const selectedChat = store
			.getState()
			?.chats?.find((chat: ChatGetListResponseData) => chat.id === this.props.selectedChatId);

		if (selectedChat) {
			this.children.Navbar.setProps({
				avatar: selectedChat.avatar,
				title: selectedChat.title,
			});
		}
		return MessengerMainTemplate;
	}
}

const withState = connect((state) => ({
	selectedChatId: state.selectedChatId,
}));

export default withState(MessengerMain);
