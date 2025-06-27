import Block from '@/services/Block.ts';
import ChatsMainTemplate from './ChatsMain.hbs?raw';
import { Input } from '@/components/Input/Input.ts';
import { Button } from '@/components/Button/Button.ts';
import Popover from '@/components/Popover/Popover.ts';
import ListItem, { type ListItemProps } from '@/components/ListItem/ListItem.ts';
import ChatMessageGroup from '@/components/ChatMessageGroup/ChatMessageGroup.ts';
import { Modal } from '@/components/Modal/Modal.ts';
import { Link } from '@/components/Link/Link.ts';

type ChatsMainProps = {
	avatar: string | null;
	title: string;
};

export default class ChatsMain extends Block {
	constructor(props: ChatsMainProps) {
		const attachFileListItems: ListItemProps[] = [
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.2061 0.00488281C20.3194 0.112115 22 1.85996 22 4V18L21.9951 18.2061C21.8913 20.2512 20.2512 21.8913 18.2061 21.9951L18 22H4L3.79395 21.9951C1.7488 21.8913 0.108652 20.2512 0.00488281 18.2061L0 18V4C0 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H18L18.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V14L7.48047 12.4053C8.48903 12.1363 9.52847 12 10.5723 12H11.4277C12.4715 12 13.511 12.1363 14.5195 12.4053L20.5 14V4C20.5 2.61929 19.3807 1.5 18 1.5H4ZM6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4Z" fill="currentColor"/>
					</svg>
				`,
				label: 'Фото или видео',
			},
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.2061 0.00488281C20.3194 0.112115 22 1.85996 22 4V18C22 18.162 21.9884 18.3215 21.9697 18.4785C21.9418 18.7122 21.8945 18.9396 21.8281 19.1592C21.8212 19.1821 21.814 19.2048 21.8066 19.2275C21.7542 19.3902 21.6921 19.5483 21.6201 19.7012C21.6112 19.7202 21.602 19.739 21.5928 19.7578C21.5735 19.7972 21.5538 19.8363 21.5332 19.875C21.5237 19.8929 21.5147 19.911 21.5049 19.9287C21.4832 19.9681 21.4595 20.0063 21.4365 20.0449C21.4288 20.0578 21.4219 20.0712 21.4141 20.084C21.3559 20.179 21.2932 20.2708 21.2275 20.3604C21.2161 20.376 21.205 20.3918 21.1934 20.4072C20.969 20.7044 20.7044 20.969 20.4072 21.1934C20.3918 21.205 20.376 21.2161 20.3604 21.2275C20.2708 21.2932 20.179 21.3559 20.084 21.4141C20.0712 21.4219 20.0578 21.4288 20.0449 21.4365C20.0071 21.4591 19.9693 21.4816 19.9307 21.5029C19.9122 21.5131 19.8937 21.5233 19.875 21.5332C19.8363 21.5538 19.7972 21.5735 19.7578 21.5928C19.739 21.602 19.7202 21.6112 19.7012 21.6201C19.6599 21.6395 19.6182 21.6578 19.5762 21.6758C19.5657 21.6803 19.5554 21.6851 19.5449 21.6895C19.4413 21.7329 19.3354 21.7719 19.2275 21.8066C19.2048 21.814 19.1821 21.8212 19.1592 21.8281C19.1184 21.8405 19.0774 21.8522 19.0361 21.8633C19.0208 21.8674 19.0056 21.8721 18.9902 21.876C18.9322 21.8908 18.8735 21.9038 18.8145 21.916C18.8105 21.9168 18.8067 21.9181 18.8027 21.9189C18.7462 21.9305 18.6892 21.9401 18.6318 21.9492C18.6224 21.9507 18.613 21.9527 18.6035 21.9541C18.5621 21.9604 18.5203 21.9647 18.4785 21.9697C18.4554 21.9725 18.4324 21.9771 18.4092 21.9795L18.2061 21.9951L18 22H4L3.79395 21.9951C1.7488 21.8913 0.108652 20.2512 0.00488281 18.2061L0 18V4C6.24113e-08 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H18L18.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V18C1.5 19.3807 2.61929 20.5 4 20.5H12V16C12 13.7909 13.7909 12 16 12H20.5V4C20.5 2.61929 19.3807 1.5 18 1.5H4Z" fill="currentColor"/>
					</svg>
				`,
				label: 'Файл',
			},
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0ZM11 1.5C5.75329 1.5 1.5 5.75329 1.5 11C1.5 16.2467 5.75329 20.5 11 20.5C16.2467 20.5 20.5 16.2467 20.5 11C20.5 5.75329 16.2467 1.5 11 1.5ZM11 8C12.6569 8 14 9.34315 14 11C14 12.6569 12.6569 14 11 14C9.34315 14 8 12.6569 8 11C8 9.34315 9.34315 8 11 8Z" fill="currentColor"/>
					</svg>
				`,
				label: 'Локация',
			},
		];

		const settingsListItems: ListItemProps[] = [
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="11" cy="11" r="10.25" stroke="currentColor" stroke-width="1.5"/>
						<line x1="10.9999" y1="5.5" x2="10.9999" y2="16.5" stroke="currentColor" stroke-width="1.5"/>
						<line x1="5.49988" y1="11" x2="16.4999" y2="11" stroke="currentColor" stroke-width="1.5"/>
					</svg>
				`,
				label: 'Добавить пользователя',
				onClick: () => {
					ChatUserAddModal.show();
				},
			},
			{
				icon: `
					<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="11" cy="11" r="10.25" stroke="currentColor" stroke-width="1.5"/>
						<line x1="7.11077" y1="7.11103" x2="14.8889" y2="14.8892" stroke="currentColor" stroke-width="1.5"/>
						<line x1="7.11078" y1="14.8891" x2="14.889" y2="7.11093" stroke="currentColor" stroke-width="1.5"/>
					</svg>
				`,
				label: 'Удалить пользователя',
				onClick: () => {
					ChatUserRemoveModal.show();
				},
			},
			{
				icon: `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
						<path d="M10 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M14 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`,
				label: 'Удалить чат',
				class: 'red',
				onClick: () => {
					ChatRemoveModal.show();
				},
			},
		];

		const MessageInput = new Input({
			name: 'message',
			placeholder: 'Сообщение',
		});

		const AttachFileDialogSlot: Block[] = [];

		attachFileListItems.forEach((item) => {
			const Item = new ListItem({
				icon: item.icon,
				label: item.label,
				class: item.class,
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

		const ChatSettingsDialogSlot: Block[] = [];

		settingsListItems.forEach((item) => {
			const Item = new ListItem({
				icon: item.icon,
				label: item.label,
				class: item.class,
				onClick: item.onClick,
			});
			ChatSettingsDialogSlot.push(Item);
		});

		const ChatSettingsPopover = new Popover({
			ActionSlot: `
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
					<path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			`,
			DialogSlot: ChatSettingsDialogSlot,
			position: 'bottom right',
		});

		const ChatMessageGroupList = [
			new ChatMessageGroup({
				group: {
					'27 июня': [
						{
							id: 1,
							content: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории —
							НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для
							полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью
							500 EL — и к слову говоря, все тушки этих камер все еще находятся на
							поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.
							<br><br>
							Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету
							они так никогда и не попали. Всего их было произведено 25 штук, одну из них
							недавно продали на аукционе за 45000 евро.`,
							time: '2025-06-27T14:22:22.000Z',
						},
						{
							id: 2,
							content: '/assets/images/image.jpg',
							time: '2025-06-27T14:22:54.000Z',
						},
						{
							id: 3,
							content: `Привет! Понятно`,
							time: '2025-06-27T14:25:24.000Z',
							outcome: true,
							read: true,
						},
					],
				},
			}),
		];

		const ChatUserAddButton = new Button({
			label: 'Добавить',
			disabled: true,
			onClick: () => {
				console.log(ChatUserAddLoginInput.value);
				ChatUserAddModal.close();
			},
		});

		const ChatUserAddLoginInput = new Input({
			label: 'Логин',
			name: 'login',
			onInput: (value) => {
				if (value !== '') {
					ChatUserAddButton.setProps({
						disabled: false,
					});
				} else {
					ChatUserAddButton.setProps({
						disabled: true,
					});
				}
			},
		});

		const ChatUserAddModal = new Modal({
			title: 'Добавить пользователя',
			slot: [ChatUserAddLoginInput, ChatUserAddButton],
			onClose: () => {
				ChatUserAddLoginInput.setProps({
					value: '',
				});
			},
		});

		const ChatUserRemoveButton = new Button({
			label: 'Удалить',
			disabled: true,
			onClick: () => {
				console.log(ChatUserRemoveLoginInput.value);
				ChatUserAddModal.close();
			},
		});

		const ChatUserRemoveLoginInput = new Input({
			label: 'Логин',
			name: 'login',
			onInput: (value) => {
				if (value !== '') {
					ChatUserAddButton.setProps({
						disabled: false,
					});
				} else {
					ChatUserAddButton.setProps({
						disabled: true,
					});
				}
			},
		});

		const ChatUserRemoveModal = new Modal({
			title: 'Удалить пользователя',
			slot: [ChatUserRemoveLoginInput, ChatUserRemoveButton],
			onClose: () => {
				ChatUserRemoveLoginInput.setProps({
					value: '',
				});
			},
		});

		const ChatRemoveButton = new Button({
			label: 'Удалить',
			modifier: 'red',
			onClick: () => {
				ChatRemoveModal.close();
			},
		});

		const ChatRemoveCancelLink = new Link({
			label: 'Отменить',
			modifier: 'fs-p-bold',
			onClick: () => {
				ChatRemoveModal.close();
			},
		});

		const ChatRemoveModal = new Modal({
			title: 'Вы действительно хотите удалить данный чат?',
			modifier: 'small',
			slot: [ChatRemoveButton, ChatRemoveCancelLink],
			onClose: () => {
				ChatUserRemoveLoginInput.setProps({
					value: '',
				});
			},
		});

		super({
			...props,
			MessageInput,
			ButtonSendMessage: new Button({
				icon: `
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`,
				modifier: 'round',
				onClick: () => {},
			}),
			AttachFilePopover,
			ChatSettingsPopover,
			ChatMessageGroupList,
			ChatRemoveModal,
			ChatUserRemoveModal,
			ChatUserAddModal,
		});
	}

	override render(): string {
		return ChatsMainTemplate;
	}
}
