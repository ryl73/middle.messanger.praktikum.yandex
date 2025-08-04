import Block from '@/services/Block/Block.ts';

jest.mock('handlebars', () => ({
	compile: jest.fn().mockImplementation((tpl: string) => {
		return (context: any) => tpl.replace(/{{\s*(\w+)\s*}}/g, (_, key) => context[key] ?? '');
	}),
}));

type BlockProps = {
	message: string;
	attr?: Record<string, string>;
};

class TestBlock extends Block<BlockProps> {
	constructor(props: Partial<BlockProps>) {
		super({
			...props,
		});
	}
	render() {
		return '<div>{{message}}</div>';
	}
}

describe('Block', () => {
	let block: TestBlock;

	beforeEach(() => {
		block = new TestBlock({ message: 'Hello' });
	});

	test('creates element via getContent after init', () => {
		const el = block.getContent();
		expect(el).toBeInstanceOf(HTMLElement);
		expect(el.innerHTML).toContain('Hello');
	});

	test('setProps updates props and triggers rerender', () => {
		const oldHTML = block.getContent().outerHTML;
		block.setProps({ message: 'Updated' });
		const newHTML = block.getContent().outerHTML;

		expect(newHTML).not.toBe(oldHTML);
		expect(newHTML).toContain('Updated');
	});

	test('setLists does not throw and keeps API safe', () => {
		expect(() =>
			block.setLists({
				items: [],
			})
		).not.toThrow();
	});

	test('show() and hide() toggle element visibility', () => {
		block.hide();
		expect(block.getContent().style.display).toBe('none');

		block.show();
		expect(block.getContent().style.display).toBe('block');
	});

	test('unmount() removes content from DOM', () => {
		document.body.appendChild(block.getContent());
		expect(document.body.contains(block.getContent())).toBe(true);

		block.unmount();

		expect(document.body.querySelector('#compiled')).toBeNull();
		expect(block.element).toBeNull();
	});

	test('getContent throws if content never rendered', () => {
		class IncompleteBlock extends Block {
			constructor() {
				super();
			}

			render() {
				return '';
			}
		}

		const b = new IncompleteBlock();

		b.unmount();

		expect(() => b.getContent()).toThrow('Элемент не был создан!');
	});
});
