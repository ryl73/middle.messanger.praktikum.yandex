import Block from '@/services/Block.ts';
import MainTemplate from './main.hbs?raw';
import { Header } from '@/components/Header/Header.ts';

export default class MainPage extends Block {
	constructor() {
		super({
			Header: new Header(),
		});
	}

	override render(): string {
		return MainTemplate;
	}
}
