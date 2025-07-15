import Block, { type CommonBlockProps } from '@/services/Block.ts';
import ProfileSectionTemplate from './ProfileSection.hbs?raw';
import type { AuthUserData } from '@/api/AuthAPI.ts';
import { Input } from '@/components/Input/Input.ts';
import Form from '@/components/Form/Form.ts';
import { FileInput } from '@/components/FileInput/FileInput.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { Avatar } from '@/components/Avatar/Avatar.ts';
import { Link } from '@/components/Link/Link.ts';
import { InfoField } from '@/components/InfoField/InfoField.ts';
import isEqual from '@/utils/isEqual.ts';
import ProfileController from '@/controllers/ProfileController.ts';
import type { ProfileRequestData } from '@/api/ProfileAPI.ts';
import UserController from '@/controllers/UserController.ts';
import type { ChangePasswordRequestData } from '@/api/UserAPI.ts';
import AuthController from '@/controllers/AuthController.ts';
import withUser from '@/store/connect/withUser.ts';

type ProfileSectionProps = {
	user?: Partial<AuthUserData>;
	InfoFieldEmail: InfoField;
	InfoFieldLogin: InfoField;
	InfoFieldFirstName: InfoField;
	InfoFieldSecondName: InfoField;
	InfoFieldDisplayName: InfoField;
	InfoFieldPhone: InfoField;
	AvatarComponent: Avatar;
	LinkChangeInfo: Link;
	LinkChangePassword: Link;
	LinkLogout: Link;
	ProfileEditForm: Form<any>;
	PasswordEditForm: Form<any>;
};

class ProfileSection extends Block<ProfileSectionProps> {
	constructor(props: Partial<ProfileSectionProps>) {
		const INITIAL_VALUE_MAP: Partial<AuthUserData> = {
			email: props.user?.email,
			login: props.user?.login,
			first_name: props.user?.first_name,
			second_name: props.user?.second_name,
			display_name: props.user?.display_name,
			phone: props.user?.phone,
			avatar: props.user?.avatar,
		};

		const EmailInput = new Input({
			name: 'email',
			label: 'Почта',
			errorMessage: 'Неверная почта',
			value: INITIAL_VALUE_MAP.email,
		});

		const LoginInput = new Input({
			name: 'login',
			label: 'Логин',
			errorMessage: 'Неверный логин',
			value: INITIAL_VALUE_MAP.login,
		});

		const FirstNameInput = new Input({
			name: 'first_name',
			label: 'Имя',
			errorMessage: 'Неверное имя',
			value: INITIAL_VALUE_MAP.first_name,
		});

		const SecondNameInput = new Input({
			name: 'second_name',
			label: 'Фамилия',
			errorMessage: 'Неверная фамилия',
			value: INITIAL_VALUE_MAP.second_name,
		});

		const DisplayNameInput = new Input({
			name: 'display_name',
			label: 'Имя в чате',
			errorMessage: 'Неверное имя',
			value: INITIAL_VALUE_MAP.display_name!,
		});

		const PhoneInput = new Input({
			name: 'phone',
			label: 'Телефон',
			errorMessage: 'Неверный телефон',
			value: INITIAL_VALUE_MAP.phone,
		});

		const ProfileEditForm = new Form<ProfileRequestData>({
			InputList: [
				EmailInput,
				LoginInput,
				FirstNameInput,
				SecondNameInput,
				DisplayNameInput,
				PhoneInput,
			],
			initialValues: INITIAL_VALUE_MAP as Record<string, string>,
			onCancel: () => {
				this.setActiveFrame(0);
			},
			onSubmit: async (data) => {
				const controller = new ProfileController();
				await controller.set(data);
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

		const PasswordEditForm = new Form<ChangePasswordRequestData>({
			InputList: [OldPasswordInput, NewPasswordInput, NewPasswordRepeatInput],
			removeList: ['newPassword_repeat'],
			onCancel: () => {
				this.setActiveFrame(0);
			},
			onSubmit: async (data) => {
				const controller = new UserController();
				await controller.changePassword(data);
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
			onChange: () => {
				AvatarEditForm.buttonSubmitEl.setProps({
					disabled: false,
				});
			},
		});

		const AvatarEditForm = new Form<{ avatar: File }>({
			InputList: [AvatarInput],
			noCancel: true,
			submitProps: {
				label: 'Изменить',
				disabled: true,
			},
			onSubmit: async (data) => {
				const controller = new ProfileController();
				await controller.setAvatar(data);
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
			src: INITIAL_VALUE_MAP.avatar!,
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
			onClick: async () => {
				const controller = new AuthController();
				await controller.logout();
			},
		});

		super({
			...props,
			InfoFieldEmail: new InfoField({
				label: 'Почта',
				value: INITIAL_VALUE_MAP.email!,
			}),
			InfoFieldLogin: new InfoField({
				label: 'Логин',
				value: INITIAL_VALUE_MAP.login!,
			}),
			InfoFieldFirstName: new InfoField({
				label: 'Имя',
				value: INITIAL_VALUE_MAP.first_name!,
			}),
			InfoFieldSecondName: new InfoField({
				label: 'Фамилия',
				value: INITIAL_VALUE_MAP.second_name!,
			}),
			InfoFieldDisplayName: new InfoField({
				label: 'Имя в чате',
				value: INITIAL_VALUE_MAP.display_name!,
			}),
			InfoFieldPhone: new InfoField({
				label: 'Телефон',
				value: INITIAL_VALUE_MAP.phone!,
			}),
			AvatarComponent,
			LinkChangeInfo,
			LinkChangePassword,
			LinkLogout,
			ProfileEditForm,
			PasswordEditForm,
		});
	}

	override render(): string {
		const user = this.props.user;
		if (user) {
			this.children.InfoFieldEmail.setProps({ value: user.email });
			this.children.InfoFieldLogin.setProps({ value: user.login });
			this.children.InfoFieldFirstName.setProps({ value: user.first_name });
			this.children.InfoFieldSecondName.setProps({ value: user.second_name });
			this.children.InfoFieldDisplayName.setProps({
				value: user.display_name,
			});
			this.children.InfoFieldPhone.setProps({ value: user.phone });

			this.children.AvatarComponent.setProps({ src: user.avatar });

			(this.children.ProfileEditForm as Form<any>).setValues({
				email: user.email,
				login: user.login,
				first_name: user.first_name,
				second_name: user.second_name,
				display_name: user.display_name,
				phone: user.phone,
			});
		}
		return ProfileSectionTemplate;
	}

	public setActiveFrame(index: number) {
		const profileContent = document.querySelectorAll('.profile__content');

		profileContent.forEach((elem) => elem.classList.remove('active'));
		profileContent[index].classList.add('active');
	}
}

export default withUser(ProfileSection);
