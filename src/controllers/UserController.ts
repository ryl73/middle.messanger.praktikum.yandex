import UserAPI, { type ChangePasswordRequestData } from '@/api/UserAPI.ts';
import AuthController from '@/controllers/AuthController.ts';

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
}
