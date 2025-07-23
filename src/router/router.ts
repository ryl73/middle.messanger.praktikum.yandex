import Router from '@/services/Router.ts';
import LoginPage from '@/pages/login';
import RegistrationPage from '@/pages/signup';
import ProfilePage from '@/pages/settings';
import MainPage from '@/pages/messenger';
import store from '@/store/store.ts';
import Page500 from '@/pages/500';

export const routes = {
	LOGIN: '/',
	SIGNUP: '/sign-up',
	SETTINGS: '/settings',
	MESSENGER: '/messenger',
	ERROR: '/error',
} as const;

export type RouteTypes = (typeof routes)[keyof typeof routes];

const router = new Router('#app');

router
	.use(routes.LOGIN, LoginPage)
	.use(routes.SIGNUP, RegistrationPage)
	.use(routes.SETTINGS, ProfilePage)
	.use(routes.MESSENGER, MainPage)
	.use(routes.ERROR, Page500);

router.beforeEach((_, to, next) => {
	const isAuth = store.getState().isAuth;
	if (isAuth) {
		if (to === routes.LOGIN || to === routes.SIGNUP) {
			router.go(routes.MESSENGER);
		} else {
			next();
		}
	} else {
		if (to !== routes.LOGIN && to !== routes.SIGNUP) {
			router.go(routes.LOGIN);
		} else {
			next();
		}
	}
});

export default router;
