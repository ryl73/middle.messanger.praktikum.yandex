import ProfileAPI, { type ProfileRequestData } from '@/api/ProfileAPI.ts';
import store from '@/store/store.ts';
import ErrorHandler from '@/services/ErrorHandler.ts';

export default class ProfileController {
	private readonly api = new ProfileAPI();

	public async set(data: ProfileRequestData) {
		try {
			const userData = await this.api.set({ data });
			store.set('user', userData);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}
	public async setAvatar(data: { avatar: File }) {
		try {
			const formData = new FormData();
			formData.append('avatar', data.avatar, data.avatar.name);
			const userData = await this.api.setAvatar({ data: formData });
			store.set('user', userData);
		} catch (e) {
			ErrorHandler.handle(e);
		}
	}
}
