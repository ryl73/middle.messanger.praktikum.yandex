import Block from '@/services/Block.ts';
import LinkTemplate from './Link.hbs?raw';

export type LinkProps = {
	modifier?: string;
	font?: string;
	page?: string;
	href?: string;
	label: string;
	onClick?: (e: Event) => void;
};

export class Link extends Block {
	constructor(props: LinkProps) {
		super({
			...props,
			events: {
				root: {
					click: (e: Event) => {
						props.onClick?.(e);
					},
				},
			},
		});
	}

	override render(): string {
		return LinkTemplate;
	}
}
