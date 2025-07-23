type ResponseErrorMessage = {
	reason: string;
};

export const ERROR_CODES = {
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	UNEXPECTED: 500,
} as const;

export type ErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export default class APIError extends Error {
	public statusCode: number;
	public body?: ResponseErrorMessage;
	public isOperational: boolean;

	constructor(
		message: string,
		statusCode: number = ERROR_CODES.UNEXPECTED,
		body?: ResponseErrorMessage,
		isOperational = true
	) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.body = body;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}
