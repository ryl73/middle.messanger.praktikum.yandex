import Block from '@/services/Block/Block.ts';
import ListItemTemplate from './ListItem.hbs?raw';

export type ListItemProps = {
	icon: string;
	label: string;
	class?: string;
	onClick?: (e: Event) => void;
};

export default class ListItem extends Block<ListItemProps> {
	constructor(props: ListItemProps) {
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
		return ListItemTemplate;
	}
}
