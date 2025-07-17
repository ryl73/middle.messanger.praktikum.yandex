import Router from '@/services/Router.ts';
import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/signup';
import ProfilePage from '@/pages/settings';
import MainPage from '@/pages/messenger';

const router = new Router('#app');

router
	.use('/', LoginPage)
	.use('/sign-up', RegistrationPage)
	.use('/settings', ProfilePage)
	.use('/messenger', MainPage);

export default router;
