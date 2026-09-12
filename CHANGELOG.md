# Changelog

Все заметные изменения в **altum**.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).

---

## [Unreleased]

## [0.0.4] — 2026-09-12

`TimePicker` / `DatePicker` / `DateRangePicker` → **`TimeField`** / **`DateField`** / **`DateRangeField`** (ключи словаря `timePicker` → `timeField`, `dateRangePicker` → `dateRangeField`). Время — барабаны **`WheelTimePicker`**. **`Item`** на **`Flex`**, чище **`Attachment`**, `Flex.gap` — любой `SpacingValue`, floating-label выше, маркеры **`ImageCrop`** на углах кадра. Поля в Storybook — в **`FormField`**.

## [0.0.3] — 2026-09-11

Слоты свёрнуты в пропсы, общие базы полей / диалогов / графиков, предсказуемее оверлеи и hit-target полей.

### Добавлено
- **`clamp`** / **`formatBytes`** в `altum/utils`; баррель снова отдаёт **`ActionSheetTrigger`** / **`SelectionGroup`**.
- **`FieldBaseButton`** / **`FieldBaseIcon`**; **`Checkbox`** / **`Radio`**: `onCheckedChange`; **`Tooltip.side`**; **`Chip.mode`**; **`ChartLegend`** `layout="stack"`.

### Изменено
- Поля на **`FieldBase`** / **`TextControl`** / **`FieldPopup`**; тогглы на **`ToggleControlBase`**; оверлеи на **`DialogBase`**; графики на **`ChartCartesian`**.
- Календари — общий chrome; кнопки, чипы, раскладка — меньше DOM, общие `unstyledControl` и токены.
- Storybook: состояния и play по полям, чартам, календарям и оверлеям.

### Исправлено
- **DatePicker** / **TimePicker** / **DateRangePicker** — панель от края поля; **TextField** — кликабельная зона на всю высоту.
- **DonutChart** — без нативного tooltip; **Container** не вылезает за колонку; clear/affix в **FieldBase** по центру.

### Несовместимые изменения
- Слоты **Item** / **Table** / **Notification** / **Attachment** / **ImageGallery** / **Fieldset** / **FieldBase** / **Dropdown** / **Popover** заменены пропсами.
- **`Accordion.Item`**: `title` + `children` (нет Trigger/Content). **`Chip`**: `mode`. **`Tooltip`**: `side`. **`Dropdown`**: `align` `start`/`end`.
- Оверлеи: `open` / `onOpenChange` и `dismiss`; снят `asChild`. **`TimePickerField`** → **`TimePicker`**.
- С публичного экспорта сняты **Overlay**, **Backdrop**, **FocusTrap**, **CustomSelect**, **Listbox** и др.; affix — **`FieldBaseButton`** / **`FieldBaseIcon`**.

## [0.0.2] — 2026-08-26

Слотовые compound-API свёрнуты в пропсы, тёмная тема собрана заново, оверлеи и поля ведут себя предсказуемее.

### Несовместимые изменения
- Слоты **`Alert`**, **`Card`**, **`Marker`**, **`Skeleton`**, **`ActionList`**, **`CommandPalette`**, **`Select`**, **`Overflow`** заменены пропсами; **`Menu`** вместо **`DropdownMenu`** / **`ContextMenu`**.
- Пропсы позиционирования — на **`Dropdown.Content`** / **`Popover.Content`**; у **`Sheet`** нет `closeLabel` / `padding` на корне.
- **`FieldBase.width`** — только `md` | `full`; **`ButtonBase`** больше не публичный экспорт.

### Изменено
- **`ThemeProvider`** — тёмная navy-лестница поверхностей, steel primary, overlay-поля, без белой инверсии бренда.
- Селекты и поля по умолчанию `width="md"`; фильтры на **`TextField`**; **`CustomSelect`** — `widthMode="trigger-fit"`.
- Полировка chrome: **`Table`**, **`Pagination`**, **`Chip`**, **`Button`**, **`Sheet`**, **`ImageGallery`** / **`ImageLightbox`**.

### Исправлено
- **`Sheet`** без Backdrop снова у края viewport; **`asChild`** не затирает пропсы ребёнка.
- **`DatePicker`** / **`DateRangePicker`** — `type="text"`, пустой лейбл по центру, split-календарь закрывается со второго поля.
- Idle-hover **`ActionList`** / **`Listbox`**; стрелки и смена кадра в **`ImageGallery`**.

## [0.0.1] — 2026-08-18

React + TypeScript UI-библиотека: CSS Modules, дизайн-токены через **`ThemeProvider`**, адаптация оверлеев под мобильный sheet, без Tailwind / Radix / headless UI. Peer: React 18 или 19. Только ESM.

### Добавлено

- Точки входа: `altum` (компоненты, **`ThemeProvider`**, **`LocaleProvider`**, словари `ru` / `en`), `altum/hooks`, `altum/utils`, `altum/icons`.
- **`ThemeProvider`** — светлая/тёмная тема, CSS custom properties (`--altum-*`), `applyTo` `wrapper` \| `document`.
- **`LocaleProvider`** / **`useLocale`** / **`useT`** — встроенные строки интерфейса.
- Каталог компонентов: кнопки и действия, поля и выбор, оверлеи (`Overlay`, **Modal**, **Sheet**, **Dropdown**, **Tooltip**, **Popover**), навигация, таблицы и списки, раскладка (`Layout`, **Stack**, **Inline**, **Split**, **Grid**), медиа, графики, обратная связь, mobile-жесты.
- Публичные примитивы **`ButtonBase`** и **`FieldBase`**.
- Документация: [README](README.md), [компоненты](docs/COMPONENTS.md), [темизация](docs/THEMING.md), [раскладка](docs/LAYOUT.md), [иконки](docs/ICONS.md).
