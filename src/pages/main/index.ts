import Block from '@/services/Block.ts';
import MainTemplate from './main.hbs?raw';
import ChatsAside from '@/components/Chats/ChatsAside/ChatsAside.ts';
import CHAT_LIST from '@/mocks/chatList.ts';
import ChatsMain from '@/components/Chats/ChatsMain/ChatsMain.ts';
import ChatController from '@/controllers/ChatController.ts';

export default class MainPage extends Block {
	constructor() {
		const controller = new ChatController();
		controller.getList({});
		const ChatsMainComponent = new ChatsMain({
			avatar: null,
			title: 'Андрей',
		});

		const ChatsAsideComponent = new ChatsAside({
			main: ChatsMainComponent,
		});

		super({
			ChatsAsideComponent,
			ChatsMainComponent,
		});
	}

	static getChatList() {
		return CHAT_LIST;
	}

	override render(): string {
		return MainTemplate;
	}
}
