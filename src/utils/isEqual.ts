export function isEqual(obj1: any, obj2: any) {
	if (obj1 === obj2) return true;

	if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
		return false;
	}

	if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

	const keysA = Object.keys(obj1);
	const keysB = Object.keys(obj2);

	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;
		if (!isEqual(obj1[key], obj2[key])) return false;
	}

	return true;
}

export default isEqual;
