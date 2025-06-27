import Block from '@/services/Block.ts';
import ProfileTemplate from './profile.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import { Input } from '@/components/Input/Input.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { FileInput } from '@/components/FileInput/FileInput.ts';
import { InfoField } from '@/components/InfoField/InfoField.ts';
import { Link } from '@/components/Link/Link.ts';
import { Header } from '@/components/Header/Header.ts';
import Form from '@/components/Form/Form.ts';

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

		const ProfileEditForm = new Form({
			InputList: [
				EmailInput,
				LoginInput,
				FirstNameInput,
				SecondNameInput,
				DisplayNameInput,
				PhoneInput,
			],
			initialValues: INITIAL_VALUE_MAP,
			onCancel: () => {
				this.setActiveFrame(0);
			},
			onSubmit: () => {
				this.setActiveFrame(0);
			},
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

		const PasswordEditForm = new Form({
			InputList: [OldPasswordInput, NewPasswordInput, NewPasswordRepeatInput],
			removeList: ['newPassword_repeat'],
			onCancel: () => {
				this.setActiveFrame(0);
			},
			onSubmit: () => {
				this.setActiveFrame(0);
			},
		});

		const AvatarInput = new FileInput({
			label: 'Выбрать файл на компьютере',
			name: 'avatar',
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
					AvatarEditForm.buttonSubmitEl.setProps({
						disabled: false,
					});
				}
			},
		});

		const AvatarEditForm = new Form({
			InputList: [AvatarInput],
			noCancel: true,
			submitProps: {
				label: 'Изменить',
				disabled: true,
			},
			onSubmit: () => {
				AvatarModal.close();
			},
		});

		const AvatarModal = new Modal({
			title: 'Загрузить файл',
			slot: [AvatarEditForm],
			onClose: () => {
				if (AvatarInput.value) {
					AvatarInput.setProps({
						value: null,
						label: 'Выбрать файл на компьютере',
					});
				}
				AvatarEditForm.buttonSubmitEl.setProps({
					disabled: true,
				});
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

		super({
			...props,
			Header: new Header(),
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
			ButtonBack: new Button({
				modifier: 'round',
				icon: `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
							<path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					`,
			}),
			ProfileEditForm,
			PasswordEditForm,
		});
	}

	override render(): string {
		return ProfileTemplate;
	}

	public setActiveFrame(index: number) {
		const profileContent = document.querySelectorAll('.profile__content');

		profileContent.forEach((elem) => elem.classList.remove('active'));
		profileContent[index].classList.add('active');
	}
}
