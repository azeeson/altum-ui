import {test, expect} from '@playwright/test';
import {en} from '../../src/locales/en';
import {ru} from '../../src/locales/ru';
import {translate} from '../../src/locales/translate';

test.describe('translate plural', () => {
	test('склоняет русский count и оставляет обычный шаблон', () => {
		expect(translate(ru, 'upload.selectedCount', {count: 1}, 'ru')).toBe('Выбран 1 файл');
		expect(translate(ru, 'upload.selectedCount', {count: 2}, 'ru')).toBe('Выбрано 2 файла');
		expect(translate(ru, 'upload.selectedCount', {count: 5}, 'ru')).toBe('Выбрано 5 файлов');
		expect(translate(ru, 'upload.selectedCount', {count: 11}, 'ru')).toBe('Выбрано 11 файлов');
		expect(translate(ru, 'calendarBoard.moreTasks', {count: 21}, 'ru')).toBe('ещё 21 задача');
		expect(translate(ru, 'common.close')).toBe('Закрыть');
	});

	test('для en берёт one и many', () => {
		expect(translate(en, 'upload.selectedCount', {count: 1}, 'en')).toBe('1 file selected');
		expect(translate(en, 'upload.selectedCount', {count: 2}, 'en')).toBe('2 files selected');
		expect(translate(en, 'calendarBoard.dayWithTasks', {
			day: 3,
			month: 'March',
			count: 1,
		}, 'en')).toBe('3 March, 1 task');
	});
});
