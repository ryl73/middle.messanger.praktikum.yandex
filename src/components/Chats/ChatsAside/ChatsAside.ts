import Block from '@/services/Block/Block.ts';
import ChatsAsideTemplate from './ChatsAside.hbs?raw';
import ChatItem from '@/components/Chats/ChatItem/ChatItem.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import { Input } from '@/components/Input/Input.ts';
import type { ChatListItem, LastMessage } from '@/types/chat.ts';
import { Button } from '@/components/Button/Button.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { getTime } from '@/utils/getTime.ts';
import Form from '@/components/Form/Form.ts';
import type ChatsMain from '@/components/Chats/ChatsMain/ChatsMain.ts';

type MainAsideProps = {
	avatarSrc: string | null;
	chatList: ChatListItem[];
	main: ChatsMain;
	ChatList: ChatItem[];
	Avatar: Avatar;
	SearchInput: Input;
	ButtonChatAdd: Button;
	ChatAddModal: Modal;
};

export default class ChatsAside extends Block<MainAsideProps> {
	constructor(props: Partial<MainAsideProps>) {
		const ChatList: ChatItem[] = [];

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

		props.chatList?.forEach((chat) => {
			const Chat = new ChatItem({
				id: chat.id,
				avatar: chat.avatar,
				title: chat.title,
				unreadCount: chat.unread_count > 0 ? chat.unread_count : undefined,
				lastMessageContent: getLastMessageContent(chat.last_message),
				lastMessageAuthor: undefined,
				time: getTime(chat.last_message.time),
				onClick: () => {
					ChatList.forEach((chat) => {
						chat.setProps({
							active: false,
						});
					});
					props.main?.setProps({
						selectedChat: chat.id,
					});
				},
			});
			ChatList.push(Chat);
		});

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

		const ChatAddForm = new Form({
			InputList: [ChatNameInput],
			noCancel: true,
			submitProps: {
				label: 'Добавить',
				disabled: true,
			},
			onSubmit: () => {
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
			avatarSrc: props.avatarSrc,
			ChatList,
			Avatar: new Avatar({
				src: props.avatarSrc!,
				onClick: (e) => {
					console.log(e);
				},
			}),
			SearchInput: new Input({
				name: 'search',
				placeholder: 'Поиск',
				search: true,
			}),
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
