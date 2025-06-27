import Block from '@/services/Block.ts';
import ChatsAsideTemplate from './ChatsAside.hbs?raw';
import ChatItem from '@/components/ChatItem/ChatItem.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import { Input } from '@/components/Input/Input.ts';
import type { ChatListItem, LastMessage } from '@/types/chat.ts';
import { Button } from '@/components/Button/Button.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import getStringFromUTC from '@/utils/getStringFromUTC.ts';

type MainAsideProps = {
	avatarSrc?: string;
	chatList: ChatListItem[];
};

export default class ChatsAside extends Block {
	constructor(props: MainAsideProps) {
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

		props.chatList.forEach((chat) => {
			const Chat = new ChatItem({
				avatar: chat.avatar,
				title: chat.title,
				unreadCount: chat.unread_count > 0 ? chat.unread_count : undefined,
				lastMessageContent: getLastMessageContent(chat.last_message),
				lastMessageAuthor: undefined,
				time: getStringFromUTC(chat.last_message.time),
			});
			ChatList.push(Chat);
		});

		const SaveButton = new Button({
			label: 'Добавить',
			disabled: true,
			onClick: () => {
				console.log(ChatNameInput.value);
				ChatAddModal.close();
			},
		});

		const ChatNameInput = new Input({
			label: 'Название',
			name: 'chat_name',
			onInput: (value) => {
				if (value !== '') {
					SaveButton.setProps({
						disabled: false,
					});
				} else {
					SaveButton.setProps({
						disabled: true,
					});
				}
			},
		});

		const ChatAddModal = new Modal({
			title: 'Добавить чат',
			slot: [ChatNameInput, SaveButton],
			onClose: () => {
				ChatNameInput.setProps({
					value: '',
				});
			},
		});

		super({
			avatarSrc: props.avatarSrc,
			ChatList,
			Avatar: new Avatar({
				src: props.avatarSrc,
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
