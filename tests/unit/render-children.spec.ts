import {createElement, isValidElement, type ReactElement} from 'react';
import {test, expect} from '@playwright/test';
import {mergeSlotProps} from '../../src/utils/slot';
import {renderChildren} from '../../src/utils/renderChildren';

test.describe('mergeSlotProps', () => {
	test('склеивает className и перекрывает style слотом', () => {
		const child = createElement('button', {
			className: 'child',
			style: {
				color: 'red',
				opacity: 1,
			},
			type: 'button',
		});
		const merged = mergeSlotProps(
			{
				className: 'slot',
				style: {color: 'blue'},
				'aria-expanded': true,
			},
			child,
		);
		expect(merged.className).toContain('slot');
		expect(merged.className).toContain('child');
		expect(merged.style).toEqual({
			color: 'blue',
			opacity: 1,
		});
		expect(merged['aria-expanded']).toBe(true);
		expect(merged.type).toBe('button');
	});

	test('склеивает onClick: child, затем slot', () => {
		const order: string[] = [];
		const child = createElement('button', {
			type: 'button',
			onClick: () => {
				order.push('child');
			},
		});
		const merged = mergeSlotProps(
			{
				onClick: () => {
					order.push('slot');
				},
			},
			child,
		);
		const event = {defaultPrevented: false};
		(merged.onClick as (e: typeof event) => void)(event);
		expect(order).toEqual(['child', 'slot']);
	});
});

test.describe('renderChildren', () => {
	test('вызывает render-prop', () => {
		const node = renderChildren({
			children: (props, ref) => createElement('div', {
				...props,
				ref,
			}, 'ok'),
			props: {id: 'host'},
			contentRef: null,
		});
		expect(isValidElement(node)).toBe(true);
		expect((node as ReactElement<{id: string}>).props.id).toBe('host');
	});

	test('клонирует элемент-child', () => {
		const child = createElement('button', {
			className: 'child',
			type: 'button',
		}, 'Go');
		const node = renderChildren({
			children: child,
			props: {className: 'slot'},
			contentRef: null,
		});
		expect(isValidElement(node)).toBe(true);
		expect((node as ReactElement<{className: string}>).props.className).toContain('slot');
		expect((node as ReactElement<{className: string}>).props.className).toContain('child');
	});
});
