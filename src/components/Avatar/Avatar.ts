import Block from '@/services/Block.ts';
import AvatarTemplate from './Avatar.hbs?raw';
import { FileInput } from '@/components/FileInput/FileInput.ts';
import { Button } from '@/components/Button/Button.ts';

export type AvatarProps = {
	src: string;
	hoverText: string;
	onClick?: (e: Event) => void;
};

export class Avatar extends Block {
	constructor(props: AvatarProps) {
		super({
			FileInput: new FileInput({
				label: 'Выбрать файл на компьютере',
			}),
			ButtonSave: new Button({
				label: 'Изменить',
				disabled: true,
			}),
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
		return AvatarTemplate;
	}
}
