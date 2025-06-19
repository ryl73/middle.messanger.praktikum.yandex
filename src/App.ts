import Handlebars from 'handlebars';

import Card from './components/Card/Card.hbs?raw';
import InfoField from './components/InfoField/InfoField.hbs?raw';
import Header from './components/Header/Header.hbs?raw';

import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/registration';
import Page500 from '@/pages/500';
import Page404 from '@/pages/404';
import ProfilePage from '@/pages/profile';

Handlebars.registerPartial('Card', Card);
Handlebars.registerPartial('InfoField', InfoField);
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
		if (this.state.currentPage === 'login') {
			const loginPage = new LoginPage();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(loginPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(loginPage.getContent());
			}
		} else if (this.state.currentPage === 'registration') {
			const registrationPage = new RegistrationPage();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(registrationPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(registrationPage.getContent());
			}
		} else if (this.state.currentPage === 'profile') {
			const loginPage = new ProfilePage();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(loginPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(loginPage.getContent());
			}
		} else if (this.state.currentPage === 'main') {
			// template = Handlebars.compile(Pages.Main);
			// this.appElement.innerHTML = template({});
		} else if (this.state.currentPage === '500') {
			const loginPage = new Page500();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(loginPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(loginPage.getContent());
			}
		} else {
			const loginPage = new Page404();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(loginPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(loginPage.getContent());
			}
		}
		this.attachEventListeners();

		return '';
	}

	attachEventListeners() {
		const links = document.querySelectorAll('.link[data-page]');
		links.forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const target = e.target;
				if (target && target instanceof HTMLElement) {
					this.changePage(target.dataset.page as string);
				}
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
