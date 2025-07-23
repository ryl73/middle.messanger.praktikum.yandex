import Block from '@/services/Block.ts';
import PopupTemplate from './Popup.hbs?raw';

type PopupProps = {
	message: string;
	type?: 'error' | 'success';
};

export default class Popup extends Block {
	constructor(props: PopupProps) {
		let timer: NodeJS.Timeout | null = null;

		const setTimer = () => {
			timer = setTimeout(() => {
				this.unmount();
			}, 3000);
		};

		setTimer();

		super({
			...props,
			events: {
				root: {
					mouseenter() {
						if (timer) {
							clearTimeout(timer);
							timer = null;
						}
					},
					mouseleave() {
						setTimer();
					},
				},
			},
		});
	}

	override render(): string {
		return PopupTemplate;
	}
}
