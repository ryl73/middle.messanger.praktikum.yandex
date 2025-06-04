import Handlebars from 'handlebars';
import * as Pages from './pages';
import initModal from './components/Modal/Modal.ts';

import Button from './components/Button/Button.hbs?raw';
import Avatar from './components/Avatar/Avatar.hbs?raw';
import Card from './components/Card/Card.hbs?raw';
import InfoField from './components/InfoField/InfoField.hbs?raw';
import Input from './components/Input/Input.hbs?raw';
import Modal from './components/Modal/Modal.hbs?raw';
import Header from './components/Header/Header.hbs?raw';

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Avatar', Avatar);
Handlebars.registerPartial('Card', Card);
Handlebars.registerPartial('InfoField', InfoField);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Modal', Modal);
Handlebars.registerPartial('Header', Header);

export default class App {
	appElement: HTMLDivElement;
	state: any;

	constructor() {
		this.state = {
			currentPage: 'login',
			userInfo: {
				email: 'pochta@yandex.ru',
				login: 'ivanivanov',
				firstName: 'Иван',
				secondName: 'Иванов',
				displayName: 'Иван',
				phone: '+7 (909) 967 30 30',
			},
		};
		this.appElement = document.getElementById('app') as HTMLDivElement;
	}

	render() {
		let template: HandlebarsTemplateDelegate;
		if (this.state.currentPage === 'login') {
			template = Handlebars.compile(Pages.Login);
			this.appElement.innerHTML = template({});
		} else if (this.state.currentPage === 'registration') {
			template = Handlebars.compile(Pages.Registration);
			this.appElement.innerHTML = template({});
		} else if (this.state.currentPage === 'profile') {
			template = Handlebars.compile(Pages.Profile);
			this.appElement.innerHTML = template({
				email: this.state.userInfo.email,
				login: this.state.userInfo.login,
				firstName: this.state.userInfo.firstName,
				secondName: this.state.userInfo.secondName,
				displayName: this.state.userInfo.displayName,
				phone: this.state.userInfo.phone,
			});
		} else if (this.state.currentPage === 'main') {
			template = Handlebars.compile(Pages.Main);
			this.appElement.innerHTML = template({});
		} else if (this.state.currentPage === '500') {
			template = Handlebars.compile(Pages.NotResponding);
			this.appElement.innerHTML = template({});
		} else {
			template = Handlebars.compile(Pages.NotFound);
			this.appElement.innerHTML = template({});
		}

		this.attachEventListeners();
	}

	attachEventListeners() {
		const links = document.querySelectorAll('.link[data-page]');
		links.forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const target = e.target as HTMLElement;
				this.changePage(target.dataset.page as string);
			});
		});

		const profileContent = document.querySelectorAll('.profile__content');

		const changeDataButton = document.getElementById('change-data');
		const changePasswordButton = document.getElementById('change-password');
		const saveDataButton = document.getElementById('save-data');
		const savePasswordButton = document.getElementById('save-password');

		changeDataButton?.addEventListener('click', () => this.setActiveFrame(profileContent, 1));
		changePasswordButton?.addEventListener('click', () =>
			this.setActiveFrame(profileContent, 2)
		);
		saveDataButton?.addEventListener('click', () => this.setActiveFrame(profileContent, 0));
		savePasswordButton?.addEventListener('click', () => this.setActiveFrame(profileContent, 0));

		initModal();
	}

	setActiveFrame(elements: NodeListOf<Element>, index: number) {
		elements.forEach((elem) => elem.classList.remove('active'));
		elements[index].classList.add('active');
	}

	changePage(page: string) {
		this.state.currentPage = page;
		this.render();
	}
}
