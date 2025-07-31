import Block from '@/services/Block/Block.ts';
import ProfileTemplate from './settings.hbs?raw';
import { Button } from '@/components/Button/Button.ts';
import router, { routes } from '@/router/router.ts';
import ProfileSection from '@/components/ProfileSection/ProfileSection.ts';

export default class ProfilePage extends Block {
	constructor() {
		super({
			ProfileSection: new ProfileSection({}),
			ButtonBack: new Button({
				modifier: 'round',
				icon: `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
							<path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					`,
				onClick: () => {
					router.go(routes.MESSENGER);
				},
			}),
		});
	}

	override render(): string {
		return ProfileTemplate;
	}
}
