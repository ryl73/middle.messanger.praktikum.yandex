import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/registration';
import Page500 from '@/pages/500';
import Page404 from '@/pages/404';
import ProfilePage from '@/pages/profile';
import MainPage from '@/pages/main';

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
				phone: '+79099673030',
				avatar: null,
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
			const loginPage = new ProfilePage(this.state.userInfo);
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(loginPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(loginPage.getContent());
			}
		} else if (this.state.currentPage === 'main') {
			const mainPage = new MainPage();
			if (!this.appElement.firstElementChild) {
				this.appElement.appendChild(mainPage.getContent());
			} else {
				this.appElement.firstElementChild.replaceWith(mainPage.getContent());
			}
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
				const target = e.currentTarget;
				if (target && target instanceof HTMLElement) {
					this.changePage(target.dataset.page as string);
				}
			});
		});
	}

	changePage(page: string) {
		this.state.currentPage = page;
		this.render();
	}
}
