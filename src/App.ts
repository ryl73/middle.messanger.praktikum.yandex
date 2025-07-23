import router from '@/router/router.ts';
import AuthController from '@/controllers/AuthController.ts';

export default class App {
	async createApp() {
		const authController = new AuthController();
		await authController.user();
		router.start();
	}
}
