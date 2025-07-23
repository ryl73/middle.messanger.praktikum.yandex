import ResourcesAPI from '@/api/ResourcesApi.ts';
import ErrorService from '@/services/ErrorHandler.ts';

export default class ResourcesController {
	private readonly api = new ResourcesAPI();

	public async set(data: File) {
		try {
			const formData = new FormData();
			formData.append('resource', data, data.name);
			return await this.api.set({ data: formData });
		} catch (e) {
			ErrorService.handle(e);
		}
	}
}
