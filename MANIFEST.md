# ALTUM UI MANIFEST: ЕДИНЫЙ АРХИТЕКТУРНЫЙ И ИНЖЕНЕРНЫЙ КОДЕКС

> **Версия:** 3.0.0  
> **Статус:** Действующий корпоративный стандарт (`altum-ui`)  
> **Стек:** React 18+, TypeScript Strict, CSS Modules (Nesting & Platform Tokens), Rollup (ESM, Zero-Headless).  
> **Префикс публичных CSS-токенов и хуков:** `altum`  
> **Ядро утилит:** `src/core/utils/` (`cn`, `uRef`, `uEv`, …)  

---

## 1. Фундаментальная миссия и философия Altum UI

**Altum UI** — библиотека премиальных, бескомпромиссно быстрых пользовательских интерфейсов. Цель — максимальная простота интеграции, предсказуемый публичный API, плавность 120 FPS и ультра-компактный вес монолитного бандла.

Мы принципиально отвергаем тяжёлые внешние headless-библиотеки (Radix UI, Floating UI, Framer Motion, Zag.js, Downshift, Tailwind, shadcn). В современной веб-платформе нужные примитивы уже реализованы браузером:

- **Top Layer и диалоги:** `<dialog>` + `.showModal()` / `.show()` вместо JS focus-trap. Узел слоя — портал в ближайший `[data-theme]` или `document.body`, чтобы стили обёртки не попадали в содержимое.
- **Всплывающие окна без JS:** Popover API (`popover="auto"` / `popover="manual"`) с light dismiss и `Escape`.
- **Позиционирование на GPU:** CSS Anchor Positioning (`position-anchor`, `position-area`, `position-try-fallbacks`) вместо `getBoundingClientRect`-библиотек.
- **Аппаратные переходы присутствия:** `@starting-style`, `transition-behavior: allow-discrete`, `overlay: auto`.
- **Адаптивность в CSS:** `@media`, `@container` вместо `useMediaQuery` и фоновых `window.resize`.

### Цели инженерии

| Цель | Как проявляется |
|------|-----------------|
| Минимум оверхеда | Меньше строк и аллокаций при том же публичном API |
| Производительность | Меньше рендеров; фокус, жесты, позиция — в DOM / CSS |
| Читаемость | Логика в утилитах / донорах; презентация — плоский JSX |
| Сухой CSS | Инфраструктура один раз в `src/styles/`; модуль компонента — только уникальная геометрия |
| Стабильный контекст | Контекст со статичными ссылками; динамика — в DOM или EventEmitter |

### Принцип «Предельного Лаконизма» (Правило 45 строк)

Любой атомарный компонент, внутренний узел или презентационный слот должен стремиться укладываться в **≈ 45 строк** лаконичного функционального кода (прокси-наследники — короче). Если файл превышает объём — декомпозиция, перенос состояний в CSS либо наследование от базового донора.

---

## 2. Архитектурные принципы

### 2.1. Behavior & Chrome Separation

1. **Логические доноры** (`Overlay`, `TextField`, `SelectionGroup`, типографика) — API платформы, ARIA, рефы. Без иконок, шапок и декоративного хрома.
2. **Макро-компоненты** (`Modal`, `Select`, `PasswordField`, …) — тонкие Chrome-обёртки: слоты, иконки, визуал по месту.
3. **`Box`** — только там, где нужна **поверхность** (заливка, тень, радиус): Card, Modal chrome, Popover surface, Item. Не оборачивать «на всякий случай» — чаще нативный тег + CSS-модуль.

Если виджет собирается из уже открытого компонента — рендери его напрямую. Промежуточные приватные `BaseInput` / `BaseModal` не создавать. Если общего публичного донора нет — внутренний примитив (`ToggleControlBase`, `SelectionGroup`) или утилита ядра.

### 2.2. Platform-First

Если открытие, закрытие, фокус или позиция уже решены HTML/CSS — React только ставит разметку и данные.

**Запрещены:** слушатели `scroll` / `resize` на `window` ради оверлея; `useOutsideClick` / `useEscapeKey` / `useFocusTrap` для native popover/dialog; `useState` только ради клика по инвокеру; Floating UI.

### 2.3. Zero Dynamic Context

Контекст содержит только стабильные ссылки (функции, EventEmitter). Динамика — атрибуты `data-*` / ARIA или подписка на шину. Стабильные колбэки в контексте: `[]` + `useRef` на внешний `onChange`.

### 2.4. Остальные законы

| # | Принцип | Практика |
|---|---------|----------|
| 1 | Smart / Presentational | Состояние в контейнере; дети — через props / DOM |
| 2 | Event Delegation | Один `onClick` / `onKeyDown` на родителе; `.closest('[data-…]')` |
| 3 | Declarative Focus | `tabIndex`, `data-highlighted`, нативный `.focus()` — не индекс в `useState` без нужды |
| 4 | Pure utils | Без хуков/стейта → `*.utils.ts` или `src/core/utils/` |
| 5 | Memo by Composition | `children` / slots вместо `React.memo` / `useCallback` по умолчанию |
| 6 | CSS-only UI states | `:hover`, `:focus-visible`, `:active`, `:checked` — в CSS Modules |
| 7 | EventEmitter / vanilla-стор | Когда DOM не хранит поток (тосты, hover календаря) |
| 8 | Uncontrolled by default | `defaultValue`; контролируемый `value` — по внешней нужде; формы — `FormData` |
| 9 | Derived State | Без синхро-`useEffect` проп→стейт (маски, фильтры, strength) |
| 10 | Bypassing React (жесты) | Pointer Capture + `.style.setProperty` / `transform`; React — на `pointerup` |

---

## 3. Архитектурные стандарты JS/TS и React

### 3.1. Искоренение `forwardRef` и полиморфизм без синтаксического шума

`React.forwardRef` — антипаттерн в Altum UI: лишний рантайм-слой, ломает автодополнение, требует кастов (`ref as never`) для полиморфного `as`.

**Стандарт Altum:**

- Все ссылки на DOM — явные типизированные пропсы-рефы:
  - `rootRef` — корневой контейнер
  - `inputRef` — нативное поле ввода
  - `controlRef` — императивный контроллер виджета **или** управляющий интерактивный узел (по роли API)
  - `popupRef` — панель поповера / шторки
  - `listRef` / `itemRef` / `tableRef` — узлы по роли
- Презентационный компонент — **обычная функция**. **`forwardRef` и ручной `.displayName` не ставить.**
- Полиморфизм локально:

```tsx
export const Box = ({
  as: Component = 'div',
  rootRef,
  className,
  ...rest
}: BoxProps) => {
  return <Component ref={rootRef} className={cn(styles.root, className)} {...rest} />;
};
```

### 3.2. Запрет `useImperativeHandle`

Императивный фасад — через пропс `controlRef` с объектом контроллера (например `scrollToIndex`), не через `useImperativeHandle`.

### 3.3. Запрет инлайновых стрелочных функций в JSX-циклах

Инлайновые `onClick={() => …}` внутри списков / таблиц / групп аллоцируют функции на каждый рендер и провоцируют GC-фризы.

**Стандарт:** стабильные обработчики и/или **Event Delegation** на контейнере.

```tsx
export const Rating = ({value, max = 5, onChange}: RatingProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-rating-index]');
    if (!target) return;
    onChange?.(Number(target.getAttribute('data-rating-index')));
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      {Array.from({length: max}, (_, i) => (
        <button key={i} type="button" data-rating-index={i + 1} aria-checked={i < value} />
      ))}
    </div>
  );
};
```

### 3.4. Высокочастотные жесты: Pointer Capture и Direct DOM Mutation

Для `Slider`, `SwipeToAction`, `PullToRefresh`, `ImageCrop`, `SortableList` **`useState` во время перемещения запрещён**.

1. `pointerdown` → `setPointerCapture(pointerId)`.
2. `pointermove` → мутация DOM в обход React: `--local-*`, `transform: translate3d(...)`, `data-*`.
3. `pointerup` → `releasePointerCapture` + один React-колбэк (`onChange`, `onOrderChange`, …).

### 3.5. Derived State вместо каскадных `useEffect`

Синхронизация проп→стейт через `useEffect` порождает двойной рендер. Вычисляй во время рендера (или `useMemo` при дорогой чистой функции).

### 3.6. Запрет `Children.map` / `cloneElement`

Структурированные данные — через `items` или Render Props. Theme-пропсы детям — CSS-каскадом от родителя (`data-gap`, соседские селекторы), не `cloneElement`.

### 3.7. Запрет `useMediaQuery` и фонового `ResizeObserver` ради оверлеев

Адаптив — `@media` / `@container` / `position-try-fallbacks`.  
**Исключение:** Measure-режим Overflow (variable chips) — ResizeObserver допустим.

### 3.8. Роль `src/base/`

Приватная инфраструктура, **не** экспортируется из `src/index.ts`: `ToggleControlBase`, `ToggleGroupBase`, `ChartBase` / `ChartCartesian`, `PeriodHeader`, `Flex`, …

**Ликвидированы и не возвращать:** `As`, `Type`, `FieldPopup`.

---

## 4. Слои наследования

Низкий слой не импортирует высокий. Макрос слоя 6 — конструктор из кубиков ниже.

```
Слой 0  Примитивы: Text, Title, Link, Box, Media, Kbd, Gap, Separator, Layout/Flex…
Слой 1  Интерактив: Button, ButtonIcon, ToggleControlBase → Checkbox/Radio/Switch, Progress
Слой 2  Overlay / Top Layer: <dialog>, Modal, Sheet, Sidebar (mobile)
Слой 3  TextField и производные поля
Слой 4  Popover / CSS Anchor: Dropdown, Menu, Tooltip, ActionSheetTrigger
Слой 5  SelectionGroup, Listbox, ActionList, Item, Collapse/Accordion, FileList…
Слой 6  Макросы: Select, Calendar*, Table, VirtualList, Charts, CommandPalette…
Слой 7  ThemeProvider, LocaleProvider, LiveRegion
```

### 4.1. Семейства доноров

| Донор | Наследники / состав |
|-------|---------------------|
| **TextField** | SearchField, PasswordField, NumberField, MaskedField, TextareaField (`as="textarea"`, `field-sizing: content`), PinInput |
| **Overlay** | Modal, Sheet; ConfirmDialog → Modal; CommandPalette |
| **Popover** | Dropdown, Menu; Tooltip — CSS Anchor + delay vars (лёгкий VDOM, **не обязан** оборачивать Popover) |
| **ToggleControlBase** | Checkbox, Radio, Switch |
| **SelectionGroup** | RadioGroup, SegmentedControl, Tabs; ColorSwatchGroup через `customRenderOption` |
| **Flex** (base) | Stack, Inline, Split, ControlRow / LayoutItem |
| **Box** | Card, Item, DialogLayout, chrome Modal/Sheet/Popover где нужна поверхность |
| **Media** | Avatar; AvatarGroup — раскладка поверх Avatar |
| **ChartBase / ChartCartesian** | BarChart, LineChart; DonutChart → ChartBase + ChartLegend |
| **Collapse** | Accordion (`<details>` / `name` или grid `0fr → 1fr`) |
| **Select** | Один `TextField`; печатный триггер — `inputProps` (`SuggestField`, freestyle — `AutocompleteField`, chips — `MultiSelect`) |
| **Button** | ButtonIcon — тонкий прокси (`data-icon-only`, icon/children → `prefix`) |

### 4.2. Не путать

| Компонент | Смысл |
|-----------|--------|
| **Alert** | Инлайновый статус — не модалка и не Overlay |
| **Bubble** | Пузырь чата — **не** chrome тултипа |
| **PopupSwitch** | Выбранный пункт поверх кнопки — **не** образец для новых окон |
| **Backdrop** | Для модалок — `::backdrop` у `<dialog>`; отдельный компонент — только кастомные немодальные фоны |
| **SuggestField** | Прокси Select; не второй независимый комбобокс |
| Floating-label | **Не возвращать** у TextField — статическая подпись над chrome |

---

## 5. Контракт API (Attr Taxonomy)

### 5.1. Таксономия пропсов

| Категория | Паттерн | Примеры | Запрещено |
| :--- | :--- | :--- | :--- |
| **Состояние** | `[target]` / `on[Target]Change` | `open` / `onOpenChange`, `value` / `onChange` | `Visible`, `Show`, `onChanged` |
| **Внешний вид** | `variant`, `size`, `color`, `shape`, `elevation`, `status` | `variant="primary"`, `size="sm"\|"md"\|"lg"` | синонимы `type` / `kind` / `theme` ради внешнего вида |
| **Слоты** | `prefix`, `postfix`, `header`, `footer`, `media`, `actions`, `trigger` | `prefix={<IconSearch />}` | `startIcon`, `endIcon`, `leftElement` |
| **Флаги** | `disabled`, `readOnly`, `loading`, `multiple`, … | без `is` / `has` | `isDisabled`, `hasError` |
| **Рефы** | `rootRef`, `inputRef`, `controlRef`, `popupRef`, … | явные пропсы | `forwardRef` |
| **Доступность** | `aria-*`, `role` | стандарт WAI-ARIA | — |

Размер контролов `sm | md | lg` — тип **`ControlSize`**. Опциональный chrome: `showClose` / `showHandle` / …, не `with*` / `hide*`.

### 5.2. Булевы и data-атрибуты

Интерактивные флаги **без** префиксов `is`/`has`.

**Булевы в DOM — presence**, не строка `'true'`:

```tsx
'data-disabled': disabled ? ('' as const) : undefined,
'data-selected': isSelected ? ('' as const) : undefined,
```

В CSS: `&:is([data-disabled], :disabled)`, `&[data-selected]`.

**Перечисления** — значением; **дефолт можно не писать**:

```tsx
'data-variant': variant !== 'primary' ? variant : undefined,
'data-size': size !== 'md' ? size : undefined,
```

`inert`: когда блок активен / открыт — атрибут отсутствует (`undefined`).

### 5.3. События, геометрия, локализация, id

- События: `on` + существительное без `-ed`: `onChange`, `onOpenChange`, `onSelect`, `onClear`.
- Геометрия: `orientation`, `align`, `side`, `widthMode`, …
- Локализация: `label`, `description`, `placeholder`, `clearLabel`, `emptyText`, … через `LocaleProvider` / `useLocale`.
- Связанные id: один `useFallbackId(id)`; не плодить `useId` и не сбрасывать дерево `key={String(open)}`.

### 5.4. Темизация

Не плодить JS-пропы `borderColor` / `bg` / `hoverColor`. Кастомизация снаружи — только публичные CSS custom properties `--altum-[component]-*`.

### 5.5. Rest / className / compose handlers

- `className` вынимать из rest; `cn(внутренние…, className)` — потребительский класс **последним**.
- `{...rest}` на DOM обычно последним (`id`, `data-*`, `type="submit"`), кроме внутренних `aria-*` / `role`, которые держат роль компонента — их ставят **после** rest.
- Обработчики: compose через `uEvMerge` (сначала потребительский, затем внутренний, если `!defaultPrevented`).

Кнопки: `type="button"` по умолчанию. Только string unions, не `enum`. Дефолты — в деструктуризации, не `defaultProps`. `any` запрещён.

---

## 6. Платформенный CSS и стандарт стилизации

### 6.1. Nesting Rules First

Каждый компонент — `[Component].module.css`.

1. **Один корневой класс:** `.root` **или** camelCase имени компонента (`.sheet`, `.dropdown`).
2. **Всё остальное — native nesting** через `&`.
3. **Глубина ≤ 4** (Stylelint `max-nesting-depth`).
4. **Без БЭМ:** запрещены `__` / `--` / kebab в именах классов. Только `camelCase`: `.itemHeader`, `.iconSlot`.

### 6.2. CSS-only UI States

Динамическая сборка `className={cn(styles.root, isActive && styles.active, styles[variant])}` **запрещена**.

Состояния — через **дата-атрибуты, ARIA и псевдоклассы**:

```css
.button {
  display: inline-flex;
  background-color: var(--altum-btn-bg, var(--altum-color-brand));

  &[data-variant='primary'] { /* … */ }
  &[data-size='sm'] { /* enum */ }
  &:is([data-disabled], :disabled) { /* boolean presence */ }
  &:hover:not(:disabled):not([data-disabled]) { /* … */ }
  &:focus-visible {
    outline: var(--altum-focus-ring-width) solid var(--altum-focus-ring-color);
  }
  &[aria-invalid='true'] { /* … */ }
}
```

HEX/RGB — только в `ThemeProvider`. В компонентах — только `var(...)`.

### 6.3. Иерархия токенов

```
[1] Глобальные:   --altum-g-[категория]-[название], --altum-color-[палитра]-…
[2] Семантические: --altum-color-surface, --altum-color-border, --altum-focus-ring-color
[3] Публичные компонента: --altum-[component]-[property]
[4] Приватные узла: --local-[property]  (жесты, внутренняя геометрия)
```

На корне объявляй публичные токены с фолбеком на семантику/глобалы. Продуктовый код не должен зависеть от `--local-*`.

Stylelint: `selector-class-pattern` = `^root$|^[a-z][a-zA-Z0-9]+$`; `custom-property-pattern` = `altum-g-*` | `altum-color-*` | `altum-[component]-[prop]` | `local-*`.

### 6.4. Motion

Анимируются только композитинговые свойства: **`opacity`**, **`transform`**, **`filter`**, плюс discrete **`visibility` / `display`** через `allow-discrete` / `@starting-style`.

**Запрещено** анимировать `width`, `height`, `margin`, `padding`, `top`, `left` ради UI.

Оверлеи: класс из `src/styles/overlayTransition.module.css` + `@starting-style`. Обязателен `prefers-reduced-motion`.

### 6.5. Общие CSS-утилиты (`src/styles/`)

CSS Modules изолируют хэши — повторяющаяся инфраструктура **не** склеится минификатором. Шары — в `src/styles/`, клеятся через `cn(...)`:

| Модуль | Роль |
|--------|------|
| `unstyledControl.module.css` | сброс chrome контролов |
| `overlayTransition.module.css` | `.fadeScale` |
| `scrollable.module.css` | scrollbar / scrollport |
| `floating.module.css` | Anchor / тени поповеров |
| `mediaItem.module.css` | Item / Attachment / Alert / Notification |
| `flexChild.module.css` | grow / noShrink / fill |
| `visuallyHidden.module.css` | a11y-скрытие |
| `overlayScrim` / `overlayClose` | scrim и крестик Overlay |
| `selectField`, `toggleBox`, `fieldMessage`, `calendarChrome`, … | узкие шары |

**Ядро стилей закрыто:** новые дубли unstyled / scrollbar / fadeScale в компонентном CSS не заводить.

```tsx
className={cn(scroll.area, styles.listbox)}
className={cn(unstyled.control, styles.option)}
className={cn(overlayTransition.fadeScale, styles.anchor)}
```

---

## 7. Ядро микро-утилит (`src/core/utils/`)

Утилиты живут **только** в `src/core/utils/`. Публичная поверхность — `src/entries/utils.ts` (`altum/utils`).

| Утилита | Назначение |
|---------|------------|
| `uRef(r1, r2)` | Слияние двух рефов (замена `composeRefs`) |
| `uEv(cb, stop?, prev?)` / `uEvMerge(a, b)` | Стабильные обработчики / compose |
| `ariaIds(...ids)` | Склейка id для `aria-describedby` / `aria-labelledby` |
| `handleRovingFocus` | Стрелки / Home / End → `.focus()` |
| `getCtx(context, message)` | `useContext` или throw |
| `cn(...)` | Классы без лишних пробелов |
| `pick` / `omit` | Копия объекта с выбранными ключами или без них |
| `useFallbackId` | Стабильный id с фолбеком |
| `getFormControlState` | Флаги поля + presence `data-*` / `aria-*` |
| `dom` | Pointer Capture, `anchorNameFor`, grid focus… |
| `popover` | `positionArea`, `showPopover` / `hidePopover` |
| `math` / `date` / `form` / … | Чистая логика без React |

**Не возвращать:** `composeRefs`, `composeEventHandlers`, `useEscapeKey`, `createLibraryPortal` для native dialog/popover. **`useOutsideClick`**, **`useMediaQuery`**, **`usePrefersReducedMotion`** и **`useStickyChrome`** — публичные хуки `altum/hooks` для потребителей. В компонентах оверлеев их не вызывать: dismiss и ресайз остаются на Popover API / `<dialog>` / CSS.

Инлайновые стрелки на события и инлайн callback-`ref` в JSX — антипаттерн. Выноси в именованный колбэк, делегирование, `uEv` / `uRef`.

---

## 8. Иконки (Zero-Object Registry)

1. Строковый реестр путей: `src/icons/registry.ts` → `ICON_PATHS`.
2. Единый донор: `src/icons/IconBase.tsx` (`viewBox="0 0 92 92"`, `fill=currentColor`); экспорт из `altum/icons`.
3. Иконки — `(p) => <IconBase d={ICON_PATHS.*} {...p} />`. Фабрика `createIcon` **удалена**.
4. Цвет — `currentColor` / `color` prop.

---

## 9. Паттерны по областям

### 9.1. Оверлеи и поповеры

| Сценарий | Решение |
|----------|---------|
| Light dismiss | `popover="auto"` + `popovertarget` |
| Модалка / sheet | `<dialog>` + `showModal()` |
| Floating без якоря | `popover="manual"` + `showPopover()` / `hidePopover()` |
| Позиция к якорю | CSS Anchor (`positionArea` из `popover.ts`) |
| Анимация | `@starting-style`, без `usePresence` / таймера удержания узла |

`aria-expanded` на кнопке с `popovertarget` выставляет браузер — React не должен затирать платформенное значение. Узнать открытие — из события `toggle`.

**Tooltip** — текст + CSS `:hover` / `:focus-visible` + Anchor; пузырь `popover="manual"` в top layer, задержки — CSS-переменные. **Popover / Dropdown** — интерактивная панель через `popovertarget`, без JS-ховера.

Исключение: мобильный Sheet у Dropdown — модальный слой с `open`. Sheet motion: translate на dialog; fadeScale — на floating/modal host.

### 9.2. Listbox / комбобокс

| Режим | Фокус | Движение |
|-------|-------|----------|
| `roving` | Пункт | Корень `tabIndex={0}`, у пунктов `-1`; стрелки → `focus()` |
| `highlight` | Поле | `data-highlighted` + `aria-activedescendant` |

Индекс по данным; в DOM — атрибут на одной ноде. Enter — клавиатурная подсветка; клик — пункт под курсором. `aria-activedescendant` поле пишет из ref списка — React не должен рендерить атрибут и затирать его.

### 9.3. Тосты (`Notification`)

1. Список — vanilla-стор (`ToastStore`), не `useState` в провайдере.
2. Контекст — только `notify` / `dismiss` / `dismissAll`.
3. Контейнер — `useSyncExternalStore`; `getItems()` возвращает **тот же** массив, пока состав не менялся.
4. Lifetime / прогресс / пауза — CSS (`--altum-toast-life`, `data-life`, `animation-play-state`). `setTimeout` на lifetime запрещён.
5. Снятие узла — `animationend` leave; ручное закрытие — `data-closing`.
6. `prefers-reduced-motion` гасит вход, но оставляет leave (~1ms), иначе тост зависнет.

Ховер на **любое** уведомление в стеке ставит на паузу таймеры **всех** `[data-pause]` тостов стека.

### 9.4. VirtualList

- Высота — `estimateSize`; распорка задаёт scroll height.
- Сдвиг окна — `translate3d`, **синхронный с `range` в одном рендере** (не eager DOM transform + `startTransition(setRange)` вразнобой).
- `setState` через `startTransition` только при смене окна.
- Abspos-контент не должен раздувать `scrollHeight` распорки (`overflow: clip` на spacer).
- Table virtualized: sticky thead + windowed body.

### 9.5. Жесты и SortableList

Пиксели вне React; `setPointerCapture` на корне; один коммит порядка на отпускании. Середина строки — `offsetTop` / `offsetHeight` (не `getBoundingClientRect` уже сдвинутого узла).

### 9.6. Группы выбора

Статичный контекст + Event Delegation по `data-selection-value`. Roving — `handleRovingFocus`. Без `cloneElement` для `size`/`variant`.

### 9.7. Collapse / Accordion

`<details>` / `<summary>` и/или CSS `grid-template-rows: 0fr → 1fr` по `data-expanded`. Без JS-замера `scrollHeight`.

### 9.8. Осознанные исключения

| Тема | Решение |
|------|---------|
| Overflow Measure | ResizeObserver допустим для variable chips |
| Menu context | координаты курсора на панели (`top`/`left`), открытие после жеста (light-dismiss race) |
| Sheet handle | `.sheet[data-handle]::before`, не отдельный GrabHandle |
| Крестик оверлея | внутренний close-control + `overlayClose` + `IconCross` |

---

## 10. Ликвидированные сущности (не возвращать)

| Было | Вместо |
|------|--------|
| `As` / `Type` / `FieldPopup` | локальный `as`, доноры |
| `GrabHandle` | `::before` в Sheet CSS |
| `Backdrop` (для модалок) | `<dialog>::backdrop` |
| `OverlayCloseButton` (публичный) | внутренний close-control |
| `DropdownPopup` (компонент) | тип API-ref |
| `createIcon` | `(p) => <IconBase d={…} />` |
| Стек фокуса своим порталом вместо `<dialog>` | native top layer; узел слоя всё же вынесен из обёртки |
| `useOutsideClick` / `useEscapeKey` / FocusTrap-стек | Popover API / `showModal()` |
| Floating-label TextField | статическая подпись |
| ButtonGroup → `cloneElement` | CSS `.group > .button` |
| FieldGroup → clone children | Grid/Flex + токены |
| `src/utils/` как дом утилит | `src/core/utils/` |

`ButtonIcon` **сохранён** как тонкий публичный прокси над `Button`. Не раздувать обратно в отдельный визуальный компонент с дублем CSS.

---

## 11. WAI-ARIA и доступность

### 11.1. Popover API

- Триггер: `popovertarget` + `aria-haspopup` где уместно.
- Панель: `popover="auto"` (меню, комбобоксы, тултипы) или `popover="manual"` (управляемые тосты / floating).
- Light dismiss и `Escape` — движок браузера.

### 11.2. Диалоги

- Контейнер — `<dialog>`; модалка — `.showModal()` (focus trap, `::backdrop`, scroll lock / `inert`).
- Закрытие — `.close()`.

### 11.3. Списки, таблицы, формы

- Listbox: `role="listbox"` / `option`, `aria-selected`, `aria-disabled`.
- Таблица: нативные `<table>` / `scope` / `aria-sort`; ресайз колонки — `role="separator"`.
- Формы: `FieldLabel`, `FormMessage` (`role="alert"` при ошибке), `useFallbackId`.
- Live — `LiveRegion` / `aria-live`.
- Кликабельное — `button` / `a` / native `input`, не `div` с `onClick`.
- Icon-only — `aria-label`.
- Фокус: видимый `:focus-visible`. Контраст ≥ 4.5:1. Проверка VoiceOver / NVDA — часть качества релиза.

---

## 12. Definition of Done и кодекс ревью

Компонент / PR готов, если:

1. Нет `forwardRef` / `.displayName`; рефы — явные пропсы.
2. Нет `styles[variant]` / `.isActive` — только `data-*` / `aria-*` + CSS.
3. В циклах нет инлайновых стрелок на события — Delegation или стабильные колбэки.
4. Нет легаси-утилит из §7 / §10.
5. CSS: один корень, nesting ≤ 4, токены `--altum-*` / `--local-*`; нет дубля unstyled / scrollbar / fadeScale.
6. Ориентир компактности ≈ 45 строк функционального тела.
7. Поведение/API — в `CHANGELOG.md` → `[Unreleased]` (чистый docs-only consolidation changelog не требует).
8. Для оверлеев / списков / тостов / виртуализации / жестов — законы §9.

### Чек-лист PR

- [ ] Нет `forwardRef` / `useImperativeHandle` / `useMediaQuery` / `cloneElement` / `Children.map`
- [ ] Нет `useOutsideClick` / `useEscapeKey` / самодельного focus-trap для native popover/dialog
- [ ] Булевы data — presence; enum-дефолты можно опустить
- [ ] Наследование от открытого донора или `src/base/`; без нового промежуточного Base*
- [ ] Контекст статичен; динамика в DOM или сторе
- [ ] Общая CSS-инфраструктура из `src/styles/`
- [ ] Transition только на GPU-friendly свойствах
- [ ] Modal/Sheet: `<dialog>` / `showModal()`
- [ ] Popover/Dropdown/Tooltip/Select/Menu: CSS Anchor + Popover API
- [ ] Запись в `CHANGELOG.md` при изменении публичного API / поведения

### ESLint (ориентир CI)

Запрещать AST-селекторами: `forwardRef`, `useImperativeHandle`, `cloneElement`, `useMediaQuery`, а также устаревшие имена колбэков (`onChanged` / `onSelected`) и `is*` / `has*` в `*Props` — по действующему `eslint.config.js`.

---

## 13. Рабочий процесс

### Новый компонент / сжатие

1. Нужное уже есть в `src/styles/` или `src/core/utils/`? Переиспользуй.
2. Можно собрать из открытого донора (TextField / Overlay / Popover / SelectionGroup / Select / Button)? Наследуй.
3. Нужна поверхность? `Box` или свой chrome-CSS; иначе — нативный тег.
4. Состояния → `data-*` / ARIA + nesting CSS.
5. Жесты / списки → DOM + delegation.
6. Иконки → `IconBase` + `ICON_PATHS`.
7. Сборка / линт / тесты; публичные изменения — `CHANGELOG.md` → `[Unreleased]`.

### Рефакторинг существующего файла

1. Убрать `forwardRef` / `displayName` → `rootRef`
2. Заменить `styles[x]` на `data-*`
3. Вынести utils; стабилизировать контекст
4. Делегировать события; UI-состояния — в CSS
5. Оверлеи — Platform-First (§9.1)
6. Прогнать тесты / визуал; обновить CHANGELOG

### Структура папки и tree shaking

```text
ИмяКомпонента/
  ИмяКомпонента.tsx
  ИмяКомпонента.types.ts
  ИмяКомпонента.module.css   # только если есть свои стили
  ИмяКомпонента.stories.tsx
  ИмяКомпонента.utils.ts     # опционально
  index.ts
```

Генератор: `npm run scaffold -- Имя`. Корневой баррель импортирует из папки. `"sideEffects": false` в `package.json` с учётом политики CSS-инжекта сборки.

Эталон облегчения хрома — **Modal**: `DialogLayout` + `Layout` + `Header` + `ControlRow`; свой CSS — только уникальная геометрия.

---

## 14. Что не делать

| Антипаттерн | Вместо этого |
|-------------|--------------|
| `forwardRef` / `.displayName` | `rootRef` / `inputRef` / `controlRef` |
| `styles[variant]`, `active && styles.active` | `data-variant`, presence + CSS |
| `data-disabled="true"` | presence: `data-disabled={cond ? '' : undefined}` |
| `useState` на каждый пиксель жеста/скролла | DOM + CSS-переменные; коммит на pointerup / смене окна |
| `window` scroll/resize для позиции попапа | CSS Anchor + `position: fixed` |
| `usePresence` / таймер ухода | `@starting-style` / discrete transitions |
| `cloneElement` / `Children.map` для theme | CSS каскад, render-prop, `items` |
| Список тостов в `useState` провайдера | ToastStore + `useSyncExternalStore` |
| Tailwind / Radix / shadcn / Floating UI | CSS Modules + доноры + CSS Anchor |
| Новый оверлей «как PopupSwitch» | `popover="auto"` + Anchor или `<dialog>` |
| Копия unstyled / scrollbar / fadeScale | `src/styles/*` + `cn` |
| Анимация width/height/top ради UI | opacity / transform / allow-discrete |
| Обёртка всего в `Box` | нативный тег; Box только как поверхность |
| Приватный Base* при наличии публичного донора | прямой рендер донора |
| JS-пропы цвета/размера для темизации | `--altum-[component]-*` |
| `As` / `Type` / `FieldPopup` / `createIcon` | локальный `as`, IconBase |
| Floating-label в TextField | статическая подпись |
| SuggestField как независимый комбобокс | прокси Select; freestyle → AutocompleteField |
| Импорты из `src/utils/` | `src/core/utils/` |

---

*Единственный действующий манифест инженерии компонентов Altum UI. При сомнении — этот документ и код доноров.*
