import Block from '@/services/Block.ts';
import Profile from './profile.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import { Input } from '@/components/Input/Input.ts';
import Validation from '@/services/Validation.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';

export default class ProfilePage extends Block {
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

		const DisplayNameInput = new Input({
			name: 'display_name',
			label: 'Имя в чате',
			errorMessage: 'Неверное имя',
		});

		const PhoneInput = new Input({
			name: 'phone',
			label: 'Телефон',
			errorMessage: 'Неверный телефон',
		});

		const OldPasswordInput = new Input({
			name: 'oldPassword',
			label: 'Старый пароль',
			type: 'password',
			errorMessage: 'Неверный пароль',
		});

		const NewPasswordInput = new Input({
			name: 'newPassword',
			label: 'Новый пароль',
			type: 'password',
			errorMessage: 'Неверный пароль',
		});

		const NewPasswordRepeatInput = new Input({
			name: 'newPassword_repeat',
			label: 'Повторите новый пароль',
			type: 'password',
			errorMessage: 'Пароли не совпадают',
		});

		const infoEditInputArr = [
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			DisplayNameInput,
			PhoneInput,
		];

		const passwordEditInputArr = [OldPasswordInput, NewPasswordInput, NewPasswordRepeatInput];

		super({
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			DisplayNameInput,
			PhoneInput,
			OldPasswordInput,
			NewPasswordInput,
			NewPasswordRepeatInput,
			Avatar: new Avatar({
				src: '/media/images/avatar-default.png',
				hoverText: 'Поменять аватар',
			}),
			ButtonBack: new Button({
				icon: `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
						<path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`,
			}),
			ButtonSaveInfo: new Button({
				label: 'Сохранить',
				type: 'submit',
				onClick: (e) => {
					e.preventDefault();
					const isValidArr: boolean[] = [];
					infoEditInputArr.forEach((input) => {
						const isValid = new Validation(input.value, input.name).validate(input);
						isValidArr.push(isValid);
					});
					console.log(isValidArr.every((valid) => valid));
				},
			}),
			ButtonSavePassword: new Button({
				label: 'Сохранить',
				type: 'submit',
				onClick: (e) => {
					e.preventDefault();
					const isValidArr: boolean[] = [];
					passwordEditInputArr.forEach((input) => {
						const isValid = new Validation(input.value, input.name).validate(input);
						isValidArr.push(isValid);
					});
					console.log(isValidArr.every((valid) => valid));
				},
			}),
		});
	}

	override render(): string {
		return Profile;
	}
}
