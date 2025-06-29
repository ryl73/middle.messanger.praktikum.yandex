export type Message = {
	id: number;
	content: string;
	time: string;
	read?: boolean;
	outcome?: boolean;
};
