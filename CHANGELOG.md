# Changelog

Все заметные изменения в **altum**.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).

---

## [Unreleased]

## [0.0.13] — 2026-10-05

**`Type`** — роли текста: `page`, `modal`, `section`, `card`, `lead`, `body`, `subtitle`, `label`, `caption`. Тег и кегль задаёт роль.

**Тема** — primary снова steel (`#475569` / `#4e6480`). `tinted` и `danger_tinted` на месте. Ховер и фокус рамок чуть светлее кнопки. Статусы держат WCAG AA, текст не ниже 12px, высоты контролов 32 / 36 / 40 / 48.

**`Alert`** — бледная заливка статуса, тонкая рамка и полоска слева; тост рамку не красит. **`Badge`** — один рецепт заливки, в тёмной теме текст на ней тёмный. **`StatBadge`** красит только число. У **`Card`** `elevated` отличается тенью.

**`TextField`** — на `sm` подпись над значением; в ошибке ховер и фокус оставляют статусную рамку. **`MultiSelect`** не растёт от чипа. У **`Button`** disabled текст темнее. **`ButtonGroup`** показывает `active` и зажатие. **`Steps`**, **`Sidebar`**, **`Pagination`** отличают текущий шаг, пункт и страницу без заливки CTA. **`ActionList`** `tone="danger"` — вес `danger_tinted`.

**`Tooltip`** — в тёмной теме slate, не белый; пузырь в top layer, стрелка смотрит на якорь после смены стороны. **`Overlay`** рендерится в портале. **`useStickyChrome`** пишет прогресс в CSS-переменные.

**Несовместимо.** У **`Card`** снят `ghost`. Поверхность без хрома — **`Box`**.

**Исправлено.** **`ActionSheetTrigger`** снова вызывает `onSelect`. **`WheelTimePicker`** выбирает время под полосой. **`PopupSwitch`** меняет подпись сразу. **`Select`** / **`VirtualList`** заполняют видимую область сразу. Disabled и read-only больше не гасятся через opacity.

## [0.0.12] — 2026-10-03

**`Header`** — шапка страницы: `Title`, `Subtitle` и вкладки. Внутри **`Layout.Header`** черта на всю ширину и по нижнему краю, до контента полный `gap`.

**`Layout`** — `padding` 12 / 20 / 28px. Низ шапки и верх подвала — половина `gap`. У sticky `variant` `primary` / `tinted` / `secondary` красит фон после сдвига скролла. Заливка промежутка через `::before` / `::after` снята.

**Добавлено.** **`useStickyChrome`** в `altum/hooks`: флаг и `data-scrolled`, край `start` / `end`, свой scrollport или окно. **`Modal.Header`** собирает шапку через **`Header`**.

**Несовместимо.** **`Tabs`**: `items` на корне, панели через `tabsRef`. Контекст и `Tabs.List` сняты.

**Исправлено.** **`Tabs`** `line` — прямая черта без скруглённой заливки; `pill` снова берёт трек **`SegmentedControl`**.

## [0.0.11] — 2026-10-03

**`Modal`** — `size` `sm` / `md` / `lg` (400 / 500 / 600px): ширина не больше окна и отступает на 16px от краёв. **`CommandPalette`** той же ширины, что **`Modal`** `md`.

**Добавлено.** **`Menu`** и **`ActionList`** принимают в `items` `{ type: 'separator' }`, как **`Listbox`**. Линия не выбирается.

**Исправлено.** **`Tabs`** больше не сжимает полосу вкладок по высоте. `popovertarget` и `popovertargetaction` в нижнем регистре — React 18 ставит атрибут на кнопку **`Select`** и других триггеров.

## [0.0.10] — 2026-10-03

**`Select`** рисует один `TextField`: поле задаётся `inputProps`, его же настраивают **`SuggestField`**, **`AutocompleteField`** и **`MultiSelect`**.

**Добавлено.** **`pick`** / **`omit`** в `altum/utils`. Хуки `altum/hooks`: **`useMediaQuery`**, **`useIsMobile`**, **`useIsSidebarLarge`**, **`useIsSidebarMedium`**, **`usePrefersReducedMotion`**, **`useOutsideClick`** (мобильный до 768px, сайдбар medium 1024–1279px, large от 1280px).

**Несовместимо.** У **`Select`** сняты `customTrigger`, `triggerMode`, `allowCustom`, колбэки комбобокса, `name`, `required`, `inputRef` и обработчики инпута. Печатное поле — `inputProps` или **`SuggestField`** / **`AutocompleteField`**.

**Исправлено.** Symbol-shrink CSS больше не портит стили: словарь из 30 токенов, minify-имя переменной и alias `injectCss` сохраняются.

## [0.0.9] — 2026-10-02

Платформенный релиз: оверлеи на Popover API / `<dialog>` / CSS Anchor, утилиты в `src/core/utils`, общие CSS-доноры в `src/styles/`, булевы `data-*` как presence и default-fallback для enum. Публичный `altum/utils` без смены имён экспортов.

**Добавлено.** **`AutocompleteField`**, **`MultiSelect`**, тонкий **`ButtonIcon`**-прокси, **`IconBase`** + `ICON_PATHS`, виртуализация **`Table`** / **`SortableList`**, плоские `items` у **`FileList`** / **`Accordion`**, композиция **`FileUploader`**, микро-утилиты `uRef` / `uEv` / `uEvMerge` / `ariaIds` / `getCtx` / `handleRovingFocus`, shared CSS (`unstyledControl`, `overlayTransition`, `scrollable`, `floating`, …). Единый кодекс — **`MANIFEST.md`**.

**Изменено.** **`Select`** / **`SuggestField`** / поля дат — открытие через `showPopover` на click / `:focus-visible`. **`TextField`** — presence `data-*`, static label, chrome affix. **`Overlay`** / **`Popover`** / **`Dropdown`** / **`Menu`** / **`CommandPalette`** / **`ActionSheetTrigger`** — native top layer. **`Notification`** — пауза таймеров на всём стеке при hover. **`Typography`** — донор для Text/Title/Link/Button. Жесты (**`Slider`**, **`SwipeToAction`**, **`PullToRefresh`**, **`SortableList`**) — Pointer Capture + `--local-*` вне React.

**Несовместимо.** Сняты публичные **`SelectionGroup`**, `createIcon`, `As`/`Type`/`FieldPopup`, AdaptiveValue у **`Grid`**, ряд legacy-хуков/утилит (`useOutsideClick`, `useEscapeKey`, FocusTrap-стек, `composeRefs`, …). **`Select.triggerMode`** — `'button' | 'input'`; freestyle — **`AutocompleteField`**. Рефы — `rootRef` / `inputRef` / `controlRef`, без `forwardRef`.

**Исправлено.** **`VirtualList`** (синхрон `translate3d`↔range, конец списка), **`SortableList`** DnD, **`Menu`** context, **`ActionSheetTrigger`**, **`PopupSwitch`**, **`Select`**/`AutocompleteField` Enter, **`Sidebar`** toggle/tooltip, **`Sheet`** handle, **`FileList`** double border, **`ImageLightbox`**, **`SegmentedControl`** `itemFit="content"`, **`ActionList`** filter focus, **`Bubble`** reactions, **`PasswordField`** meter, **`Button`** ghost/link.

## [0.0.8] — 2026-09-28

**`Gap`** — пустой зазор (`size`, `orientation`). У **`Item`** `wrap` переносит длинные `title` и `description`.

**Исправлено.** У **`Attachment`** hover ошибки не снимает заливку, `sm` / `xs` берут свой кегль, загрузка — `aria-busy`, ошибка — `aria-invalid`. У **`Alert`** один зазор до `actions`.

## [0.0.7] — 2026-09-28

**`FieldGroup`** стыкует поля и кнопки одной рамкой: оболочка **`Select`** по видимому полю, высота как у кнопки и **`PopupSwitch`**, тень варианта не ложится на соседа. **`PopupSwitch`**: `width="options"` по самой длинной подписи, шеврон **`IconChevronUpDown`**. У **`Button`** `variant="link"` `size` меняет кегль и иконку. Storybook **About**: страница бренда и каталог компонентов (`npm run catalog`).

**Несовместимо.** У **`Select`** снят `combobox` (вместе с `inputRef`, `wrapperProps`, `name`, `required` и обработчиками инпута). Свой триггер — `customTrigger`: **`SuggestField`** рисует там `TextField`, **`Select`** поле не рисует.

**Исправлено.** Клик по шеврону **`Select`** открывает и закрывает список. Отступ справа от шеврона **`PopupSwitch`** как у **`Select`**.

## [0.0.6] — 2026-09-27

**`DialogLayout`**, **`PopupSwitch`**, **`LiveRegion`**. **`isExistingLocalDate`** в `altum/utils`. Диалоги (**`Modal`**, **`Sheet`**, **`ImageCrop`**, **`CommandPalette`**) собраны из **`DialogLayout`**, **`Box`** и **`Layout`**. **`Select`** сам держит список, **`SuggestField`** — комбобокс на нём. **`Dropdown`** на **`Popover`**. У **`Layout`** отступы `padding` и `gap` (`sm` / `md` / `lg`): padding на секциях, промежуток у липких шапки и футера остаётся при прокрутке.

**Несовместимо.** Снят **`CustomSelect`**: выбор — **`Select`**, подсказки — **`SuggestField`**. У **`Overlay`** нет `popover` / `dropdown`. У **`Popover`** нет `wrap`, корня и стрелки; класс панели — `className`, ширина — `widthMode`. У **`Tooltip`** сторона — `side`, стрелки нет. У **`Chip`** роль — `mode`. **`Layout`** больше не отдаёт `Inline`, `Split`, `ControlRow` и `Item`. У **`Modal`** крестик и имя на корне (`showClose`, `aria-label`); заголовок — **`Title`**, кнопки — **`ControlRow`** в футере. У **`Sheet`** заголовок — **`Title`**, крестик — `showClose` на **`Sheet.Header`**. **`Sidebar.Collapse`** снят. Удалены **`DialogBase`** и неиспользуемые токены темы. `useLocale()` без провайдера возвращает ключ.

**Исправлено.** Стрелки **`ImageGallery`** листают кадр только при фокусе в галерее. Бегунок **`SegmentedControl`** при `itemFit="content"` не рвёт анимацию. Ховер кнопок внутри **`TextField`** читается на фоне поля. **`Overflow`** вызывает `onSelect` один раз. Автозакрытие **`Notification`** срабатывает и при `prefers-reduced-motion`.

## [0.0.5] — 2026-09-25

**`useForm`**: проверка через `validate` (`fieldRules`, `compose`, `required`, `pattern`, `checkedValue`), плюс `setValue`, `reset`, `handleSubmit`, `isDirty` и **`FormProvider`**. Публичные **`altum/locales`** со склонением и утилиты дат, поясов, длительности и plural.

**`TextField`** вбрал `FieldBase`: `description` вместо `helperText` / `footer`, без `labelPlacement`. **`Button`**: `prefix` / `postfix` и `danger` / `danger_tinted` вместо `status`; **`ButtonIcon`** на **`Button`**. Стили в `@layer altum` — один `className` перекрывает библиотеку. **`ThemeProvider`** при `applyTo="document"` не вешает тему на обёртку.

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
- **`ActionList`** — Enter выбирает подсвеченный пункт в порядке групп, а не в сыром порядке `items`.
- **`VirtualList`** — видимые строки снова следуют за `renderItem` при рендере родителя (подсветка в виртуализированном **`Listbox`**).
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
