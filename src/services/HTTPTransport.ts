const METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
} as const;

type METHODS = (typeof METHODS)[keyof typeof METHODS];

type Options = {
	method: METHODS;
	data?: Record<string, any>;
	headers?: Record<string, string>;
	timeout?: number;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

const queryStringify = (data: Record<string, any>): string => {
	if (typeof data !== 'object' || data === null) {
		throw new Error('Data must be a non-null object');
	}
	return `?${new URLSearchParams(data).toString()}`;
};

class HTTPTransport {
	request = (url: string, options: Options, timeout = 5000): Promise<XMLHttpRequest> => {
		const { method, data, headers = {} } = options;

		return new Promise((resolve, reject) => {
			if (!method) {
				return reject(new Error('No method'));
			}
			const xhr = new XMLHttpRequest();

			const isGet = method === METHODS.GET;

			const fullUrl = isGet && data ? `${url}${queryStringify(data)}` : url;
			xhr.open(method, fullUrl);

			Object.entries(headers).forEach(([key, value]) => {
				xhr.setRequestHeader(key, value);
			});

			xhr.onload = function () {
				resolve(xhr);
			};

			xhr.onload = () => resolve(xhr);
			xhr.onerror = () => reject(new Error('Request error'));
			xhr.onabort = () => reject(new Error('Request aborted'));
			xhr.timeout = timeout;
			xhr.ontimeout = () => reject(new Error('Request timed out'));

			if (isGet || !data) {
				xhr.send();
			} else {
				xhr.send(data instanceof FormData ? data : JSON.stringify(data));
			}
		});
	};

	private createMethod =
		(method: METHODS) =>
		(url: string, options: OptionsWithoutMethod = {}) =>
			this.request(url, { ...options, method }, options.timeout);

	get = this.createMethod(METHODS.GET);
	post = this.createMethod(METHODS.POST);
	put = this.createMethod(METHODS.PUT);
	patch = this.createMethod(METHODS.PATCH);
	delete = this.createMethod(METHODS.DELETE);
}

export default new HTTPTransport();
