import router from '@/router/router.ts';
import store from '@/store/store.ts';
import APIError, { ERROR_CODES } from '@/api/APIError.ts';
import Popup from '@/components/Popup/Popup.ts';

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
				this._handleUnauthorized(error);
			}
			if (error.statusCode === ERROR_CODES.UNEXPECTED) {
				this._handleUnexpected();
			}
			if (
				error.statusCode === ERROR_CODES.BAD_REQUEST ||
				error.statusCode === ERROR_CODES.NOT_FOUND
			) {
				this._handleBadRequest(error);
			}
		} else if (error instanceof Error) {
			console.error(`[UnknownError] ${error.message}`);
		} else {
			console.error(`[NonErrorThrown]`, error);
		}
	}

	private _handleUnauthorized(error: APIError) {
		if (error.body) {
			const PopupEl = new Popup({ message: error.body.reason, type: 'error' });
			const app = document.querySelector('#app');
			app?.appendChild(PopupEl.getContent());
		}
		store.set('isAuth', false);
		router.go('/');
	}

	private _handleUnexpected() {
		store.set('isAuth', false);
		router.go('/error');
	}

	private _handleBadRequest(error: APIError) {
		const PopupEl = new Popup({ message: error.body?.reason || error.message });
		const app = document.querySelector('#app');
		app?.appendChild(PopupEl.getContent());
	}
}

export default new ErrorHandler();
