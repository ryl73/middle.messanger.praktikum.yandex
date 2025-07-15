import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTPTransport.ts';

export type ChangePasswordRequestData = {
	oldPassword: string;
	newPassword: string;
};

export default class UserAPI extends API {
	constructor() {
		super('/user');
	}

	public changePassword(options: OptionsWithoutMethod<ChangePasswordRequestData>) {
		return this.http().put<ChangePasswordRequestData, null>('/password', options);
	}
}
