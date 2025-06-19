import Block from '@/services/Block.ts';
import Page500Template from './500.hbs?raw';

export default class Page500 extends Block {
	override render(): string {
		return Page500Template;
	}
}
