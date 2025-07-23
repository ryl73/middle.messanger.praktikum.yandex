import Block from '@/services/Block.ts';
import UserListTemplate from './UserList.hbs?raw';
import type { SearchResponseData } from '@/api/UserAPI.ts';
import UserItem from '@/components/User/UserItem/UserItem.ts';
import connect from '@/store/connect';
import cloneDeep from '@/utils/cloneDeep.ts';
import isEqual from '@/utils/isEqual.ts';
import store from '@/store/store.ts';

type UserListProps = {
	userSearchList: SearchResponseData[];
};
const setUserList = (users: SearchResponseData[]) => {
	const UserList = users.map((chat) => {
		return new UserItem({
			id: chat.id,
			avatar: chat.avatar,
			login: chat.login,
			first_name: chat.first_name,
			second_name: chat.second_name,
			display_name: chat.display_name,
			onClick: () => {
				UserList.forEach((item) => {
					item.setProps({
						active: item.id === store.getState().userSearchSelectedId,
					});
				});
			},
		});
	});
	return UserList;
};

class UserList extends Block {
	constructor({ userSearchList }: UserListProps) {
		super({
			UserList: setUserList(userSearchList || []),
		});
	}

	override render(): string {
		return UserListTemplate;
	}

	override componentDidUpdate(oldProps: UserListProps, newProps: UserListProps): boolean {
		if (
			!isEqual(oldProps.userSearchList!, newProps.userSearchList!) &&
			newProps.userSearchList
		) {
			this.setLists({ UserList: setUserList(newProps.userSearchList) });
			return true;
		}

		return false;
	}
}

const withStore = connect((state) => ({
	userSearchList: cloneDeep(state.userSearchList),
}));

export default withStore(UserList);
