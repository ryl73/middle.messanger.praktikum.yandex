import UserAPI, { type ChangePasswordRequestData } from '@/api/UserAPI.ts';
import AuthController from '@/controllers/AuthController.ts';
import store from '@/store/store.ts';
import ErrorHandler from '@/services/ErrorHandler.ts';

export default class UserController {
	private readonly api = new UserAPI();

	public async changePassword(data: ChangePasswordRequestData) {
		try {
			await this.api.changePassword({ data });
			const controller = new AuthController();
			await controller.logout();
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}

	public async search(login: string) {
		try {
			const data = {
				login,
			};
			const users = await this.api.search({ data });
			store.set('userSearchList', users);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}
}
