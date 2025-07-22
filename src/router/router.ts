import Router from '@/services/Router.ts';
import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/signup';
import ProfilePage from '@/pages/settings';
import MainPage from '@/pages/messenger';
import store from '@/store/store.ts';
import Page500 from '@/pages/500';

const router = new Router('#app');

router
	.use('/', LoginPage)
	.use('/sign-up', RegistrationPage)
	.use('/settings', ProfilePage)
	.use('/messenger', MainPage)
	.use('/error', Page500);

router.beforeEach((_, to, next) => {
	const isAuth = store.getState().isAuth;
	if (isAuth) {
		if (to === '/' || to === '/sign-up') {
			router.go('/messenger');
		} else {
			next();
		}
	} else {
		if (to !== '/' && to !== '/sign-up') {
			router.go('/');
		} else {
			next();
		}
	}
});

export default router;
