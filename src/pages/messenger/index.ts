import Block from '@/services/Block.ts';
import MainTemplate from './messenger.hbs?raw';
import MessengerAside from '@/components/Messanger/MessengerAside/MessengerAside.ts';
import CHAT_LIST from '@/mocks/chatList.ts';
import ChatsMain from '@/components/Messanger/MessengerMain/MessengerMain.ts';
import ChatController from '@/controllers/ChatController.ts';

export default class MainPage extends Block {
	constructor() {
		const controller = new ChatController();
		controller.getList({});
		setInterval(async () => {
			await controller.getList({});
		}, 5000);
		const ChatsMainComponent = new ChatsMain({
			avatar: null,
			title: 'Андрей',
		});

		const ChatsAsideComponent = new MessengerAside();

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
