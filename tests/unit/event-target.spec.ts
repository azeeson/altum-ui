import {test, expect} from '@playwright/test';
import * as esbuild from 'esbuild';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test.describe('eventTarget', () => {
	test.beforeEach(async ({page}) => {
		const bundle = await esbuild.build({
			entryPoints: [path.join(root, 'src/core/utils/eventTarget.ts')],
			bundle: true,
			format: 'iife',
			globalName: 'altumEventTarget',
			write: false,
			platform: 'browser',
		});
		await page.setContent('<!doctype html><html><body></body></html>');
		await page.addScriptTag({content: bundle.outputFiles[0].text});
	});

	test('isEditableTarget узнаёт input, select и contentEditable', async ({page}) => {
		const result = await page.evaluate(() => {
			const api = (window as unknown as {
				altumEventTarget: {
					isEditableTarget: (target: EventTarget | null) => boolean;
				};
			}).altumEventTarget;
			document.body.innerHTML = '<input id="i"><select id="s"></select><div id="c" contenteditable="true"></div><p id="p"></p>';
			return {
				input: api.isEditableTarget(document.getElementById('i')),
				select: api.isEditableTarget(document.getElementById('s')),
				editable: api.isEditableTarget(document.getElementById('c')),
				text: api.isEditableTarget(document.getElementById('p')),
				missing: api.isEditableTarget(null),
			};
		});
		expect(result).toEqual({
			input: true,
			select: true,
			editable: true,
			text: false,
			missing: false,
		});
	});

	test('isDragBlockedTarget использует переданный селектор', async ({page}) => {
		const result = await page.evaluate(() => {
			const api = (window as unknown as {
				altumEventTarget: {
					isDragBlockedTarget: (target: EventTarget | null, selector: string) => boolean;
				};
			}).altumEventTarget;
			document.body.innerHTML = '<a href="#"><span id="in">x</span></a><button id="btn">ok</button><span id="lock" data-no-task-drag><i id="lock-child"></i></span>';
			return {
				link: api.isDragBlockedTarget(document.getElementById('in'), 'a, [data-no-task-drag]'),
				button: api.isDragBlockedTarget(document.getElementById('btn'), 'a, [data-no-task-drag]'),
				lock: api.isDragBlockedTarget(document.getElementById('lock-child'), 'a, [data-no-task-drag]'),
			};
		});
		expect(result).toEqual({
			link: true,
			button: false,
			lock: true,
		});
	});

	test('isOutsideFormInteraction игнорирует контейнер, портал и класс', async ({page}) => {
		const result = await page.evaluate(() => {
			const api = (window as unknown as {
				altumEventTarget: {
					isOutsideFormInteraction: (
						target: EventTarget | null,
						container: HTMLElement | null,
						portalSelector: string,
						classNamePart?: string,
					) => boolean;
				};
			}).altumEventTarget;
			document.body.innerHTML = [
				'<form id="form"><input id="field"></form>',
				'<div role="dialog"><button id="dlg"></button></div>',
				'<div class="Dropdown_panel_x"><button id="dd"></button></div>',
				'<button id="out"></button>',
			].join('');
			const form = document.getElementById('form');
			const portal = '[role="dialog"]';
			return {
				inside: api.isOutsideFormInteraction(document.getElementById('field'), form, portal, 'Dropdown_'),
				dialog: api.isOutsideFormInteraction(document.getElementById('dlg'), form, portal, 'Dropdown_'),
				dropdown: api.isOutsideFormInteraction(document.getElementById('dd'), form, portal, 'Dropdown_'),
				outside: api.isOutsideFormInteraction(document.getElementById('out'), form, portal, 'Dropdown_'),
				noClass: api.isOutsideFormInteraction(document.getElementById('dd'), form, portal),
			};
		});
		expect(result).toEqual({
			inside: false,
			dialog: false,
			dropdown: false,
			outside: true,
			noClass: true,
		});
	});
});
