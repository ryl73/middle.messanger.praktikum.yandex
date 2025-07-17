import EventBus, { type EventCallback } from '../utils/eventBus.ts';
import Handlebars from 'handlebars';
import isEqual from '@/utils/isEqual.ts';

export type BlockEvents = Record<string, Record<string, EventListener>>;

export type CommonBlockProps = {
	attr?: Record<string, string>;
	events?: BlockEvents;
};

export type BlockLists = Record<string, (Block<any> | string)[]>;

export default abstract class Block<
	Props extends Record<string, unknown> = Record<string, unknown>,
> {
	static EVENTS = {
		INIT: 'init',
		FLOW_CBM: 'flow:component-before-mount',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
	} as const;

	protected _element: HTMLElement | null = null;
	protected _id: number = Math.floor(100000 + Math.random() * 900000);

	protected props: Props & CommonBlockProps;
	protected children: Record<string, Block>;
	protected lists: BlockLists;
	protected eventBus: () => EventBus;

	protected constructor(propsWithChildren: Partial<Props & CommonBlockProps> = {}) {
		const eventBus = new EventBus();
		const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);

		this.props = this._makePropsProxy({ ...props }) as Props & CommonBlockProps;
		this.children = children;
		this.lists = this._makePropsProxy({ ...lists });
		this.eventBus = () => eventBus;
		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	private _addEvents(): void {
		const { events } = this.props;
		if (!events) return;

		for (const target in events) {
			const eventMap = events[target];
			if (target === 'root') {
				for (const eventName in eventMap) {
					this._element?.addEventListener(eventName, eventMap[eventName]);
				}
			} else {
				const targetEl = this._element?.querySelector(target);
				if (!targetEl) continue;
				for (const eventName in eventMap) {
					targetEl.addEventListener(eventName, eventMap[eventName]);
				}
			}
		}
	}

	private _removeEvents(): void {
		const { events } = this.props;
		if (!events) return;

		for (const target in events) {
			const eventMap = events[target];
			if (target === 'root') {
				for (const eventName in eventMap) {
					this._element?.removeEventListener(eventName, eventMap[eventName]);
				}
			} else {
				const targetEl = this._element?.querySelector(target);
				if (!targetEl) continue;
				for (const eventName in eventMap) {
					targetEl.removeEventListener(eventName, eventMap[eventName]);
				}
			}
		}
	}

	private _registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_CBM, this._componentBeforeMount.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this) as EventCallback);
	}

	protected init(): void {
		this.dispatchComponentBeforeMount();
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
		this.dispatchComponentDidMount();
	}

	private _componentDidMount(): void {
		this.componentDidMount();
	}

	private _componentBeforeMount(): void {
		this.componentBeforeMount();
	}

	protected componentDidMount(): void {}

	protected componentBeforeMount(): void {}

	public dispatchComponentDidMount(): void {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	public dispatchComponentBeforeMount(): void {
		this.eventBus().emit(Block.EVENTS.FLOW_CBM);
	}

	private _componentDidUpdate(
		oldProps: Props & CommonBlockProps,
		newProps: Props & CommonBlockProps
	): void {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (!response) return;
		this._render();
	}

	protected componentDidUpdate(
		oldProps: Props & CommonBlockProps,
		newProps: Props & CommonBlockProps
	): boolean {
		return !isEqual(oldProps, newProps);
	}

	private _getChildrenPropsAndProps(propsAndChildren: Partial<Props & CommonBlockProps>): {
		children: Record<string, Block>;
		props: Partial<Props & CommonBlockProps>;
		lists: BlockLists;
	} {
		const children: Record<string, Block> = {};
		const props: Partial<Props & CommonBlockProps> = {};
		const lists: BlockLists = {};

		Object.entries(propsAndChildren).forEach(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value;
			} else if (Array.isArray(value)) {
				lists[key] = value;
			} else {
				props[key as keyof (Props & CommonBlockProps)] = value;
			}
		});

		return { children, props, lists };
	}

	protected addAttributes(): void {
		const { attr } = this.props;
		if (!attr) return;

		Object.entries(attr).forEach(([key, value]) => {
			this._element?.setAttribute(key, value);
		});
	}

	protected setAttributes(attr: Record<string, string>): void {
		Object.entries(attr).forEach(([key, value]) => {
			this._element?.setAttribute(key, value);
		});
	}

	public setProps = (nextProps: Partial<Props>): void => {
		if (!nextProps) return;
		Object.assign(this.props, nextProps);
	};

	public setLists = (nextLists: Partial<BlockLists>): void => {
		if (!nextLists) return;
		Object.assign(this.lists, nextLists);
	};

	get element(): HTMLElement | null {
		return this._element;
	}

	protected _render(): void {
		this._removeEvents();

		const propsAndStubs = { ...this.props };
		const tmpId = Math.floor(100000 + Math.random() * 900000);

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key as keyof Props] = `<div data-id="${child._id}"></div>` as any;
		});

		Object.entries(this.lists).forEach(([key]) => {
			propsAndStubs[key as keyof Props] = `<div data-id="__l_${tmpId}"></div>` as any;
		});

		const fragment = this._createDocumentElement('template');
		fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

		Object.values(this.children).forEach((child) => {
			const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
			if (stub) stub.replaceWith(child.getContent());
		});

		Object.entries(this.lists).forEach(([, child]) => {
			const listCont = this._createDocumentElement('template');
			child.forEach((item) => {
				if (item instanceof Block) {
					listCont.content.append(item.getContent());
				} else {
					listCont.content.append(`${item}`);
				}
			});
			const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
			if (stub) stub.replaceWith(listCont.content);
		});

		const newElement = fragment.content.firstElementChild as HTMLElement;
		if (this._element && newElement) {
			this._element.replaceWith(newElement);
		}
		this._element = newElement;
		this._addEvents();
		this.addAttributes();
	}

	public render(): string {
		return '';
	}

	public getContent(): HTMLElement {
		if (!this._element) {
			throw new Error('Элемент не был создан!');
		}
		return this._element;
	}

	private _makePropsProxy<T extends object>(props: T): T {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		return new Proxy(props, {
			get(target, prop: string) {
				const value = target[prop as keyof T];
				return typeof value === 'function' ? value.bind(target) : value;
			},
			set(target, prop: string, value: any) {
				const oldProps = { ...target };
				target[prop as keyof T] = value;
				// self._queuePropsUpdate(oldProps as unknown as Props & CommonBlockProps);
				self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
				return true;
			},
			deleteProperty() {
				throw new Error('Нет доступа');
			},
		});
	}

	private _createDocumentElement(tagName: string): HTMLTemplateElement {
		return document.createElement(tagName) as HTMLTemplateElement;
	}

	public show(): void {
		const content = this.getContent();
		if (content) {
			content.style.display = 'block';
		}
	}

	public hide(): void {
		const content = this.getContent();
		if (content) {
			content.style.display = 'none';
		}
	}
}
