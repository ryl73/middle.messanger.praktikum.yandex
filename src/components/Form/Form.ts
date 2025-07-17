import Block from '@/services/Block.ts';
import FormTemplate from './Form.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Link, type LinkProps } from '@/components/Link/Link.ts';
import { Button, type ButtonProps } from '@/components/Button/Button.ts';
import { FileInput } from '@/components/FileInput/FileInput.ts';
import Validation from '@/services/Validation.ts';

type FormProps = {
	InputList: (Input | FileInput | Block)[];
	cancelProps?: Partial<LinkProps>;
	submitProps?: Partial<ButtonProps>;
	modifier?: string;
	initialValues?: string | Record<string, string | null>;
	removeList?: string[];
	noCancel?: boolean;
	LinkCancel: Link;
	ButtonSubmit: Button;
	onCancel?: () => void;
};

export default class Form<Data> extends Block<FormProps> {
	public buttonSubmitEl: Button;

	constructor({
		removeList = [],
		...props
	}: Partial<FormProps & { onSubmit: (data: Data) => void }>) {
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
							if (props.initialValues) {
								props.InputList?.forEach((input) => {
									if (input instanceof Input) {
										input.setProps({
											value:
												typeof props.initialValues === 'object'
													? props.initialValues[input.name]!
													: props.initialValues,
										});
										if (input.isError) {
											input.setProps({
												isError: false,
											});
										}
									}
								});
							}
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
							const formData = new FormData();
							props.InputList?.forEach((input) => {
								if (input instanceof FileInput || input instanceof Input) {
									if (!removeList.includes(input.name)) {
										formData.append(input.name, input.value!);
									}
								}
							});

							props.onSubmit?.(Object.fromEntries(formData.entries()) as Data);
						}
					},
				},
			},
		});

		this.buttonSubmitEl = ButtonSubmit;
	}

	public setValues(values: Record<string, any>) {
		this.lists.InputList?.forEach((input) => {
			if (input instanceof Input || input instanceof FileInput) {
				const name = input.name;
				if (name && values[name] !== undefined) {
					input.setProps({ value: values[name] });
				}
			}
		});
	}

	override render(): string {
		return FormTemplate;
	}
}
