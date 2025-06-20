import Block from '@/services/Block.ts';
import Registration from './Registration.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import { Input } from '@/components/Input/Input.ts';
import Validation from '@/services/Validation.ts';
import { Link } from '@/components/Link/Link.ts';
import { Header } from '@/components/Header/Header.ts';

export default class RegistrationPage extends Block {
	constructor() {
		const EmailInput = new Input({
			name: 'email',
			label: 'Почта',
			errorMessage: 'Неверная почта',
		});

		const LoginInput = new Input({
			name: 'login',
			label: 'Логин',
			errorMessage: 'Неверный логин',
		});

		const FirstNameInput = new Input({
			name: 'first_name',
			label: 'Имя',
			errorMessage: 'Неверное имя',
		});

		const SecondNameInput = new Input({
			name: 'second_name',
			label: 'Фамилия',
			errorMessage: 'Неверная фамилия',
		});

		const PhoneInput = new Input({
			name: 'phone',
			label: 'Телефон',
			errorMessage: 'Неверный телефон',
		});

		const PasswordInput = new Input({
			name: 'password',
			label: 'Пароль',
			type: 'password',
			errorMessage: 'Неверный пароль',
		});

		const PasswordRepeatInput = new Input({
			name: 'password_repeat',
			label: 'Повторите пароль',
			type: 'password',
			errorMessage: 'Пароли не совпадают',
		});

		const inputArr = [
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			PhoneInput,
			PasswordInput,
			PasswordRepeatInput,
		];

		super({
			Header: new Header(),
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			PhoneInput,
			PasswordInput,
			PasswordRepeatInput,
			ButtonRegister: new Button({
				label: 'Создать аккаунт',
				onClick: (e) => {
					e.preventDefault();
					const isValidArr: boolean[] = [];
					inputArr.forEach((input) => {
						let isValid;
						if (input === PasswordRepeatInput) {
							isValid = new Validation(
								input.value,
								input.value === PasswordInput.value && input.value !== ''
							).validate(input);
						} else {
							isValid = new Validation(input.value, input.name).validate(input);
						}
						isValidArr.push(isValid);
					});
					console.log(isValidArr.every((valid) => valid));
				},
			}),
			LinkLogin: new Link({
				label: 'Войти',
				font: 'fs-p-bold',
				page: 'login',
			}),
		});
	}

	override render(): string {
		return Registration;
	}
}
