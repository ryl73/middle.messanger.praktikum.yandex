import UserAPI, { type ChangePasswordRequestData } from '@/api/UserAPI.ts';
import AuthController from '@/controllers/AuthController.ts';
import store from '@/store/store.ts';

const api = new UserAPI();

export default class UserController {
	public async changePassword(data: ChangePasswordRequestData) {
		try {
			await api.changePassword({ data });
			const controller = new AuthController();
			await controller.logout();
		} catch (e) {
			console.log(e);
		}
	}

	public async search(login: string) {
		try {
			const data = {
				login,
			};
			const users = await api.search({ data });
			store.set('userSearchList', users);
		} catch (e) {
			console.log(e);
		}
	}
}
