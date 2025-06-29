import Block from '@/services/Block.ts';
import PopoverTemplate from './Popover.hbs?raw';

type PopoverProps = {
	ActionSlot: string | Block;
	DialogSlot: (string | Block)[];
	position: string;
	onShow?: () => void;
	onClose?: () => void;
};

export default class Popover extends Block<PopoverProps> {
	dialog: HTMLDialogElement | null = null;
	action?: Element | null = null;
	private readonly boundHandleModalClick: EventListener;

	constructor(props: PopoverProps) {
		super({
			...props,
			events: {
				'.popover__action': {
					click: () => {
						if (this.open) {
							this.close();
							props.onClose?.();
						} else {
							this.show();
							props.onShow?.();
						}
					},
				},
			},
		});

		this.boundHandleModalClick = this.handleModalClick.bind(this);
		this.dialog = this.getContent().querySelector('.popover__dialog');
		this.action = this.getContent().querySelector('.popover__action')?.firstElementChild;
	}

	override render(): string {
		return PopoverTemplate;
	}

	private handleModalClick(e: Event) {
		const target = e.target as HTMLElement;

		if (!this.getContent().contains(target)) {
			this.close();
		}
	}

	get open() {
		return this.dialog?.open ?? false;
	}

	public show() {
		this.dialog?.show();
		this.action?.classList.add('active');
		document.addEventListener('click', this.boundHandleModalClick);
	}

	public close() {
		this.dialog?.close();
		this.action?.classList.remove('active');
		document.removeEventListener('click', this.boundHandleModalClick);
	}
}
