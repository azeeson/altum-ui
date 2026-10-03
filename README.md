# altum (altum-ui)

Библиотека React + TypeScript-компонентов: CSS Modules, дизайн-токены через `ThemeProvider`, адаптация оверлеев под мобильный sheet, плавающие лейблы. Без Tailwind, Radix и headless UI.

**Peer-зависимости:** React 18 или 19. Только ESM.

```bash
npm install altum react react-dom
```

```tsx
import {Button, Modal, ThemeProvider, LocaleProvider} from 'altum';
import {useMediaQuery} from 'altum/hooks';
import {cn} from 'altum/utils';
import {IconSearch} from 'altum/icons';

export function App() {
	return (
		<ThemeProvider applyTo="document">
			<LocaleProvider locale="ru">
				<Button>Сохранить</Button>
			</LocaleProvider>
		</ThemeProvider>
	);
}
```

## Точки входа

| Импорт | Содержимое |
|--------|------------|
| `altum` | Компоненты, `ThemeProvider`, `LocaleProvider`, словари `ru` / `en` |
| `altum/hooks` | Универсальные хуки (`useMediaQuery`, `useOutsideClick`, …) |
| `altum/utils` | Хелперы (`cn`, `pick`, `omit`, `set`, таймзоны) |
| `altum/icons` | Каталог иконок (не реэкспортируется из главного барреля) |
| `altum/locales` | Словари и `translate` для строк приложения |

Стили подключаются вместе с JS-модулем. Оберните приложение в `ThemeProvider`. Для порталов (`Modal`, `Sheet`, выпадающие панели) используйте `applyTo="document"`. Императивным тостам нужен смонтированный `NotificationProvider`.

Видимость оверлея: `open` + `onOpenChange` + `onClose`. Держите компонент смонтированным (`open={false}` всё равно проигрывает выход; `{open && <Modal>}` — нет).

## Локализация

`LocaleProvider` задаёт язык встроенных строк компонентов. Свои тексты переводите через `altum/locales`: словарь по кодам `ru` / `en` и `translate`. Текущая локаль — `useLocale()`.

Строка поддерживает подстановку `{name}`. Если значение — объект `{one, few, many}`, форма выбирается по `params.count` (для английского используются `one` и `many`).

```tsx
import {LocaleProvider} from 'altum';
import {translate, useLocale, type LocaleCode, type MessageTree} from 'altum/locales';

const appMessages = {
	ru: {
		greeting: 'Привет, {name}',
		files: {
			one: '{count} файл',
			few: '{count} файла',
			many: '{count} файлов',
		},
	},
	en: {
		greeting: 'Hello, {name}',
		files: {
			one: '{count} file',
			few: '{count} files',
			many: '{count} files',
		},
	},
} satisfies Record<LocaleCode, MessageTree>;

function FilesLabel() {
	const {locale} = useLocale();
	return <span>{translate(appMessages[locale], 'files', {count: 2}, locale)}</span>;
}

export function App() {
	return (
		<LocaleProvider locale="ru">
			<FilesLabel />
		</LocaleProvider>
	);
}
```

Словари библиотеки — `ru`, `en` и `builtInMessages`. Точечная замена встроенных фраз — проп `messages` у `LocaleProvider`.

## Документация

- [Компоненты](docs/COMPONENTS.md)
- [Темизация](docs/THEMING.md)
- [Раскладка](docs/LAYOUT.md)
- [Иконки](docs/ICONS.md)
- [Changelog](CHANGELOG.md)

```bash
npm start          # Storybook :6006 (toolbar → Тема)
npm run build      # dist + типы
npm test           # Playwright против статического Storybook
```
