import Block from '@/services/Block.ts';
import UserItemTemplate from './UserItem.hbs?raw';
import store from '@/store/store.ts';
import connect from '@/store/connect';

type UserItemProps = {
	userSearchSelectedId: number;
	id: number;
	avatar: string;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	active: boolean;
	onClick?: (selectedId: number) => void;
};

class UserItem extends Block {
	constructor({ userSearchSelectedId, ...props }: UserItemProps) {
		const active = userSearchSelectedId === props.id;

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

	protected componentDidUpdate(oldProps: UserItemProps, newProps: UserItemProps): boolean {
		if (
			oldProps.userSearchSelectedId !== newProps.userSearchSelectedId &&
			newProps.userSearchSelectedId
		) {
			this.setProps({
				active: newProps.id === newProps.userSearchSelectedId,
			});

			return true;
		}
		return false;
	}
}

const withStore = connect((state) => ({
	userSearchSelectedId: state.userSearchSelectedId,
}));

export default withStore(UserItem);
