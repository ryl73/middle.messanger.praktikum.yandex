import Router from '@/services/Router.ts';
import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/registration';
import ProfilePage from '@/pages/profile';
import MainPage from '@/pages/main';

const router = new Router('#app');

router
	.use('/', LoginPage)
	.use('/sign-up', RegistrationPage)
	.use('/settings', ProfilePage)
	.use('/messenger', MainPage);

export default router;
