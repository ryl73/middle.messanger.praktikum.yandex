export default function getStringFromUTC(utcString: string): string {
	const months = [
		'Янв',
		'Фев',
		'Мар',
		'Апр',
		'Май',
		'Июн',
		'Июл',
		'Авг',
		'Сен',
		'Окт',
		'Ноя',
		'Дек',
	];
	const date = new Date(utcString);
	const now = new Date();

	const dateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const msInDay = 24 * 60 * 60 * 1000;
	const diffDays = (nowLocal.getTime() - dateLocal.getTime()) / msInDay;

	if (diffDays === 0) {
		return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
	} else if (diffDays === 1) {
		return 'вчера';
	} else if (date.getFullYear() === now.getFullYear()) {
		return `${date.getDate()} ${months[date.getMonth()]}`;
	} else {
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	}
}
