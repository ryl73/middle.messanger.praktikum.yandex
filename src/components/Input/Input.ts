import Block from '@/services/Block.ts';
import InputTemplate from './Input.hbs?raw';
import Validation from '@/services/Validation.ts';

export type InputProps = {
	name: string;
	label: string;
	placeholder?: string;
	value?: string;
	type?: string;
	isError?: boolean;
	errorMessage?: string;
	onBlur?: (e: Event) => void;
	onFocus?: (e: Event) => void;
};

export class Input extends Block {
	constructor(props: InputProps) {
		super({
			...props,
			value: props.value || '',
			events: {
				input: {
					focus: (e: Event) => {
						if (props.onFocus) {
							props.onFocus(e);
						}
					},
					blur: (e: Event) => {
						const inputEl = e.target;
						if (inputEl instanceof HTMLInputElement) {
							this.setProps({
								value: inputEl.value,
							});
							const validate = new Validation(inputEl.value, props.name);
							validate.validate(this);
						}
						if (props.onBlur) {
							props.onBlur(e);
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
