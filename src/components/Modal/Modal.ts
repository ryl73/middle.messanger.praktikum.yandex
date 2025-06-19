import Block from '@/services/Block.ts';
import ModalTemplate from './Modal.hbs?raw';

export type ModalProps = {
	onClick?: (e: Event) => void;
};

export class Modal extends Block {
	constructor(props: ModalProps) {
		super({
			...props,
			events: {
				root: {
					click: (e: Event) => {
						if (props.onClick) {
							props.onClick(e);
						}
					},
				},
			},
		});
	}

	override render(): string {
		return ModalTemplate;
	}
}

// export default function () {
// 	const openModals = document.querySelectorAll('[data-modal]') as NodeListOf<HTMLElement>;
// 	openModals.forEach((o) =>
// 		o.addEventListener('click', () => {
// 			if (o.dataset.modal) {
// 				const modal =
// 					(document.getElementById(o.dataset.modal) as HTMLDialogElement) || null;
// 				modal?.showModal();
// 				document.body.classList.add('scroll-lock');
// 				modal?.addEventListener('click', handleModalClick);
// 			}
// 		})
// 	);
// }
//
// const handleModalClick = (e: Event) => {
// 	const target = e.target as HTMLElement;
// 	const currentTarget = e.currentTarget as HTMLDialogElement;
//
// 	const isClickedOnBackdrop = target === currentTarget;
//
// 	if (isClickedOnBackdrop) {
// 		currentTarget.close();
// 	}
// };
