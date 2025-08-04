import Block from '@/services/Block/Block.ts';
import ButtonTemplate from './Button.hbs?raw';

export type ButtonProps = {
	label?: string;
	icon?: string;
	disabled?: boolean;
	modifier?: string;
	type?: string;
	onClick?: (e: Event) => void;
};

export class Button extends Block<ButtonProps> {
	constructor(props: ButtonProps) {
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
		return ButtonTemplate;
	}
}
