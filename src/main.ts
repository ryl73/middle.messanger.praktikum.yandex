import './styles/main.scss';
import '@/router/router.ts';
import App from '@/App.ts';

document.addEventListener('DOMContentLoaded', async () => {
	const app = new App();
	await app.createApp();
});
