import AuthAPI, { type LoginRequestData, type SignupRequestData } from '@/api/AuthAPI.ts';
import router from '@/router/router.ts';
import store from '@/store/store.ts';

const api = new AuthAPI();

export default class AuthController {
	public async login(data: LoginRequestData) {
		try {
			await api.login({ data });
			router.go('/messenger');
		} catch (e) {
			console.log(e);
		}
	}
	public async signUp(data: SignupRequestData) {
		try {
			await api.signup({ data });
			router.go('/messenger');
		} catch (e) {
			console.log(e);
		}
	}
	public async logout() {
		try {
			await api.logout();
			router.go('/');
		} catch (e) {
			console.log(e);
		}
	}
	public async user() {
		try {
			const userData = await api.user();
			store.set('user', userData);
		} catch (e) {
			console.log(e);
		}
	}
	// public async isAuth(): Promise<boolean> {
	// 	try {
	// 		return await this.user();
	// 	} catch (e) {
	// 		console.log(e);
	// 		return false;
	// 	}
	// }
}
