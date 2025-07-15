import type Block from '@/services/Block.ts';
import { render } from '@/utils/render.ts';

function isEqual(lhs: string, rhs: string): boolean {
	return lhs === rhs;
}

type RouteProps = {
	rootQuery: string;
};

export default class Route {
	private _pathname: string;
	private _blockClass: new () => Block;
	private _block: Block | null = null;
	private _props: RouteProps;

	constructor(pathname: string, view: new () => Block, props: RouteProps) {
		this._pathname = pathname;
		this._blockClass = view;
		this._props = props;
	}

	navigate(pathname: string): void {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave(): void {
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string): boolean {
		return isEqual(pathname, this._pathname);
	}

	render(): void {
		this._block = new this._blockClass();
		render(this._props.rootQuery, this._block);
	}
}
