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

export class Input extends Block {
	constructor(props: InputProps) {
		super({
			...props,
			value: props.value || '',
			events: {
				input: {
					focus: (e: Event) => {
						props.onFocus?.(e);
					},
					blur: (e: Event) => {
						const inputEl = e.target;
						if (inputEl instanceof HTMLInputElement) {
							this.setProps({
								value: inputEl.value,
							});
							if (props.errorMessage) {
								const validate = new Validation(inputEl.value, props.name);
								validate.validate(this);
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

	get value() {
		return this.props.value;
	}

	get name() {
		return this.props.name;
	}

	get isError() {
		return this.props.isError;
	}
}
