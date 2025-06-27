import Block from '@/services/Block.ts';
import Login from './login.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Header } from '@/components/Header/Header.ts';
import Form from '@/components/Form/Form.ts';

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

		const LoginForm = new Form({
			InputList: [LoginInput, PasswordInput],
			submitProps: {
				label: 'Войти',
			},
			cancelProps: {
				label: 'Нет аккаунта? Зарегистрируйтесь!',
			},
			onCancel: () => {},
			onSubmit: () => {},
		});

		super({
			Header: new Header(),
			LoginInput,
			PasswordInput,
			LoginForm,
		});
	}

	override render(): string {
		return Login;
	}
}
