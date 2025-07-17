import type { WSMessage } from '@/services/WebSocketService.ts';

function groupByDate(messages: WSMessage[]): Record<string, WSMessage[]> {
	const formatter = new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
	});

	return messages.reduce(
		(acc, msg) => {
			const date = new Date(msg.time);
			const formattedDate = formatter.format(date); // e.g., "10 июля"

			if (!acc[formattedDate]) {
				acc[formattedDate] = [];
			}

			acc[formattedDate].push(msg);
			return acc;
		},
		{} as Record<string, WSMessage[]>
	);
}

export default groupByDate;
