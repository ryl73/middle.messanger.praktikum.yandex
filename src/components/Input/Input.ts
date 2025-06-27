import Block from '@/services/Block.ts';
import InputTemplate from './Input.hbs?raw';
import { validateInput } from '@/utils/validation.ts';

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
							this.setProps({
								value: inputEl.value,
							});
							if (props.errorMessage) {
								validateInput(this);
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

	get isValidate() {
		return this.props.errorMessage;
	}
}
