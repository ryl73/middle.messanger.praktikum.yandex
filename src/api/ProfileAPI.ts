import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTP/HTTPTransport.ts';

export type ProfileRequestData = {
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	phone: string;
};

type ProfileResponseDataPartial = {
	id: number;
	avatar: string | null;
};

export type ProfileResponseData = ProfileRequestData & ProfileResponseDataPartial;

export default class ProfileAPI extends API {
	constructor() {
		super('/user/profile');
	}

	public set(options: OptionsWithoutMethod<ProfileRequestData>) {
		return this.http().put<ProfileRequestData, ProfileResponseData>('/', options);
	}

	public setAvatar(options: OptionsWithoutMethod<FormData>) {
		return this.http().put<FormData, ProfileResponseData>('/avatar', options);
	}
}
