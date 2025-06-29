import Block from '@/services/Block.ts';
import Registration from './registration.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Header } from '@/components/Header/Header.ts';
import Form from '@/components/Form/Form.ts';

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

		const RegistrationForm = new Form({
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
			onCancel: () => {},
			onSubmit: () => {},
		});

		super({
			Header: new Header(),
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
