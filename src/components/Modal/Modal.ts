import Block from '@/services/Block.ts';
import ModalTemplate from './Modal.hbs?raw';

export type ModalProps = {
	title?: string;
	slot?: Block[];
	modifier?: string;
	onClick?: (e: Event) => void;
	onClose?: (e: Event) => void;
};

export class Modal extends Block {
	constructor(props: ModalProps) {
		super({
			...props,
			events: {
				root: {
					click: (e: Event) => {
						props.onClick?.(e);
					},
					close: (e: Event) => {
						props.onClose?.(e);
					},
				},
			},
		});
	}

	override render(): string {
		return ModalTemplate;
	}

	private handleModalClick(e: Event) {
		const target = e.target as HTMLElement;
		const currentTarget = e.currentTarget as HTMLDialogElement;

		const isClickedOnBackdrop = target === currentTarget;

		if (isClickedOnBackdrop) {
			currentTarget.close();
		}
	}

	public show() {
		const target = this.getContent();
		if (target instanceof HTMLDialogElement) {
			target.showModal();
			document.body.classList.add('scroll-lock');
			target.addEventListener('click', this.handleModalClick);
		}
	}

	public close() {
		const target = this.getContent();
		if (target instanceof HTMLDialogElement) {
			target.close();
			document.body.classList.remove('scroll-lock');
			target.removeEventListener('click', this.handleModalClick);
		}
	}
}
