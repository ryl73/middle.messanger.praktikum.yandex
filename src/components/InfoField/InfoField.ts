import Block from '@/services/Block.ts';
import InfoFieldTemplate from './InfoField.hbs?raw';

export type InputProps = {
	label: string;
	value: string;
};

export class InfoField extends Block {
	constructor(props: InputProps) {
		super({
			...props,
		});
	}

	override render(): string {
		return InfoFieldTemplate;
	}
}
