import Block from '@/services/Block.ts';
import AvatarTemplate from './Avatar.hbs?raw';
import type { Modal } from '@/components/Modal/Modal.ts';

export type AvatarProps = {
	src?: string;
	hoverText?: string;
	AvatarModal?: Modal;
	onClick?: (e: Event) => void;
};

export class Avatar extends Block {
	static defaultAvatar = '/media/images/avatar-default.png';

	constructor(props: AvatarProps) {
		super({
			...props,
			events: {
				'.avatar': {
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
		return AvatarTemplate;
	}

	override componentBeforeMount() {
		if (!this.props.src) {
			this.setProps({
				src: Avatar.defaultAvatar,
			});
		}
	}

	get modal(): Modal {
		return this.props.Modal;
	}
}
