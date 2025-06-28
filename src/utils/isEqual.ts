export function isEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;

	if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
		return false;
	}

	if (Array.isArray(a) !== Array.isArray(b)) return false;

	const keysA = Object.keys(a as object);
	const keysB = Object.keys(b as object);

	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;

		const valA = (a as Record<string, unknown>)[key];
		const valB = (b as Record<string, unknown>)[key];

		if (!isEqual(valA, valB)) return false;
	}

	return true;
}

export default isEqual;
