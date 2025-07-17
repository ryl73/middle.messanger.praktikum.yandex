import router from '@/router/router.ts';
import store from '@/store/store.ts';
import APIError, { ERROR_CODES } from '@/api/APIError.ts';

class ErrorHandler {
	static __instance: ErrorHandler;

	constructor() {
		if (ErrorHandler.__instance) {
			throw new Error('You can only create one instance!');
		}
		ErrorHandler.__instance = this;
	}

	public handle(error: unknown) {
		if (error instanceof APIError) {
			console.error(`[APIError] ${error.statusCode} - ${error.body?.reason}`);
			if (error.statusCode === ERROR_CODES.UNAUTHORIZED) {
				this._handleUnauthorized();
			}
			if (error.statusCode === ERROR_CODES.UNEXPECTED) {
				this._handleUnexpected();
			}
		} else if (error instanceof Error) {
			console.error(`[UnknownError] ${error.message}`);
		} else {
			console.error(`[NonErrorThrown]`, error);
		}
	}

	private _handleUnauthorized() {
		store.set('isAuth', false);
		router.go('/');
	}

	private _handleUnexpected() {
		store.set('isAuth', false);
		router.go('/error');
	}
}

export default new ErrorHandler();
