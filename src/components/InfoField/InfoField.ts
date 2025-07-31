import Block from '@/services/Block/Block.ts';
import InfoFieldTemplate from './InfoField.hbs?raw';

export type InfoFieldProps = {
	label: string;
	value: string;
};

export class InfoField extends Block<InfoFieldProps> {
	constructor(props: InfoFieldProps) {
		super({
			...props,
		});
	}

	override render(): string {
		return InfoFieldTemplate;
	}
}
