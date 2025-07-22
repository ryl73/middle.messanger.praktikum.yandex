import API from '@/api/API.ts';
import { type OptionsWithoutMethod } from '@/services/HTTPTransport.ts';

export type ResourcesResponseData = {
	id: string;
	user_id: number;
	path: string;
	filename: string;
	content_type: string;
	content_size: number;
	upload_date: string;
};

export default class ResourcesAPI extends API {
	constructor() {
		super('/resources');
	}

	public set(options: OptionsWithoutMethod<FormData>) {
		return this.http().post<FormData, ResourcesResponseData>('/', options);
	}
}
