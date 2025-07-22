import Block from '@/services/Block.ts';
import AttachmentListTemplate from './AttachmentList.hbs?raw';
import connect from '@/store/connect';
import isEqual from '@/utils/isEqual.ts';
import { AttachmentItem } from '@/components/Attachments/AttachmentItem/AttachmentItem.ts';

type AttachmentListProps = {
	attachedFiles: File[];
	active: boolean;
};

const setAttachmentList = (files: File[]) => {
	return files.map((file) => {
		return new AttachmentItem({
			file,
		});
	});
};

class AttachmentList extends Block {
	constructor({ attachedFiles }: AttachmentListProps) {
		super({
			List: setAttachmentList(attachedFiles || []),
		});
	}

	override render(): string {
		return AttachmentListTemplate;
	}

	override componentDidUpdate(
		oldProps: AttachmentListProps,
		newProps: AttachmentListProps
	): boolean {
		if (!isEqual(oldProps.attachedFiles!, newProps.attachedFiles!) && newProps.attachedFiles) {
			if (newProps.attachedFiles.length > 0) {
				this.setProps({ active: true });
			} else {
				this.setProps({ active: false });
			}
			this.setLists({ List: setAttachmentList(newProps.attachedFiles) });
			return true;
		}

		return false;
	}
}

const withStore = connect((state) => ({
	attachedFiles: state.attachedFiles,
}));

export default withStore(AttachmentList);
