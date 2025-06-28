import Block from '@/services/Block.ts';
import HeaderTemplate from './Header.hbs?raw';
import { Link } from '@/components/Link/Link.ts';

export class Header extends Block {
	constructor() {
		super({
			LinkLogin: new Link({
				label: 'Войти',
				page: 'login',
			}),
			LinkRegistration: new Link({
				label: 'Регистрация',
				page: 'registration',
			}),
			LinkProfile: new Link({
				label: 'Профиль',
				page: 'profile',
			}),
			LinkMain: new Link({
				label: 'Чаты',
				page: 'main',
			}),
			Link404: new Link({
				label: '404',
				page: '404',
			}),
			Link500: new Link({
				label: '500',
				page: '500',
			}),
		});
	}

	override render(): string {
		return HeaderTemplate;
	}
}
