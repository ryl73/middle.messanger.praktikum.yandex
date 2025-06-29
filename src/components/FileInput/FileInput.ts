import Block from '@/services/Block.ts';
import FileInputTemplate from './FileInput.hbs?raw';

export type FileInputProps = {
	label: string;
	name: string;
	errorMessage?: string;
	value?: File | null;
	onClick?: (e: Event) => void;
	onChange?: (e: FileList | null) => void;
};

export class FileInput extends Block<FileInputProps> {
	constructor(props: FileInputProps) {
		super({
			...props,
			events: {
				root: {
					click: (e: Event) => {
						props.onClick?.(e);
					},
				},
				input: {
					change: (e: Event) => {
						if (props.onChange) {
							const target = e.target;
							if (target instanceof HTMLInputElement) {
								const files = target.files;
								props.onChange(target.files);
								if (files) {
									this.setProps({
										label: files[0].name,
									});
								}
							}
						}
					},
				},
			},
		});
	}

	override render(): string {
		return FileInputTemplate;
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
