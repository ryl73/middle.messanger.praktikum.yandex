import Block from '@/services/Block.ts';
import MainTemplate from './messenger.hbs?raw';
import MessengerAside from '@/components/Messanger/MessengerAside/MessengerAside.ts';
import CHAT_LIST from '@/mocks/chatList.ts';
import ChatsMain from '@/components/Messanger/MessengerMain/MessengerMain.ts';

export default class MainPage extends Block {
	constructor() {
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
