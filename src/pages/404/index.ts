import Block from '@/services/Block.ts';
import Page404Template from './404.hbs?raw';

export default class Page404 extends Block {
	override render(): string {
		return Page404Template;
	}
}
