import Block from '@/services/Block.ts';
import ChatsAsideNavbarTemplate from './MessengerAsideNavbar.hbs?raw';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import router from '@/router/router.ts';
import { Input } from '@/components/Input/Input.ts';
import connect from '@/store/connect';
import ChatController from '@/controllers/ChatController.ts';
import store from '@/store/store.ts';

type ChatsAsideNavbarProps = {
	avatar: string;
};

class MessengerAsideNavbar extends Block {
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
				onInput: (value) => {
					const controller = new ChatController();
					setTimeout(async () => {
						await controller.getList({ title: value });
						store.set('chatTitleSearch', value);
					}, 300);
				},
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

export default withAvatar(MessengerAsideNavbar);
