import type Block from '@/services/Block.ts';

export default class Validation {
	static REGEX: Record<string, RegExp> = {
		email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.([a-zA-Z]{2,})$/,
		login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
		password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
		oldPassword: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
		newPassword: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
		phone: /^\+?\d{10,15}$/,
		first_name: /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/,
		second_name: /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/,
		display_name: /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/,
	};
	private readonly regex: RegExp | null = null;
	private readonly rule: boolean | null = null;
	private readonly value: string;

	constructor(value: string, name: string) {
		this.value = value;
		if (name === 'password_repeat') {
			const passwordInput = document.querySelector('input[name="password"]');
			if (passwordInput instanceof HTMLInputElement) {
				this.rule = value === passwordInput.value && value !== '';
				return;
			}
		}

		if (name === 'newPassword_repeat') {
			const passwordInput = document.querySelector('input[name="newPassword"]');
			if (passwordInput instanceof HTMLInputElement) {
				this.rule = value === passwordInput.value && value !== '';
				return;
			}
		}

		this.regex = Validation.REGEX[name];
	}

	public validate(instance: Block): boolean {
		let isValid;
		if (this.regex) {
			isValid = this.regex.test(this.value);
		} else {
			isValid = this.rule as boolean;
		}
		if (!isValid) {
			instance.setProps({
				isError: true,
			});
			return false;
		}

		instance.setProps({
			isError: false,
		});
		return true;
	}
}
