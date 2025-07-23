import AuthAPI, { type LoginRequestData, type SignupRequestData } from '@/api/AuthAPI.ts';
import router, { routes } from '@/router/router.ts';
import store from '@/store/store.ts';
import ErrorService from '@/services/ErrorHandler.ts';

export default class AuthController {
	private readonly api = new AuthAPI();

	public async login(data: LoginRequestData) {
		try {
			await this.api.login({ data });
			await this.user();
			router.go(routes.MESSENGER);
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async signUp(data: SignupRequestData) {
		try {
			await this.api.signup({ data });
			await this.user();
			router.go(routes.MESSENGER);
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async logout() {
		try {
			await this.api.logout();
			store.set('isAuth', false);
			router.go(routes.LOGIN);
		} catch (e) {
			ErrorService.handle(e);
		}
	}
	public async user() {
		try {
			const userData = await this.api.user();
			store.set('user', userData);
			store.set('isAuth', true);
		} catch (e) {
			ErrorService.handle(e);
		}
	}
}
