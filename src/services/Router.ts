import Route from './Route.ts';
import type Block from '@/services/Block.ts';
import { render } from '@/utils/render.ts';
import Page404 from '@/pages/404';

export default class Router {
	protected routes: Route[] = [];
	protected history: History = window.history;
	private _beforeEach?: (from: string, to: string) => void;
	private readonly _rootQuery: string = '';
	static __instance: Router;

	constructor(rootQuery: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		this._rootQuery = rootQuery;
		Router.__instance = this;
	}

	use(pathname: string, block: new () => Block): this {
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

	private _onRoute(pathname: string): void {
		if (this._beforeEach) {
			this._beforeEach(window.location.pathname, pathname);
		}

		const route = this.getRoute(pathname);
		if (!route) {
			const page404 = new Page404();
			render(this._rootQuery, page404);
			return;
		}

		route.navigate(pathname);
	}

	go(pathname: string): void {
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

	getRoute(pathname: string): Route | undefined {
		return this.routes.find((route) => route.match(pathname));
	}

	public beforeEach(callback: (from: string, to: string) => void): void {
		this._beforeEach = callback;
	}
}
