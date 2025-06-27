import Block from '@/services/Block.ts';
import MainTemplate from './main.hbs?raw';
import { Header } from '@/components/Header/Header.ts';
import ChatsAside from '@/components/ChatsAside/ChatsAside.ts';
import CHAT_LIST from '@/mocks/chatList.ts';
import ChatsMain from '@/components/ChatsMain/ChatsMain.ts';

export default class MainPage extends Block {
	constructor() {
		super({
			Header: new Header(),
			ChatsAside: new ChatsAside({
				chatList: MainPage.getChatList(),
			}),
			ChatsMain: new ChatsMain({
				avatar: null,
				title: 'Андрей',
			}),
		});
	}

	static getChatList() {
		return CHAT_LIST;
	}

	override render(): string {
		return MainTemplate;
	}
}
