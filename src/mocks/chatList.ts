import type { ChatListItem } from '@/types/chat.ts';

const CHAT_LIST: ChatListItem[] = [
	{
		id: 1,
		title: 'Андрей',
		avatar: null,
		unread_count: 2,
		created_by: 12345,
		last_message: {
			user: {
				first_name: 'Андрей',
				second_name: 'Андреев',
				avatar: '/path/to/avatar.jpg',
				email: 'my@email.com',
				login: 'userLogin',
				phone: '8(911)-222-33-22',
			},
			time: '2025-06-23T14:22:22.000Z',
			content: '/path/to/file.jpg',
		},
	},
	{
		id: 2,
		title: 'Николай',
		avatar: null,
		unread_count: 0,
		created_by: 12345,
		last_message: {
			user: {
				first_name: 'Николай',
				second_name: 'Николай',
				avatar: '/path/to/avatar.jpg',
				email: 'my@email.com',
				login: 'userLogin',
				phone: '8(911)-222-33-22',
			},
			time: '2020-01-02T14:22:22.000Z',
			content: 'this is message content',
		},
	},
];

export default CHAT_LIST;
