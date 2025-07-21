import ResourcesAPI from '@/api/ResourcesApi.ts';
import ErrorService from '@/services/ErrorHandler.ts';

const api = new ResourcesAPI();

export default class ResourcesController {
	public async set(data: File) {
		try {
			const formData = new FormData();
			formData.append('resource', data, data.name);
			return await api.set({ data: formData });
		} catch (e) {
			ErrorService.handle(e);
		}
	}
}
