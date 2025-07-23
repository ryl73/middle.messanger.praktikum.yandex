import Block from '@/services/Block.ts';
import Login from './login.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import Form from '@/components/Form/Form.ts';
import router, { routes } from '@/router/router.ts';
import AuthController from '@/controllers/AuthController.ts';
import type { LoginRequestData } from '@/api/AuthAPI.ts';

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

		const LoginForm = new Form<LoginRequestData>({
			InputList: [LoginInput, PasswordInput],
			submitProps: {
				label: 'Войти',
			},
			cancelProps: {
				label: 'Нет аккаунта? Зарегистрируйтесь!',
			},
			onCancel: () => {
				router.go(routes.SIGNUP);
			},
			onSubmit: async (data) => {
				const controller = new AuthController();
				await controller.login(data);
			},
		});

		super({
			LoginInput,
			PasswordInput,
			LoginForm,
		});
	}

	override render(): string {
		return Login;
	}
}
