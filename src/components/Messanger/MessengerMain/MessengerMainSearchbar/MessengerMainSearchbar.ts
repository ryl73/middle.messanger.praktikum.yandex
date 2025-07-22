import Block from '@/services/Block.ts';
import MainSearchbarTemplate from './MessengerMainSearchbar.hbs?raw';
import Popover from '@/components/Popover/Popover.ts';
import ListItem, { type ListItemProps } from '@/components/ListItem/ListItem.ts';
import { Input } from '@/components/Input/Input.ts';
import { Button } from '@/components/Button/Button.ts';
import ChatController from '@/controllers/ChatController.ts';
import store from '@/store/store.ts';
import AttachmentList from '@/components/Attachments/AttachmentList/AttachmentList.ts';

export default class MessengerMainSearchbar extends Block {
	constructor() {
		function onClickHandler(accept?: string) {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = accept || '';
			input.multiple = true;
			input.style.display = 'none';
			document.body.appendChild(input);
			input.click();
			input.addEventListener('change', (e) => {
				const target = e.target;
				if (target instanceof HTMLInputElement) {
					const files = target.files;
					if (files && files.length > 0) {
						const oldFiles: string[] = store.getState().attachedFiles;
						if (oldFiles && oldFiles.length > 0) {
							store.set('attachedFiles', [...oldFiles, ...[...files]]);
						} else {
							store.set('attachedFiles', [...files]);
						}

						ButtonSendMessage.setProps({
							disabled: false,
						});
						document.body.removeChild(input);
					}
				}
			});
		}
		const attachFileListItems: ListItemProps[] = [
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.2061 0.00488281C20.3194 0.112115 22 1.85996 22 4V18L21.9951 18.2061C21.8913 20.2512 20.2512 21.8913 18.2061 21.9951L18 22H4L3.79395 21.9951C1.7488 21.8913 0.108652 20.2512 0.00488281 18.2061L0 18V4C0 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H18L18.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V14L7.48047 12.4053C8.48903 12.1363 9.52847 12 10.5723 12H11.4277C12.4715 12 13.511 12.1363 14.5195 12.4053L20.5 14V4C20.5 2.61929 19.3807 1.5 18 1.5H4ZM6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4Z" fill="currentColor"/>
					</svg>
				`,
				label: 'Фото или видео',
				onClick: () => {
					onClickHandler('image/*');
				},
			},
			{
				icon: `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
						<path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 12.6477 21.7004 13.2503 21.2424 13.7083L13.7083 21.2424C13.2503 21.7004 12.6477 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						<path d="M12 17C10.8846 17 9.85038 16.6303 9 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						<ellipse cx="15" cy="10.5" rx="1" ry="1.5" fill="currentColor"/>
						<ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="currentColor"/>
						<path d="M12 22C12 19.2071 12 17.8107 12.3928 16.688C13.0964 14.6773 14.6773 13.0964 16.688 12.3928C17.8107 12 19.2071 12 22 12" stroke="currentColor" stroke-width="1.5"/>
					</svg>
				`,
				label: 'Стикер',
			},
		];

		const MessageInput = new Input({
			name: 'message',
			placeholder: 'Сообщение',
			onInput: (value) => {
				if (value !== '') {
					ButtonSendMessage.setProps({
						disabled: false,
					});
				} else {
					ButtonSendMessage.setProps({
						disabled: true,
					});
				}
			},
		});

		const AttachFileDialogSlot: Block[] = [];

		attachFileListItems.forEach((item) => {
			const Item = new ListItem({
				icon: item.icon,
				label: item.label,
				class: item.class,
				onClick: item.onClick,
			});
			AttachFileDialogSlot.push(Item);
		});

		const AttachFilePopover = new Popover({
			ActionSlot: `
				<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M7.18661 13.5L14.7628 5.92389L15.7056 6.8667L8.12942 14.4428L7.18661 13.5Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9.70068 16.0141L17.2768 8.43793L18.2196 9.38074L10.6435 16.9569L9.70068 16.0141Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0433 21.3567L22.6194 13.7806L23.5623 14.7234L15.9861 22.2995L15.0433 21.3567Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M17.5574 23.8708L25.1335 16.2946L26.0763 17.2374L18.5002 24.8136L17.5574 23.8708Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M17.5575 23.8709C14.9423 26.486 10.7118 26.4954 8.10832 23.8919C5.50482 21.2884 5.51425 17.0579 8.12936 14.4428L7.18655 13.5C4.04841 16.6381 4.03711 21.7148 7.1613 24.839C10.2855 27.9632 15.3621 27.9518 18.5003 24.8137L17.5575 23.8709Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M22.6195 13.7806L23.5623 14.7234C26.003 12.2826 26.0118 8.3341 23.5819 5.90417C21.152 3.47424 17.2035 3.48303 14.7627 5.92381L15.7055 6.86662C17.6233 4.94887 20.7257 4.94196 22.6349 6.85119C24.5441 8.76042 24.5372 11.8628 22.6195 13.7806Z" fill="currentColor"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9.70093 16.0144C7.95752 17.7578 7.95123 20.5782 9.6869 22.3138C11.4226 24.0495 14.2429 24.0432 15.9863 22.2998L15.0435 21.357C13.8231 22.5774 11.8489 22.5818 10.6339 21.3668C9.41895 20.1518 9.42335 18.1776 10.6437 16.9572L9.70093 16.0144Z" fill="currentColor"/>
				</svg>
			`,
			DialogSlot: AttachFileDialogSlot,
			position: 'top left',
		});

		const ButtonSendMessage = new Button({
			icon: `
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`,
			modifier: 'round',
			disabled: true,
			type: 'submit',
		});

		super({
			AttachFilePopover,
			MessageInput,
			ButtonSendMessage,
			AttachmentList: new AttachmentList({}),
			events: {
				root: {
					submit: async (e: Event) => {
						e.preventDefault();

						const target = e.target;
						if (target instanceof HTMLFormElement) {
							const formData = new FormData(target);

							const data = Object.fromEntries(formData.entries()) as {
								message: string;
							};

							const controller = new ChatController();
							await controller.sendMessage(data);

							MessageInput.setProps({
								value: '',
							});

							ButtonSendMessage.setProps({
								disabled: true,
							});
						}
					},
				},
			},
		});
	}

	override render(): string {
		return MainSearchbarTemplate;
	}
}
