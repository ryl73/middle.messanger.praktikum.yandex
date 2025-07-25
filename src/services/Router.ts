import Route from './Route.ts';
import type Block from '@/services/Block.ts';
import { render } from '@/utils/render.ts';
import Page404 from '@/pages/404';
import type { RouteTypes } from '@/router/router.ts';

export default class Router {
	protected routes: Route[] = [];
	protected history: History = window.history;
	private _beforeEach?: (from: string, to: string, next: () => void) => void;
	private readonly _rootQuery: string = '';
	static __instance: Router;

	constructor(rootQuery: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		this._rootQuery = rootQuery;
		Router.__instance = this;
	}

	use(pathname: RouteTypes, block: new () => Block): this {
		const route = new Route(pathname, block, { rootQuery: this._rootQuery });
		this.routes.push(route);
		return this;
	}

	start(): void {
		window.onpopstate = (() => {
			const pathname = window.location.pathname;
			this._onRoute(pathname);
		}).bind(this);

		this._onRoute(window.location.pathname);
	}

	private _onRoute(pathname: RouteTypes | string): void {
		const from = window.location.pathname;
		const to = pathname;

		const route = this.getRoute(to);

		if (!route) {
			const page404 = new Page404();
			render(this._rootQuery, page404);
			return;
		}

		const proceed = () => {
			route.navigate(to);
		};

		if (this._beforeEach) {
			this._beforeEach(from, to, proceed);
		} else {
			proceed();
		}
	}

	go(pathname: RouteTypes): void {
		if (window.location.pathname === pathname) {
			return;
		}
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	back(): void {
		this.history.back();
	}

	forward(): void {
		this.history.forward();
	}

	getRoute(pathname: RouteTypes | string): Route | undefined {
		return this.routes.find((route) => route.match(pathname));
	}

	public beforeEach(callback: (from: string, to: string, next: () => void) => void): void {
		this._beforeEach = callback;
	}
}
