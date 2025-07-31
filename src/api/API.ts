import HTTPTransport from '@/services/HTTP/HTTPTransport.ts';

export default abstract class API {
	_authAPIInstance;
	private BASE_PATH: string = '/api/v2';

	protected constructor(path: string) {
		this._authAPIInstance = new HTTPTransport(this.BASE_PATH + path);
	}

	http(): HTTPTransport {
		return this._authAPIInstance;
	}
}
