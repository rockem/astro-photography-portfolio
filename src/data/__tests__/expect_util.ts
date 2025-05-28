import { expect } from 'vitest';

export const expectContainsOnlyObjectsWith = (objArray: unknown[], partials: unknown[]) => {
	expect(objArray).toHaveLength(partials.length);
	const expectedWrapped = partials.map((partial) => wrapWithObjectContaining(partial));
	expect(objArray).toEqual(expect.arrayContaining(expectedWrapped));
};

const wrapWithObjectContaining = (value: unknown): unknown => {
	if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
		const wrappedEntries = Object.entries(value).map(([key, val]) => [
			key,
			wrapWithObjectContaining(val),
		]);
		return expect.objectContaining(Object.fromEntries(wrappedEntries));
	}
	return value;
};
