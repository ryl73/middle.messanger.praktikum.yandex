import APIError from '@/api/APIError.ts';

const METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
} as const;

type METHODS = (typeof METHODS)[keyof typeof METHODS];

type RequestData = Record<string, string | number | boolean | null | undefined> | FormData;

type Options<T = RequestData> = {
	method: METHODS;
	data?: T;
	headers?: Record<string, string>;
	timeout?: number;
	withCredentials?: boolean;
	responseType?: XMLHttpRequestResponseType;
};

export type OptionsWithoutMethod<T = RequestData> = Omit<Options<T>, 'method'>;

const queryStringify = (data: Exclude<RequestData, FormData>): string => {
	if (typeof data !== 'object' || data === null) {
		throw new Error('input must be an object');
	}
	return `?${new URLSearchParams(
		Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
			if (value !== undefined && value !== null) {
				acc[key] = String(value);
			}
			return acc;
		}, {})
	).toString()}`;
};

export default class HTTPTransport {
	private static BASE_PATH: string = 'https://ya-praktikum.tech';
	private readonly _baseUrl: string;

	constructor(baseUrl?: string) {
		this._baseUrl = baseUrl ? `${HTTPTransport.BASE_PATH}${baseUrl}` : HTTPTransport.BASE_PATH;
	}

	request<TData = RequestData, TResponse = unknown>(
		url: string,
		options: Options<TData>,
		timeout = 5000
	): Promise<TResponse> {
		const {
			method,
			data,
			headers = {},
			withCredentials = true,
			responseType = 'json',
		} = options;

		return new Promise((resolve, reject) => {
			if (!method) {
				return reject(new Error('No method'));
			}
			const xhr = new XMLHttpRequest();

			const isGet = method === METHODS.GET;

			const fullUrl = `${this._baseUrl}${
				isGet && data && !(data instanceof FormData) ? `${url}${queryStringify(data)}` : url
			}`;

			xhr.open(method, fullUrl);

			Object.entries(headers).forEach(([key, value]) => {
				xhr.setRequestHeader(key, value);
			});

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(xhr.response as TResponse);
				} else {
					reject(new APIError('API Error', xhr.status, xhr.response));
				}
			};

			xhr.onerror = () => reject(new Error('Request error'));
			xhr.onabort = () => reject(new Error('Request aborted'));

			xhr.timeout = timeout;
			xhr.ontimeout = () => reject(new Error('Request timed out'));

			xhr.withCredentials = withCredentials;
			xhr.responseType = responseType;

			if (isGet || !data) {
				xhr.send();
			} else {
				const payload = data instanceof FormData ? data : JSON.stringify(data);
				if (!(data instanceof FormData)) {
					xhr.setRequestHeader('Content-Type', 'application/json');
				}
				xhr.send(payload);
			}
		});
	}

	get<TData = RequestData, TResponse = unknown>(
		url: string,
		options: OptionsWithoutMethod<TData> = {}
	): Promise<TResponse> {
		return this.request<TData, TResponse>(url, { ...options, method: METHODS.GET });
	}

	post<TData = RequestData, TResponse = unknown>(
		url: string,
		options: OptionsWithoutMethod<TData> = {}
	): Promise<TResponse> {
		return this.request<TData, TResponse>(url, { ...options, method: METHODS.POST });
	}

	put<TData = RequestData, TResponse = unknown>(
		url: string,
		options: OptionsWithoutMethod<TData> = {}
	): Promise<TResponse> {
		return this.request<TData, TResponse>(url, { ...options, method: METHODS.PUT });
	}

	delete<TData = RequestData, TResponse = unknown>(
		url: string,
		options: OptionsWithoutMethod<TData> = {}
	): Promise<TResponse> {
		return this.request<TData, TResponse>(url, { ...options, method: METHODS.DELETE });
	}
}
