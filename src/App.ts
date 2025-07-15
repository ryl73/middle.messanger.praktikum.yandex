import router from '@/router/router.ts';
import AuthController from '@/controllers/AuthController.ts';

export default class App {
	async createApp() {
		router.start();
		const authController = new AuthController();
		await authController.user();
		// const isAuth = await authController.isAuth();
		// if (!isAuth) {
		// 	router.go('/');
		// 	return;
		// } else {
		// 	if (to === '/' || to === '/sign-up') {
		// 		router.go('/messenger');
		// 	}
		// }
	}
}
