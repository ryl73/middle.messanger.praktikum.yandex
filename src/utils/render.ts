import type Block from '@/services/Block.ts';

export function render(query: string, block: Block) {
	const root = document.querySelector(query);
	if (root instanceof HTMLElement) {
		if (!root.firstElementChild) {
			root.appendChild(block.getContent());
		} else {
			root.firstElementChild.replaceWith(block.getContent());
		}
	}
	return root;
}
