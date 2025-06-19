import Block from '@/services/Block.ts';
import Login from './login.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import { Input } from '@/components/Input/Input.ts';
import Validation from '@/services/Validation.ts';

export default class LoginPage extends Block {
	constructor() {
		const LoginInput = new Input({
			name: 'login',
			label: 'Логин',
			errorMessage: 'Неверный логин',
		});

		const PasswordInput = new Input({
			name: 'password',
			label: 'Пароль',
			type: 'password',
			errorMessage: 'Неверный пароль',
		});

		const inputArr = [LoginInput, PasswordInput];

		super({
			LoginInput,
			PasswordInput,
			ButtonLogin: new Button({
				label: 'Войти',
				onClick: (e) => {
					e.preventDefault();
					const isValidArr: boolean[] = [];
					inputArr.forEach((input) => {
						const isValid = new Validation(input.value, input.name).validate(input);
						isValidArr.push(isValid);
					});
					console.log(isValidArr.every((valid) => valid));
				},
			}),
		});
	}

	override render(): string {
		return Login;
	}
}
