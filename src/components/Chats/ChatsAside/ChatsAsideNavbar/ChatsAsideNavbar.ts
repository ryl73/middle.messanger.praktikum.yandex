import Block from '@/services/Block.ts';
import ChatsAsideNavbarTemplate from './ChatsAsideNavbar.hbs?raw';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import router from '@/router/router.ts';
import { Input } from '@/components/Input/Input.ts';
import connect from '@/store/connect';

type ChatsAsideNavbarProps = {
	avatar: string;
};

class ChatsAsideNavbar extends Block {
	constructor({ avatar }: ChatsAsideNavbarProps) {
		super({
			Avatar: new Avatar({
				src: avatar,
				onClick: () => {
					router.go('/settings');
				},
			}),
			SearchInput: new Input({
				name: 'search',
				placeholder: 'Поиск',
				search: true,
			}),
		});
	}

	override render() {
		return ChatsAsideNavbarTemplate;
	}

	override componentDidUpdate(
		oldProps: ChatsAsideNavbarProps,
		newProps: ChatsAsideNavbarProps
	): boolean {
		if (oldProps.avatar !== newProps.avatar && newProps.avatar) {
			this.children.Avatar.setProps({ src: newProps.avatar });
			return true;
		}

		return false;
	}
}

const withAvatar = connect((state) => ({
	avatar: state.user?.avatar,
}));

export default withAvatar(ChatsAsideNavbar);
