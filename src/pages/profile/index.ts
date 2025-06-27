import Block from '@/services/Block.ts';
import Profile from './profile.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import { Input } from '@/components/Input/Input.ts';
import Validation from '@/services/Validation.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { FileInput } from '@/components/FileInput/FileInput.ts';
import { InfoField } from '@/components/InfoField/InfoField.ts';
import { Link } from '@/components/Link/Link.ts';
import { Header } from '@/components/Header/Header.ts';

type ProfilePageProps = {
	email: string;
	login: string;
	firstName: string;
	secondName: string;
	displayName: string;
	phone: string;
	avatar?: string;
};

export default class ProfilePage extends Block {
	constructor(props: ProfilePageProps) {
		const INITIAL_VALUE_MAP: Record<string, string> = {
			email: props.email,
			login: props.login,
			first_name: props.firstName,
			second_name: props.secondName,
			display_name: props.displayName,
			phone: props.phone,
		};

		const EmailInput = new Input({
			name: 'email',
			label: 'Почта',
			errorMessage: 'Неверная почта',
			value: props.email,
		});

		const LoginInput = new Input({
			name: 'login',
			label: 'Логин',
			errorMessage: 'Неверный логин',
			value: props.login,
		});

		const FirstNameInput = new Input({
			name: 'first_name',
			label: 'Имя',
			errorMessage: 'Неверное имя',
			value: props.firstName,
		});

		const SecondNameInput = new Input({
			name: 'second_name',
			label: 'Фамилия',
			errorMessage: 'Неверная фамилия',
			value: props.secondName,
		});

		const DisplayNameInput = new Input({
			name: 'display_name',
			label: 'Имя в чате',
			errorMessage: 'Неверное имя',
			value: props.displayName,
		});

		const PhoneInput = new Input({
			name: 'phone',
			label: 'Телефон',
			errorMessage: 'Неверный телефон',
			value: props.phone,
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

		const SaveButton = new Button({
			label: 'Изменить',
			disabled: true,
			onClick: () => {
				console.log(AvatarInput.value);
				AvatarModal.close();
			},
		});

		const AvatarInput = new FileInput({
			label: 'Выбрать файл на компьютере',
			onClick: (e) => {
				const inputContainer = e.currentTarget;
				if (inputContainer instanceof HTMLElement) {
					const inputEl = inputContainer.querySelector('input');
					if (inputEl instanceof HTMLInputElement) {
						inputEl.click();
					}
				}
			},
			onChange: (files) => {
				if (files) {
					AvatarInput.setProps({
						value: files[0],
					});
					SaveButton.setProps({
						disabled: false,
					});
				}
			},
		});

		const AvatarModal = new Modal({
			title: 'Загрузить файл',
			slot: [AvatarInput, SaveButton],
			onClose: () => {
				if (AvatarInput.value) {
					AvatarInput.setProps({
						value: null,
						label: 'Выбрать файл на компьютере',
					});
				}
			},
		});

		const AvatarComponent = new Avatar({
			src: props.avatar,
			hoverText: 'Поменять аватар',
			AvatarModal,
			onClick: () => {
				AvatarModal.show();
			},
		});

		const LinkChangeInfo = new Link({
			label: 'Изменить данные',
			font: 'fs-default-bold',
			onClick: () => {
				this.setActiveFrame(1);
			},
		});

		const LinkChangePassword = new Link({
			label: 'Изменить пароль',
			font: 'fs-default-bold',
			onClick: () => {
				this.setActiveFrame(2);
			},
		});

		const LinkLogout = new Link({
			label: 'Выйти',
			font: 'fs-default-bold',
			modifier: 'red',
			page: 'login',
		});

		const LinkCancelInfo = new Link({
			label: 'Отменить',
			font: 'fs-p-bold',
			onClick: () => {
				infoEditInputArr.forEach((input) => {
					input.setProps({
						value: INITIAL_VALUE_MAP[input.name],
						isError: false,
					});
				});
				this.setActiveFrame(0);
			},
		});

		const LinkCancelPassword = new Link({
			label: 'Отменить',
			font: 'fs-p-bold',
			onClick: () => {
				passwordEditInputArr.forEach((input) => {
					input.setProps({
						value: '',
						isError: false,
					});
				});
				this.setActiveFrame(0);
			},
		});

		const ButtonSaveInfo = new Button({
			label: 'Сохранить',
			type: 'submit',
			onClick: (e) => {
				e.preventDefault();
				const isValidArr: boolean[] = [];
				infoEditInputArr.forEach((input) => {
					const isValid = new Validation(input.value, input.name).validate(input);
					isValidArr.push(isValid);
				});
				const isValid = isValidArr.every((valid) => valid);
				if (isValid) {
					this.setActiveFrame(0);
				}
			},
		});

		const ButtonSavePassword = new Button({
			label: 'Сохранить',
			type: 'submit',
			onClick: (e) => {
				e.preventDefault();
				const isValidArr: boolean[] = [];
				passwordEditInputArr.forEach((input) => {
					const isValid = new Validation(input.value, input.name).validate(input);
					isValidArr.push(isValid);
				});
				const isValid = isValidArr.every((valid) => valid);
				if (isValid) {
					this.setActiveFrame(0);
				}
			},
		});

		super({
			...props,
			Header: new Header(),
			EmailInput,
			LoginInput,
			FirstNameInput,
			SecondNameInput,
			DisplayNameInput,
			PhoneInput,
			OldPasswordInput,
			NewPasswordInput,
			NewPasswordRepeatInput,
			InfoFieldEmail: new InfoField({
				label: 'Почта',
				value: props.email,
			}),
			InfoFieldLogin: new InfoField({
				label: 'Логин',
				value: props.login,
			}),
			InfoFieldFirstName: new InfoField({
				label: 'Имя',
				value: props.firstName,
			}),
			InfoFieldSecondName: new InfoField({
				label: 'Фамилия',
				value: props.secondName,
			}),
			InfoFieldDisplayName: new InfoField({
				label: 'Имя в чате',
				value: props.displayName,
			}),
			InfoFieldPhone: new InfoField({
				label: 'Телефон',
				value: props.phone,
			}),
			AvatarComponent,
			LinkChangeInfo,
			LinkChangePassword,
			LinkLogout,
			LinkCancelInfo,
			LinkCancelPassword,
			ButtonBack: new Button({
				modifier: 'round',
				icon: `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
							<path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					`,
			}),
			ButtonSaveInfo,
			ButtonSavePassword,
		});
	}

	override render(): string {
		return Profile;
	}

	public setActiveFrame(index: number) {
		const profileContent = document.querySelectorAll('.profile__content');

		profileContent.forEach((elem) => elem.classList.remove('active'));
		profileContent[index].classList.add('active');
	}
}
