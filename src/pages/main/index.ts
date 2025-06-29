import Block from '@/services/Block.ts';
import MainTemplate from './main.hbs?raw';
import { Header } from '@/components/Header/Header.ts';
import ChatsAside from '@/components/Chats/ChatsAside/ChatsAside.ts';
import CHAT_LIST from '@/mocks/chatList.ts';
import ChatsMain from '@/components/Chats/ChatsMain/ChatsMain.ts';

export default class MainPage extends Block {
	constructor() {
		const ChatsMainComponent = new ChatsMain({
			avatar: null,
			title: 'Андрей',
		});

		const ChatsAsideComponent = new ChatsAside({
			chatList: MainPage.getChatList(),
			main: ChatsMainComponent,
			avatarSrc: null,
		});

		super({
			Header: new Header(),
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
