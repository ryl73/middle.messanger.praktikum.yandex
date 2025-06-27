import type { Input } from '@/components/Input/Input.ts';
import Validation from '@/services/Validation.ts';
import type { FileInput } from '@/components/FileInput/FileInput.ts';

export function validateInput(input: Input | FileInput): boolean {
	const validator = new Validation(input.value, input.name);
	return validator.validate(input);
}

export function validateForm(...inputs: (Input | FileInput)[]): boolean {
	let isFormValid = true;

	inputs.forEach((input) => {
		if (input.isValidate) {
			const isValid = validateInput(input);

			if (!isValid) {
				isFormValid = false;
			}
		}
	});

	return isFormValid;
}
