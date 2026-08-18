# Changelog

Все заметные изменения в **altum-ui**.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).

---

## [Unreleased]

## [0.0.1] — 2026-08-18

Первая публикация.

React + TypeScript UI-библиотека: CSS Modules, дизайн-токены через **`ThemeProvider`**, адаптация оверлеев под мобильный sheet, без Tailwind / Radix / headless UI. Peer: React 18 или 19. Только ESM.

### Добавлено

- Точки входа: `altum-ui` (компоненты, **`ThemeProvider`**, **`LocaleProvider`**, словари `ru` / `en`), `altum-ui/hooks`, `altum-ui/utils`, `altum-ui/icons`.
- **`ThemeProvider`** — светлая/тёмная тема, CSS custom properties (`--altum-*`), `applyTo` `wrapper` \| `document`.
- **`LocaleProvider`** / **`useLocale`** / **`useT`** — встроенные строки интерфейса.
- Каталог компонентов: кнопки и действия, поля и выбор, оверлеи (`Overlay`, **Modal**, **Sheet**, **Dropdown**, **Tooltip**, **Popover**), навигация, таблицы и списки, раскладка (`Layout`, **Stack**, **Inline**, **Split**, **Grid**), медиа, графики, обратная связь, mobile-жесты.
- Публичные примитивы **`ButtonBase`** и **`FieldBase`**.
- Документация: [README](README.md), [компоненты](docs/COMPONENTS.md), [темизация](docs/THEMING.md), [раскладка](docs/LAYOUT.md), [иконки](docs/ICONS.md).
