import HTTPTransport from '@/services/HTTP/HTTPTransport.ts';
import APIError from '@/api/APIError.ts';

const mockXHR = () => {
	const xhr: Partial<XMLHttpRequest> = {
		open: jest.fn(),
		send: jest.fn(),
		setRequestHeader: jest.fn(),
	};

	Object.defineProperty(xhr, 'readyState', { value: 4 });
	Object.defineProperty(xhr, 'status', { value: 200, writable: true, configurable: true });
	Object.defineProperty(xhr, 'response', {
		value: { success: true },
		writable: true,
		configurable: true,
	});

	const mockXhrInstance = xhr as XMLHttpRequest;

	global.XMLHttpRequest = jest.fn(() => mockXhrInstance) as any;

	return {
		xhr: mockXhrInstance,
		open: xhr.open!,
		send: xhr.send!,
		setRequestHeader: xhr.setRequestHeader!,
		trigger: {
			load: () => mockXhrInstance.onload?.(new Event('load') as ProgressEvent),
			error: () => mockXhrInstance.onerror?.(new Event('error') as ProgressEvent),
			abort: () => mockXhrInstance.onabort?.(new Event('abort') as ProgressEvent),
			timeout: () => mockXhrInstance.ontimeout?.(new Event('timeout') as ProgressEvent),
		},
		setStatus: (status: number) => {
			Object.defineProperty(mockXhrInstance, 'status', { value: status, configurable: true });
		},
		setResponse: (response: any) => {
			Object.defineProperty(mockXhrInstance, 'response', {
				value: response,
				configurable: true,
			});
		},
	};
};

describe('HTTPTransport', () => {
	let transport: HTTPTransport;

	beforeEach(() => {
		transport = new HTTPTransport('/api/v2');
		jest.clearAllMocks();
	});

	it('should make a GET request and resolve on success', async () => {
		const mock = mockXHR();
		const promise = transport.get('/test', { data: { a: 1 } });

		mock.trigger.load();

		await expect(promise).resolves.toEqual({ success: true });
		expect(mock.open).toHaveBeenCalledWith('GET', 'https://ya-praktikum.tech/api/v2/test?a=1');
	});

	it('should make a POST request with JSON payload', async () => {
		const mock = mockXHR();
		const data = { key: 'value' };

		const promise = transport.post('/post', { data });

		mock.trigger.load();

		await expect(promise).resolves.toEqual({ success: true });
		expect(mock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
		expect(mock.send).toHaveBeenCalledWith(JSON.stringify(data));
	});

	it('should handle API error status', async () => {
		const mock = mockXHR();
		mock.setStatus(404);
		mock.setResponse({ message: 'Not found' });

		const promise = transport.get('/fail');

		mock.trigger.load();

		await expect(promise).rejects.toThrow(APIError);
	});

	it('should handle network error', async () => {
		const mock = mockXHR();
		const promise = transport.get('/fail');
		mock.trigger.error();

		await expect(promise).rejects.toThrow('Request error');
	});

	it('should handle abort', async () => {
		const mock = mockXHR();
		const promise = transport.get('/abort');
		mock.trigger.abort();

		await expect(promise).rejects.toThrow('Request aborted');
	});

	it('should handle timeout', async () => {
		const mock = mockXHR();
		const promise = transport.get('/timeout');
		mock.trigger.timeout();

		await expect(promise).rejects.toThrow('Request timed out');
	});

	it('should send FormData correctly', async () => {
		const mock = mockXHR();
		const formData = new FormData();
		formData.append('key', 'value');

		const promise = transport.post('/form', { data: formData });

		mock.trigger.load();

		await expect(promise).resolves.toEqual({ success: true });
		expect(mock.setRequestHeader).not.toHaveBeenCalledWith('Content-Type', 'application/json');
		expect(mock.send).toHaveBeenCalledWith(formData);
	});
});
