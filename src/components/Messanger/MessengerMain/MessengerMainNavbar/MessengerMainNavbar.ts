import Block from '@/services/Block/Block.ts';
import MainNavbarTemplate from './MessengerMainNavbar.hbs?raw';
import Popover from '@/components/Popover/Popover.ts';
import ListItem, { type ListItemProps } from '@/components/ListItem/ListItem.ts';
import Form from '@/components/Form/Form.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { Input } from '@/components/Input/Input.ts';
import { Button } from '@/components/Button/Button.ts';
import { Link } from '@/components/Link/Link.ts';
import ChatController from '@/controllers/ChatController.ts';
import UserList from '@/components/User/UserList/UserList.ts';
import UserController from '@/controllers/UserController.ts';
import store from '@/store/store.ts';

type MainNavbarProps = {
	avatar: string | null;
	title: string;
	ChatSettingsPopover: Popover;
	ChatRemoveModal: Modal;
	ChatUserRemoveModal: Modal;
	ChatUserAddModal: Modal;
};

export default class MessengerMainNavbar extends Block<MainNavbarProps> {
	constructor(props: Partial<MainNavbarProps>) {
		const settingsListItems: ListItemProps[] = [
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="11" cy="11" r="10.25" stroke="currentColor" stroke-width="1.5"/>
						<line x1="10.9999" y1="5.5" x2="10.9999" y2="16.5" stroke="currentColor" stroke-width="1.5"/>
						<line x1="5.49988" y1="11" x2="16.4999" y2="11" stroke="currentColor" stroke-width="1.5"/>
					</svg>
				`,
				label: 'Добавить пользователя',
				onClick: () => {
					ChatUserAddModal.show();
				},
			},
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="11" cy="11" r="10.25" stroke="currentColor" stroke-width="1.5"/>
						<line x1="7.11077" y1="7.11103" x2="14.8889" y2="14.8892" stroke="currentColor" stroke-width="1.5"/>
						<line x1="7.11078" y1="14.8891" x2="14.889" y2="7.11093" stroke="currentColor" stroke-width="1.5"/>
					</svg>
				`,
				label: 'Удалить пользователя',
				onClick: () => {
					ChatUserRemoveModal.show();
				},
			},
			{
				icon: `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
						<path d="M10 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M14 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`,
				label: 'Удалить чат',
				class: 'red',
				onClick: () => {
					ChatRemoveModal.show();
				},
			},
		];

		const ChatSettingsDialogSlot: Block[] = [];

		settingsListItems.forEach((item) => {
			const Item = new ListItem({
				icon: item.icon,
				label: item.label,
				class: item.class,
				onClick: item.onClick,
			});
			ChatSettingsDialogSlot.push(Item);
		});

		const ChatSettingsPopover = new Popover({
			ActionSlot: `
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
					<path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			`,
			DialogSlot: ChatSettingsDialogSlot,
			position: 'bottom right',
		});

		const ChatUserAddLoginInput = new Input({
			label: 'Логин',
			name: 'login',
			onInput: (value) => {
				store.set('userSearchSelectedId', undefined);
				setTimeout(async () => {
					if (value !== '') {
						const controller = new UserController();
						await controller.search(value);
					} else {
						store.set('userSearchList', []);
					}
				}, 500);
			},
		});

		const ChatUserAddList = new UserList({ users: [] });

		const ChatUserAddForm = new Form<{ login: string }>({
			InputList: [ChatUserAddLoginInput, ChatUserAddList],
			noCancel: true,
			submitProps: {
				label: 'Добавить',
			},
			onSubmit: async () => {
				const selectedId: number = store.getState().userSearchSelectedId;
				if (!selectedId) return;

				const controller = new ChatController();
				await controller.addUser([selectedId]);
				ChatUserAddModal.close();
			},
		});

		const ChatUserAddModal = new Modal({
			title: 'Добавить пользователя',
			slot: [ChatUserAddForm],
			onClose: () => {
				store.set('userSearchList', []);
				ChatUserAddLoginInput.setProps({
					value: '',
				});
			},
		});

		const ChatUserRemoveLoginInput = new Input({
			label: 'Имя',
			name: 'name',
			onInput: (value) => {
				store.set('userSearchSelectedId', undefined);
				setTimeout(async () => {
					if (value !== '') {
						const controller = new ChatController();
						const users = await controller.getUsers({ name: value });
						store.set('userSearchList', users);
					} else {
						store.set('userSearchList', []);
					}
				}, 500);
			},
		});

		const ChatUserRemoveList = new UserList({ users: [] });

		const ChatUserRemoveForm = new Form({
			InputList: [ChatUserRemoveLoginInput, ChatUserRemoveList],
			noCancel: true,
			submitProps: {
				label: 'Удалить',
			},
			onSubmit: async () => {
				const selectedId: number = store.getState().userSearchSelectedId;
				if (!selectedId) return;

				const controller = new ChatController();
				await controller.deleteUser([selectedId]);
				ChatUserRemoveModal.close();
			},
		});

		const ChatUserRemoveModal = new Modal({
			title: 'Удалить пользователя',
			slot: [ChatUserRemoveForm],
			onClose: () => {
				store.set('userSearchList', []);
				ChatUserRemoveLoginInput.setProps({
					value: '',
				});
			},
		});

		ChatUserRemoveModal.onOpen = async () => {
			const controller = new ChatController();
			const users = await controller.getUsers({});
			store.set('userSearchList', users);
		};

		const ChatRemoveButton = new Button({
			label: 'Удалить',
			modifier: 'red',
			onClick: async () => {
				const controller = new ChatController();
				await controller.delete();
				ChatRemoveModal.close();
			},
		});

		const ChatRemoveCancelLink = new Link({
			label: 'Отменить',
			modifier: 'fs-p-bold',
			onClick: () => {
				ChatRemoveModal.close();
			},
		});

		const ChatRemoveModal = new Modal({
			title: 'Вы действительно хотите удалить данный чат?',
			modifier: 'small',
			slot: [ChatRemoveButton, ChatRemoveCancelLink],
		});

		super({
			...props,
			ChatSettingsPopover,
			ChatRemoveModal,
			ChatUserRemoveModal,
			ChatUserAddModal,
			events: {
				'.main__navbar__info__avatar': {
					click: () => {
						const input = document.createElement('input');
						input.type = 'file';
						input.accept = 'image/*';
						input.style.display = 'none';
						document.body.appendChild(input);
						input.click();
						input.addEventListener('change', async (e) => {
							const target = e.target;
							if (target instanceof HTMLInputElement) {
								const files = target.files;
								if (files && files.length > 0) {
									console.log(files[0]);
									const controller = new ChatController();
									await controller.setAvatar(files[0]);
									document.body.removeChild(input);
								}
							}
						});
					},
				},
			},
		});
	}

	override render(): string {
		return MainNavbarTemplate;
	}
}
