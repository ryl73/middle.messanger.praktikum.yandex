import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTPTransport.ts';
import type { AuthUserData } from '@/api/AuthAPI.ts';

export type ChatGetListRequestData = {
	offset?: number;
	limit?: number;
	title?: string;
};

export type ChatCreateRequestData = {
	title: string;
};

export type ChatCreateResponseData = {
	title: string;
};

export type ChatGetListResponseData = {
	id: number;
	title: string;
	avatar: string | null;
	unread_count: number;
	created_by: number;
	last_message: LastMessage | null;
};

export type LastMessage = {
	user: Partial<AuthUserData>;
	time: string;
	content: string;
};

export type ChatDeleteRequestData = {
	chatId: number;
};

export type ChatGetTokenResponseData = {
	token: string;
};

export type ChatAddUserRequestData = {
	users: number[];
	chatId: number;
};

export type ChatGetUsersRequestData = {
	offset?: number;
	limit?: number;
	name?: string;
	email?: string;
};

export type ChatGetUsersResponseData = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	avatar: string;
	role: string;
};

export type ChatGetNewMessagesResponseData = {
	unread_count: number;
};

export default class ChatAPI extends API {
	constructor() {
		super('/chats');
	}

	public getList(options: OptionsWithoutMethod<ChatGetListRequestData>) {
		return this.http().get<ChatGetListRequestData, ChatGetListResponseData[]>('/', options);
	}

	public create(options: OptionsWithoutMethod<ChatCreateRequestData>) {
		return this.http().post<ChatCreateRequestData, ChatCreateResponseData>('/', options);
	}

	public delete(options: OptionsWithoutMethod<ChatDeleteRequestData>) {
		return this.http().delete<ChatDeleteRequestData, null>('/', options);
	}

	public getToken(id: number) {
		return this.http().post<null, ChatGetTokenResponseData>(`/token/${id}`, {});
	}

	public addUser(options: OptionsWithoutMethod<ChatAddUserRequestData>) {
		return this.http().put<ChatAddUserRequestData, null>('/users', options);
	}

	public deleteUser(options: OptionsWithoutMethod<ChatAddUserRequestData>) {
		return this.http().delete<ChatAddUserRequestData, null>('/users', options);
	}

	public getUsers(id: number, options: OptionsWithoutMethod<ChatGetUsersRequestData>) {
		return this.http().get<ChatGetUsersRequestData, ChatGetUsersResponseData[]>(
			`/${id}/users`,
			options
		);
	}

	public getNewMessages(id: number, options: OptionsWithoutMethod<null>) {
		return this.http().get<null, ChatGetNewMessagesResponseData>(`/new/${id}`, options);
	}
}
