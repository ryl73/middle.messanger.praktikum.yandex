import Block from '@/services/Block.ts';
import ChatsMainTemplate from './ChatsMain.hbs?raw';
import ChatMessageGroup from '@/components/ChatMessageGroup/ChatMessageGroup.ts';
import MainNavbar from '@/components/MainNavbar/MainNavbar.ts';
import MainSearchbar from '@/components/MainSearchbar/MainSearchbar.ts';

type ChatsMainProps = {
	avatar: string | null;
	title: string;
	selectedChat?: number | null;
};

export default class ChatsMain extends Block {
	constructor(props: ChatsMainProps) {
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

		super({
			...props,
			ChatMessageGroupList,
			MainNavbar: new MainNavbar({
				avatar: props.avatar,
				title: props.title,
			}),
			MainSearchbar: new MainSearchbar(),
		});
	}

	override render(): string {
		return ChatsMainTemplate;
	}
}
