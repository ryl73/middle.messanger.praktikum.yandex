import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTPTransport.ts';

export type SignupRequestData = {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
};

export type LoginRequestData = {
	login: string;
	password: string;
};

export type AuthResponseData = {
	id: number;
};

type AuthUserDataPartials = {
	id: number;
	avatar: string | null;
	display_name: string | null;
};

export type AuthUserData = AuthUserDataPartials & SignupRequestData;

export default class AuthAPI extends API {
	constructor() {
		super('/auth');
	}
	public signup(options: OptionsWithoutMethod<SignupRequestData>) {
		return this.http().post<SignupRequestData, AuthResponseData>('/signup', options);
	}

	public login(options: OptionsWithoutMethod<LoginRequestData>) {
		return this.http().post<LoginRequestData, AuthResponseData>('/signin', options);
	}

	public logout(): Promise<void> {
		return this.http().post('/logout');
	}

	public user(): Promise<AuthUserData> {
		return this.http().get<undefined, AuthUserData>('/user');
	}
}
