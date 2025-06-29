import Block from '@/services/Block.ts';
import FormTemplate from './Form.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Link, type LinkProps } from '@/components/Link/Link.ts';
import { Button, type ButtonProps } from '@/components/Button/Button.ts';
import type { FileInput } from '@/components/FileInput/FileInput.ts';
import Validation from '@/services/Validation.ts';

type FormProps = {
	InputList: (Input | FileInput)[];
	cancelProps?: Partial<LinkProps>;
	submitProps?: Partial<ButtonProps>;
	modifier?: string;
	initialValues?: string | Record<string, string>;
	removeList?: string[];
	noCancel?: boolean;
	LinkCancel: Link;
	ButtonSubmit: Button;
	onCancel?: () => void;
	onSubmit?: () => void;
};

export default class Form extends Block<FormProps> {
	public buttonSubmitEl: Button;

	constructor({ initialValues = '', removeList = [], ...props }: Partial<FormProps>) {
		const ButtonSubmit = new Button({
			label: props.submitProps?.label || 'Сохранить',
			type: 'submit',
			...props.submitProps,
		});
		super({
			...props,
			LinkCancel: props.noCancel
				? undefined
				: new Link({
						label: props.submitProps?.label || 'Отменить',
						font: 'fs-p-bold',
						...props.cancelProps,
						onClick: () => {
							props.InputList?.forEach((input) => {
								if (input instanceof Input) {
									input.setProps({
										value:
											typeof initialValues === 'object'
												? initialValues[input.name]
												: initialValues,
										isError: false,
									});
								}
							});
							props.onCancel?.();
						},
					}),
			ButtonSubmit,
			events: {
				root: {
					submit: (e: Event) => {
						e.preventDefault();
						const isFormValid = Validation.validateForm(
							...(props.InputList as Input[])
						);
						if (!isFormValid) return;

						const target = e.target;
						if (target instanceof HTMLFormElement) {
							const formData = new FormData(target);
							removeList.forEach((name) => {
								formData.delete(name);
							});

							console.log(Object.fromEntries(formData.entries()));
						}

						props.onSubmit?.();
					},
				},
			},
		});

		this.buttonSubmitEl = ButtonSubmit;
	}

	override render(): string {
		return FormTemplate;
	}
}
