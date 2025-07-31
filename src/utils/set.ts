import type { Indexed } from '@/types/store.ts';

function merge(lhs: Indexed, rhs: Indexed): Indexed {
	for (const p in rhs) {
		if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
			continue;
		}

		try {
			if (rhs[p].constructor === Object) {
				rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
			} else {
				lhs[p] = rhs[p];
			}
		} catch {
			lhs[p] = rhs[p];
		}
	}
	return lhs;
}

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
	if (typeof object !== 'object' || object === null) {
		return object;
	}

	if (typeof path !== 'string') {
		throw new Error('path must be string');
	}

	const result = path.split('.').reduceRight<Indexed>(
		(acc, key) => ({
			[key]: acc,
		}),
		value as any
	);
	return merge(object as Indexed, result);
}

export default set;
