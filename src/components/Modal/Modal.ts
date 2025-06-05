export default function () {
	const openModals = document.querySelectorAll('[data-modal]') as NodeListOf<HTMLElement>;
	openModals.forEach((o) =>
		o.addEventListener('click', () => {
			if (o.dataset.modal) {
				const modal =
					(document.getElementById(o.dataset.modal) as HTMLDialogElement) || null;
				modal?.showModal();
				document.body.classList.add('scroll-lock');
				modal?.addEventListener('click', handleModalClick);
			}
		})
	);
}

const handleModalClick = (e: Event) => {
	const target = e.target as HTMLElement;
	const currentTarget = e.currentTarget as HTMLDialogElement;

	const isClickedOnBackdrop = target === currentTarget;

	if (isClickedOnBackdrop) {
		currentTarget.close();
	}
};
