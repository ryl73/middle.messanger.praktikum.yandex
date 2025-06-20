import Block from '@/services/Block.ts';
import Page404Template from './404.hbs?raw';
import { Header } from '@/components/Header/Header.ts';
import { Link } from '@/components/Link/Link.ts';

export default class Page404 extends Block {
	constructor() {
		super({
			Header: new Header(),
			LinkBack: new Link({
				label: 'Назад к чатам',
				font: 'fs-default-bold',
				page: 'main',
			}),
		});
	}

	override render(): string {
		return Page404Template;
	}
}
