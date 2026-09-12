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
| `altum/utils` | Хелперы (`cn`, `composeRefs`, listbox/якорь, стек оверлеев) |
| `altum/icons` | Каталог иконок (не реэкспортируется из главного барреля) |

Стили подключаются вместе с JS-модулем. Оберните приложение в `ThemeProvider`. Для порталов (`Modal`, `Sheet`, выпадающие панели) используйте `applyTo="document"`. Императивным тостам нужен смонтированный `NotificationProvider`.

Видимость оверлея: `open` + `onOpenChange` + `onClose`. Держите компонент смонтированным (`open={false}` всё равно проигрывает выход; `{open && <Modal>}` — нет).

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
