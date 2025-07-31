import Block from '@/services/Block/Block.ts';
import AttachmentItemTemplate from './AttachmentItem.hbs?raw';
import store from '@/store/store.ts';

type AttachmentItemProps = {
	file: File;
};

export class AttachmentItem extends Block {
	constructor({ file }: AttachmentItemProps) {
		const url = URL.createObjectURL(file);
		const name = file.name;
		const isImage = file.type.includes('image');

		super({
			url,
			name,
			isImage,
			events: {
				'.attachment-item__remove': {
					click: () => {
						const newAttachedFiles: string[] = store
							.getState()
							.attachedFiles.filter((fileItem: File) => fileItem.name !== file.name);
						store.set('attachedFiles', newAttachedFiles);
					},
				},
			},
		});
	}

	override render(): string {
		return AttachmentItemTemplate;
	}
}
