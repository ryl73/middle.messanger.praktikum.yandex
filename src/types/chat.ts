import type { User } from '@/types/user.ts';

export type ChatListItem = {
	id: number;
	title: string;
	avatar: string | null;
	unread_count: number;
	created_by: number;
	last_message: LastMessage;
};

export type LastMessage = {
	user: Partial<User>;
	time: string;
	content: string;
};
