import {test, expect} from '@playwright/test';
import {resolvePreferredSide} from '../../src/utils/anchorPosition';

function rect(left: number, top: number, width: number, height: number): DOMRect {
	return {
		x: left,
		y: top,
		width,
		height,
		top,
		left,
		right: left + width,
		bottom: top + height,
		toJSON() {
			return this;
		},
	} as DOMRect;
}

test.describe('anchorPosition', () => {
	test.beforeAll(() => {
		Object.defineProperty(globalThis, 'window', {
			configurable: true,
			value: {
				innerWidth: 1000,
				innerHeight: 800,
			},
		});
	});

	test('оставляет предпочтительную сторону, если есть место', () => {
		const trigger = rect(400, 100, 80, 32);
		expect(resolvePreferredSide('bottom', trigger, 200, 120)).toBe('bottom');
	});

	test('переворачивает на противоположную сторону, если предпочтительная не помещается', () => {
		const trigger = rect(400, 740, 80, 32);
		expect(resolvePreferredSide('bottom', trigger, 200, 120)).toBe('top');
	});
});
