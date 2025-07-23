import HTTP from '@/services/HTTPTransport.ts';
import HTTPTransport from '@/services/HTTPTransport.ts';

export default abstract class API {
	_authAPIInstance;
	private BASE_PATH: string = '/api/v2';

	protected constructor(path: string) {
		this._authAPIInstance = new HTTP(this.BASE_PATH + path);
	}

	http(): HTTPTransport {
		return this._authAPIInstance;
	}
}
