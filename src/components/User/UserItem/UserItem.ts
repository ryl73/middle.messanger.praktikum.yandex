import Block from '@/services/Block.ts';
import UserItemTemplate from './UserItem.hbs?raw';
import store from '@/store/store.ts';

type UserItemProps = {
	id: number;
	avatar: string;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	active?: boolean;
	onClick?: (selectedId: number) => void;
};

export default class UserItem extends Block {
	constructor({ ...props }: UserItemProps) {
		const active = store.getState().userSearchSelectedId === props.id;

		super({
			...props,
			active,
			name: `${props.first_name} ${props.second_name}`,
			events: {
				root: {
					click: () => {
						store.set('userSearchSelectedId', props.id);
						props.onClick?.(props.id);
					},
				},
			},
		});
	}

	override render(): string {
		return UserItemTemplate;
	}

	get id() {
		return this.props.id;
	}
}
