import Block from '@/services/Block.ts';
import Page500Template from './500.hbs?raw';
import { Link } from '@/components/Link/Link.ts';
import router, { routes } from '@/router/router.ts';

export default class Page500 extends Block {
	constructor() {
		super({
			LinkBack: new Link({
				label: 'Назад к чатам',
				font: 'fs-default-bold',
				page: 'main',
				onClick: () => {
					router.go(routes.MESSENGER);
				},
			}),
		});
	}

	override render(): string {
		return Page500Template;
	}
}
