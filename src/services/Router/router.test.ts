import Router from '@/services/Router/Router.ts';
import Route from '@/services/Route.ts';
import { render } from '@/utils/render.ts';
import Page404 from '@/pages/404';
import Block from '@/services/Block/Block.ts';

jest.mock('@/services/Route.ts');
jest.mock('@/utils/render.ts');
jest.mock('@/pages/404');

const mockRender = render as jest.Mock;

class DummyBlock extends Block {
	constructor() {
		super();
	}
	render(): string {
		return super.render();
	}
}

describe('Router', () => {
	let router: Router;
	let routeInstance: jest.Mocked<Route>;

	beforeEach(() => {
		jest.clearAllMocks();
		(Router as unknown as { __instance?: Router }).__instance = undefined;

		routeInstance = {
			navigate: jest.fn(),
			leave: jest.fn(),
			match: jest.fn().mockReturnValue(false),
		} as unknown as jest.Mocked<Route>;

		(Route as jest.Mock).mockImplementation(() => routeInstance);

		router = new Router('#app');
	});

	test('singleton instance is returned', () => {
		const secondRouter = new Router('#other');
		expect(secondRouter).toBe(router);
	});

	test('use() adds a new route', () => {
		router.use('/home', DummyBlock);
		expect(router['routes']).toHaveLength(1);
		expect(Route).toHaveBeenCalledWith('/home', DummyBlock, { rootQuery: '#app' });
	});

	test('go() pushes new state and calls _onRoute', () => {
		const pushSpy = jest.spyOn(window.history, 'pushState');
		const onRouteSpy = jest.spyOn(
			router as unknown as { _onRoute: (p: string) => void },
			'_onRoute'
		);

		router.go('/test');

		expect(pushSpy).toHaveBeenCalledWith({}, '', '/test');
		expect(onRouteSpy).toHaveBeenCalledWith('/test');
	});

	test('back() and forward() call history', () => {
		const backSpy = jest.spyOn(window.history, 'back');
		const forwardSpy = jest.spyOn(window.history, 'forward');

		router.back();
		router.forward();

		expect(backSpy).toHaveBeenCalled();
		expect(forwardSpy).toHaveBeenCalled();
	});

	test('getRoute() returns matched route', () => {
		routeInstance.match.mockReturnValue(true);
		(router as unknown as { routes: Route[] }).routes = [routeInstance];
		const found = router.getRoute('/match');
		expect(found).toBe(routeInstance);
	});

	test('_onRoute() renders 404 if no match', () => {
		const page404El = document.createElement('div');
		const page404Instance = { el: page404El };

		// @ts-expect-error we're overriding Route constructor with a mock
		(Page404 as jest.Mock).mockImplementation(() => page404Instance);

		router['routes'] = [];
		(router as unknown as { _onRoute: (p: string) => void })._onRoute('/not-found');

		expect(mockRender).toHaveBeenCalledWith('#app', page404Instance);
	});

	test('_onRoute() navigates if matched', () => {
		routeInstance.match.mockReturnValue(true);
		router['routes'] = [routeInstance];

		(router as unknown as { _onRoute: (p: string) => void })._onRoute('/match');

		expect(routeInstance.navigate).toHaveBeenCalledWith('/match');
	});

	test('_onRoute() with beforeEach calls hook', () => {
		routeInstance.match.mockReturnValue(true);
		router['routes'] = [routeInstance];

		const beforeEach = jest.fn((_from, _to, next) => next());
		router.beforeEach(beforeEach);

		(router as unknown as { _onRoute: (p: string) => void })._onRoute('/guard');

		expect(beforeEach).toHaveBeenCalled();
		expect(routeInstance.navigate).toHaveBeenCalledWith('/guard');
	});

	test('start() sets popstate handler and calls _onRoute', () => {
		const onRouteSpy = jest.spyOn(
			router as unknown as { _onRoute: (p: string) => void },
			'_onRoute'
		);

		router.start();

		expect(typeof window.onpopstate).toBe('function');
		window.dispatchEvent(new PopStateEvent('popstate'));
		expect(onRouteSpy).toHaveBeenCalledWith(window.location.pathname);
	});
});
