import Block from '@/services/Block/Block.ts';
import ChatsAsideTemplate from './MessengerAside.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Button } from '@/components/Button/Button.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import Form from '@/components/Form/Form.ts';
import type { ChatCreateRequestData } from '@/api/ChatAPI.ts';
import ChatController from '@/controllers/ChatController.ts';
import ChatsAsideNavbar from '@/components/Messanger/MessengerAside/MessengerAsideNavbar/MessengerAsideNavbar.ts';
import ChatsList from '@/components/Chats/ChatsList/ChatsList.ts';

export default class MessengerAside extends Block {
	constructor() {
		const ChatNameInput = new Input({
			label: 'Название',
			name: 'title',
			onInput: (value) => {
				if (value !== '') {
					ChatAddForm.buttonSubmitEl.setProps({
						disabled: false,
					});
				} else {
					ChatAddForm.buttonSubmitEl.setProps({
						disabled: true,
					});
				}
			},
		});

		const ChatAddForm = new Form<ChatCreateRequestData>({
			InputList: [ChatNameInput],
			noCancel: true,
			submitProps: {
				label: 'Добавить',
				disabled: true,
			},
			onSubmit: async (data) => {
				const controller = new ChatController();
				await controller.create(data);
				ChatAddModal.close();
			},
		});

		const ChatAddModal = new Modal({
			title: 'Добавить чат',
			slot: [ChatAddForm],
			onClose: () => {
				ChatNameInput.setProps({
					value: '',
				});
				ChatAddForm.buttonSubmitEl.setProps({
					disabled: true,
				});
			},
		});

		super({
			Navbar: new ChatsAsideNavbar({}),
			ChatList: new ChatsList({}),
			ButtonChatAdd: new Button({
				icon: `
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M11.25 12.75V18H12.75V12.75H18V11.25H12.75V6H11.25V11.25H6V12.75H11.25Z" fill="currentColor"/>
					</svg>
				`,
				modifier: 'round big',
				onClick: () => {
					ChatAddModal.show();
				},
			}),
			ChatAddModal,
		});
	}

	override render(): string {
		return ChatsAsideTemplate;
	}
}
