import Block from '@/services/Block.ts';
import Registration from './registration.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import Form from '@/components/Form/Form.ts';
import router from '@/router/router.ts';
import AuthController from '@/controllers/AuthController.ts';
import type { SignupRequestData } from '@/api/AuthAPI.ts';

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

		const RegistrationForm = new Form<SignupRequestData>({
			InputList: [
				EmailInput,
				LoginInput,
				FirstNameInput,
				SecondNameInput,
				PhoneInput,
				PasswordInput,
				PasswordRepeatInput,
			],
			submitProps: {
				label: 'Создать аккаунт',
			},
			cancelProps: {
				label: 'Войти',
			},
			removeList: ['password_repeat'],
			onCancel: () => {
				router.go('/');
			},
			onSubmit: async (data) => {
				const controller = new AuthController();
				await controller.signUp(data);
			},
		});

		super({
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			PhoneInput,
			PasswordInput,
			PasswordRepeatInput,
			RegistrationForm,
		});
	}

	override render(): string {
		return Registration;
	}
}
