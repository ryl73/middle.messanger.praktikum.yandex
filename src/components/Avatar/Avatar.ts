import Block from '@/services/Block.ts';
import AvatarTemplate from './Avatar.hbs?raw';
import type { Modal } from '@/components/Modal/Modal.ts';

export type AvatarProps = {
	src?: string | null;
	hoverText?: string;
	AvatarModal?: Modal;
	onClick?: (e: Event) => void;
};

export class Avatar extends Block<AvatarProps> {
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
}
