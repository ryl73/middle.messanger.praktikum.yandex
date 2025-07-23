import Block from '@/services/Block.ts';
import InputTemplate from './Input.hbs?raw';
import Validation from '@/services/Validation.ts';

export type InputProps = {
	name: string;
	label?: string;
	placeholder?: string;
	value?: string;
	type?: string;
	isError?: boolean;
	errorMessage?: string;
	search?: boolean;
	onBlur?: (e: Event) => void;
	onFocus?: (e: Event) => void;
	onInput?: (value: string) => void;
};

export class Input extends Block<InputProps> {
	constructor({ value = '', ...props }: InputProps) {
		super({
			...props,
			value,
			events: {
				input: {
					focus: (e: Event) => {
						props.onFocus?.(e);
					},
					blur: (e: Event) => {
						const inputEl = e.target;
						if (inputEl instanceof HTMLInputElement) {
							if (props.errorMessage) {
								Validation.validateInput(this);
							} else {
								this.setProps({
									value: inputEl.value,
								});
							}
						}
						props.onBlur?.(e);
					},
					input: (e: Event) => {
						if (props.onInput) {
							const inputEl = e.target;
							if (inputEl instanceof HTMLInputElement) {
								props.onInput(inputEl.value);
							}
						}
					},
				},
			},
		});
	}

	override render(): string {
		return InputTemplate;
	}

	get value(): string {
		const inputEl = this.getContent().querySelector('input');
		if (inputEl instanceof HTMLInputElement) {
			return inputEl.value;
		}
		return '';
	}

	get name() {
		return this.props.name;
	}

	get isValidate() {
		return this.props.errorMessage;
	}

	get isError(): boolean | undefined {
		return this.props.isError;
	}
}
