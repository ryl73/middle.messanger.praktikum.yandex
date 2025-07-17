import AuthAPI, { type LoginRequestData, type SignupRequestData } from '@/api/AuthAPI.ts';
import router from '@/router/router.ts';
import store from '@/store/store.ts';
import ErrorService from '@/services/ErrorHandler.ts';

const api = new AuthAPI();

export default class AuthController {
	public async login(data: LoginRequestData) {
		try {
			await api.login({ data });
			await this.user();
			router.go('/messenger');
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async signUp(data: SignupRequestData) {
		try {
			await api.signup({ data });
			await this.user();
			router.go('/messenger');
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async logout() {
		try {
			await api.logout();
			store.set('isAuth', false);
			router.go('/');
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async user() {
		try {
			const userData = await api.user();
			store.set('user', userData);
			store.set('isAuth', true);
		} catch (e) {
			ErrorService.handle(e);
		}
	}
}
