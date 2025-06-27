import EventBus, { type EventCallback } from '../utils/event-bus.ts';
import Handlebars from 'handlebars';
import isEqual from '@/utils/isEqual.ts';

type BlockProps = Record<string, any>;

export default class Block {
	static EVENTS = {
		INIT: 'init',
		FLOW_CBM: 'flow:component-before-mount',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
	};

	protected _element: HTMLElement | null = null;

	protected _id: number = Math.floor(100000 + Math.random() * 900000);

	protected props: BlockProps;

	protected children: Record<string, Block>;

	protected lists: Record<string, any[]>;

	protected eventBus: () => EventBus;

	constructor(propsWithChildren: BlockProps = {}) {
		const eventBus = new EventBus();
		const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);
		this.props = this._makePropsProxy({ ...props });
		this.children = children;
		this.lists = this._makePropsProxy({ ...lists });
		this.eventBus = () => eventBus;
		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	private _addEvents(): void {
		const { events = {} } = this.props;
		Object.keys(events).forEach((target) => {
			if (target === 'root') {
				Object.keys(events.root).forEach((eventName) => {
					if (this._element) {
						this._element.addEventListener(eventName, events.root[eventName]);
					}
				});
			} else {
				Object.keys(events[target]).forEach((eventName) => {
					if (this._element) {
						const targetEl = this._element.querySelector(target);
						if (targetEl) {
							targetEl.addEventListener(eventName, events[target][eventName]);
						}
					}
				});
			}
		});
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

	private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): void {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (!response) {
			return;
		}
		this._render();
	}

	protected componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): boolean {
		return !isEqual(oldProps, newProps);
	}

	private _getChildrenPropsAndProps(propsAndChildren: BlockProps): {
		children: Record<string, Block>;
		props: BlockProps;
		lists: Record<string, any[]>;
	} {
		const children: Record<string, Block> = {};
		const props: BlockProps = {};
		const lists: Record<string, any[]> = {};

		Object.entries(propsAndChildren).forEach(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value;
			} else if (Array.isArray(value)) {
				lists[key] = value;
			} else {
				props[key] = value;
			}
		});

		return { children, props, lists };
	}

	protected addAttributes(): void {
		const { attr = {} } = this.props;

		Object.entries(attr).forEach(([key, value]) => {
			if (this._element) {
				this._element.setAttribute(key, value as string);
			}
		});
	}

	protected setAttributes(attr: any): void {
		Object.entries(attr).forEach(([key, value]) => {
			if (this._element) {
				this._element.setAttribute(key, value as string);
			}
		});
	}

	public setProps = (nextProps: BlockProps): void => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	public setLists = (nextList: Record<string, any[]>): void => {
		if (!nextList) {
			return;
		}

		Object.assign(this.lists, nextList);
	};

	get element(): HTMLElement | null {
		return this._element;
	}

	protected _render(): void {
		console.log('Render');
		const propsAndStubs = { ...this.props };
		const tmpId = Math.floor(100000 + Math.random() * 900000);
		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
		});

		Object.entries(this.lists).forEach(([key]) => {
			propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
		});

		const fragment = this._createDocumentElement('template');
		fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

		Object.values(this.children).forEach((child) => {
			const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
			if (stub) {
				stub.replaceWith(child.getContent());
			}
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
			if (stub) {
				stub.replaceWith(listCont.content);
			}
		});

		const newElement = fragment.content.firstElementChild as HTMLElement;
		if (this._element && newElement) {
			this._element.replaceWith(newElement);
		}
		this._element = newElement;
		this._addEvents();
		this.addAttributes();
	}

	// Переопределяется пользователем. Необходимо вернуть разметку
	public render(): string {
		return '';
	}

	public getContent(): HTMLElement {
		if (!this._element) {
			throw new Error('Элемент не был создан!');
		}
		return this._element;
	}

	private _makePropsProxy(props: BlockProps): BlockProps {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		return new Proxy(props, {
			get(target: BlockProps, prop: string) {
				const value = target[prop];
				return typeof value === 'function' ? value.bind(target) : value;
			},
			set(target: BlockProps, prop: string, value: any) {
				const oldProps = { ...target };
				target[prop] = value;

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
