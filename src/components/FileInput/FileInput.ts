import Block from '@/services/Block.ts';
import FileInputTemplate from './FileInput.hbs?raw';

export type FileInputProps = {
	label: string;
	onClick?: (e: Event) => void;
};

export class FileInput extends Block {
	constructor(props: FileInputProps) {
		super({
			...props,
			events: {
				root: {
					click: (e: Event) => {
						if (props.onClick) {
							props.onClick(e);
						}
					},
				},
			},
		});
	}

	override render(): string {
		return FileInputTemplate;
	}
}
