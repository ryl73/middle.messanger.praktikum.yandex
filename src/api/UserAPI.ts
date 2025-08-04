import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTP/HTTPTransport.ts';

export type ChangePasswordRequestData = {
	oldPassword: string;
	newPassword: string;
};

export type SearchRequestData = {
	login: string;
};

export type SearchResponseData = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	avatar: string;
};

export default class UserAPI extends API {
	constructor() {
		super('/user');
	}

	public changePassword(options: OptionsWithoutMethod<ChangePasswordRequestData>) {
		return this.http().put<ChangePasswordRequestData, null>('/password', options);
	}

	public search(options: OptionsWithoutMethod<SearchRequestData>) {
		return this.http().post<SearchRequestData, SearchResponseData[]>('/search', options);
	}
}
