import Block from '@/services/Block.ts';
import ChatsAsideTemplate from './ChatsAside.hbs?raw';
import ChatItem from '@/components/Chats/ChatItem/ChatItem.ts';
import { Input } from '@/components/Input/Input.ts';
import { Button } from '@/components/Button/Button.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { getTime } from '@/utils/getTime.ts';
import Form from '@/components/Form/Form.ts';
import type { ChatCreateRequestData, ChatGetListResponseData, LastMessage } from '@/api/ChatAPI.ts';
import ChatController from '@/controllers/ChatController.ts';
import isEqual from '@/utils/isEqual.ts';
import ChatsAsideNavbar from '@/components/Chats/ChatsAside/ChatsAsideNavbar/ChatsAsideNavbar.ts';
import withChats from '@/store/connect/withChats.ts';

type MainAsideProps = {
	avatar?: string;
	chats?: ChatGetListResponseData[];
};

function getLastMessageContent(lastMessage: LastMessage): string {
	if (
		lastMessage.content.includes('.jpg') ||
		lastMessage.content.includes('.png') ||
		lastMessage.content.includes('.svg')
	) {
		return 'Изображение';
	}

	return lastMessage.content;
}

class ChatsAside extends Block {
	constructor({ chats }: Partial<MainAsideProps>) {
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

		this.setChatList(chats || []);
	}

	override render(): string {
		return ChatsAsideTemplate;
	}

	override componentDidUpdate(oldProps: MainAsideProps, newProps: MainAsideProps): boolean {
		if (!isEqual(oldProps.chats!, newProps.chats!) && newProps.chats) {
			this.setChatList(newProps.chats);
			return true;
		}

		return false;
	}

	setChatList(chats: ChatGetListResponseData[]) {
		const chatList = chats.map((chat) => {
			return new ChatItem({
				id: chat.id,
				avatar: chat.avatar,
				title: chat.title,
				unreadCount: chat.unread_count > 0 ? chat.unread_count : undefined,
				lastMessageContent: chat.last_message
					? getLastMessageContent(chat.last_message)
					: '',
				time: chat.last_message ? getTime(chat.last_message.time) : '',
				onClick: async () => {
					const controller = new ChatController();
					await controller.connect();
				},
			});
		});
		this.setLists({ ChatList: chatList });
	}
}

export default withChats(ChatsAside);
