# Темизация altum

altum использует **CSS custom properties** для всех дизайн-токенов. Компоненты ссылаются на переменные вроде `var(--altum-color-brand)` и `var(--altum-color-field-border)` — цвета темы никогда не хардкодятся.

## Быстрый старт

Оберните приложение в `ThemeProvider` (установка — [README](../README.md)). Стили инжектятся из JS — отдельный `styles.css` не нужен. По умолчанию `applyTo="wrapper"`. Для порталов (`Modal`, `Sheet`, выпадающие панели, `Notification`) используйте **`applyTo="document"`**, чтобы классы и `data-theme` попали на `html` / `body`. Синхронизация идёт в **`useLayoutEffect`**, чтобы первый кадр совпадал с `initialTheme` / контролируемой `theme`.

### Контролируемая тема и хранилище

```tsx
const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? 'light');

return (
  <ThemeProvider theme={theme} onThemeChange={setTheme}>
    <App />
  </ThemeProvider>
);
```

Неконтролируемый `initialTheme` — снимок на момент монтирования; если хранилище читается асинхронно, передайте контролируемую `theme` или перемонтируйте с `key={storedTheme}`. Чтобы не было FOUC до гидрации React, задайте `document.documentElement.dataset.theme` (и опциональный класс) небольшим блокирующим inline-скриптом, который читает хранилище.

## Переопределение токенов

Переопределяйте переменные на обёртке или `:root` после монтирования `ThemeProvider`. Если в приложении уже есть свои токены — смапьте на них. Переопределяйте только те переменные, которые реально используют ваши компоненты.

```css
.my-app {
  --altum-color-brand: var(--brand-primary, #2563eb);
  --altum-color-control-text-color: var(--text-secondary, #1e293b);
  --altum-color-input-border-focus: var(--brand-primary, #2563eb);
  --altum-color-bg: var(--surface-page, #ffffff);
  --altum-color-text: #0f172a;
}
```

```tsx
<ThemeProvider>
  <div className="my-app">
    <YourApp />
  </div>
</ThemeProvider>
```

## Справочник токенов

Три слоя, все с префиксом `--altum-`. HEX живёт только в `ThemeProvider`. В приложении переопределяйте семантические токены (`--altum-color-*`); примитивы (`--altum-g-*`) — это шкала.

| Слой | Пример | Роль |
|------|--------|------|
| Примитив `--altum-g-*` | `--altum-g-space-4`, `--altum-g-color-slate-600` | Сырая шкала (отступы, типографика, радиус, z-index, цвет) |
| Семантика `--altum-*` | `--altum-color-brand`, `--altum-color-field-border` | Чем рисуют компоненты |
| Компонент `--altum-[компонент]-*` | `--altum-segmented-height` | Локальный chrome; не примитив ThemeProvider |

Не заводите параллельный `--color-accent`. Старые имена без префикса (`--space-*`, `--prm-*`, `--field-*`) сняты — совместимых алиасов нет (см. CHANGELOG).

### Раскладка

| Переменная | Назначение |
|------------|------------|
| `--altum-g-radius` | Радиус по умолчанию (8px) |
| `--altum-g-radius-sm` | Малый радиус (4px) |
| `--altum-g-radius-md` | Алиас `--altum-g-radius` |
| `--altum-g-radius-lg` | Большой радиус (12px) |
| `--altum-g-radius-pill` | Радиус «пилюли» / тега (9999px) |
| `--altum-transition-smooth` | Стандартный переход (`all 0.2s` spring) |
| `--altum-motion-overlay` | Длительность появления/скрытия оверлея (0.2s) |
| `--altum-control-height-xs` / `sm` / `md` / `lg` | 28 / 32 / 44 / 52 — лестница высот; публичный `size` контролов — **`sm` \| `md` \| `lg`** (токен `xs` только для раскладки / легаси) |
| `--altum-control-inset` | 2px — внутренний отступ трека SegmentedControl |
| `--altum-control-icon-size-sm` / `md` / `lg` | 14 / 18 / 22 — аффиксы полей + иконки ButtonGroup |
| `--altum-field-pad-top-*` / `--altum-field-pad-bottom-*` | Оптические отступы плавающего лейбла (sm…lg) |
| `--altum-badge-size-sm` / `md` / `--altum-badge-font-size` / `--altum-badge-font-size-sm` | Компактный chrome счётчика (Badge / Tabs); sm-кегль для числового standalone |
| `--altum-g-space-1` … `--altum-g-space-9` | Шкала отступов (4px … 36px) |
| `--altum-shadow-sm` / `--altum-shadow-md` / `--altum-shadow-lg` | Лестница теней (алиасы `--altum-shadow-surface` / `--altum-shadow-dropdown` / deep) |

### Типографика

| Переменная | По умолчанию | Назначение |
|------------|--------------|------------|
| `--altum-g-font-family-ui` | system-ui, … | UI sans-стек |
| `--altum-g-font-family-mono` | ui-monospace, … | Моноширинный стек |
| `--altum-g-font-size-3xs` | 10px | Крошечные лейблы, компактные чипы, бейджи |
| `--altum-g-font-size-2xs` / `--altum-g-line-height-2xs` | 12px / 1.35 | Компактный UI (чипы md, кнопка sm) |
| `--altum-g-font-size-xs` / `--altum-g-line-height-xs` | 11px / 1.35 | Сверхмелкий / подпись (`Text` xs); **меньше, чем 2xs** |
| `--altum-g-font-size-sm` / `--altum-g-line-height-sm` | 13px / 1.35 | Мелкий текст |
| `--altum-g-font-size-base` / `--altum-g-line-height-base` | 14px / 1.45 | Основной текст |
| `--altum-g-font-size-lg` / `--altum-g-line-height-lg` | 16px / 1.4 | Крупный текст / заголовок диалога |
| `--altum-g-font-size-xl` / `--altum-g-line-height-xl` | 18px / 1.35 | Акцент |
| `--altum-g-font-size-2xl` | 20px | Display (`Title` h3) |
| `--altum-g-font-size-3xl` | 24px | Display (`Title` h2) |
| `--altum-g-font-size-4xl` | 32px | Display (`Title` h1) |
| `--altum-g-font-weight-normal` … `--altum-g-font-weight-bold` | 400–700 | Начертания |
| `--altum-g-line-height-snug` / `--altum-g-line-height-relaxed` | → xs / base | Алиасы |

В компонентах: `font-size: var(--altum-g-font-size-sm); line-height: var(--altum-g-line-height-sm);`.

### Диалог / список / опция

| Переменная | По умолчанию | Назначение |
|------------|--------------|------------|
| `--altum-dialog-header-padding` | асимметричный `--altum-g-space-4` / `--altum-g-space-3` | Шапка Modal / Sheet |
| `--altum-dialog-body-padding` | `--altum-g-space-4` | Тело Modal / Sheet |
| `--altum-dialog-footer-padding` | асимметричный футер | Футер Modal / Sheet |
| `--altum-dialog-title-size` | `--altum-g-font-size-lg` | Заголовок диалога |
| `--altum-dialog-title-weight` | `--altum-g-font-weight-semibold` | Начертание заголовка |
| `--altum-dialog-body-size` | `--altum-g-font-size-base` | Текст тела диалога |
| `--altum-dialog-max-width-sm` / `md` / `lg` | 420 / 500 / 600 | Modal / Sheet |
| `--altum-dialog-max-height` | 85vh | Максимальная высота Modal |
| `--altum-list-max-height` | 280px | Область скролла выпадающего списка |
| `--altum-option-padding-y` / `--altum-option-padding-x` | `--altum-g-space-2` / `--altum-g-space-3` | Внутренние отступы опции списка |

### Тоггл / фокус / chrome оверлея

| Переменная | По умолчанию | Назначение |
|------------|--------------|------------|
| `--altum-toggle-box-size-sm` | 16px | Бокс Checkbox / Radio (sm) |
| `--altum-toggle-box-size` | 20px | Бокс Checkbox / Radio (md) |
| `--altum-toggle-box-size-lg` | 24px | Бокс Checkbox / Radio (lg) |
| `--altum-toggle-label-gap` | `--altum-g-space-3` | Зазор между боксом и лейблом (Checkbox / Radio / Switch) |
| `--altum-toggle-stack-gap` | `--altum-g-space-3` | Вертикальный зазор в стеке контролов |
| `--altum-toggle-check-width/height/stroke*` | sm/md/lg | Геометрия галочки Checkbox |
| `--altum-toggle-dash-width/height*` | sm/md/lg | Тире indeterminate Checkbox |
| `--altum-toggle-task-check-height` | 7px | Высота галочки в режиме task |
| `--altum-toggle-radio-dot*` | sm/md/lg | Размер внутренней точки Radio |
| `--altum-toggle-align-nudge` | `0.15em` | Оптическое выравнивание бокса тоггла относительно лейбла |
| `--altum-rating-size-sm` / `md` / `lg` | 16 / 22 / 28 | Размер SVG-звезды Rating |
| `--altum-command-palette-max-width` / `height` | 560 / 520 | Ограничение панели CommandPalette |
| `--altum-button-group-item-min-sm` / `md` / `lg` | space-6 / 7 / 8 | Мин. ширина ButtonGroup.Item |
| `--altum-focus-ring-width` | 2px | Толщина outline-фокуса (навигация / тогглы / выбор) |
| `--altum-focus-ring-offset` | 1px | Смещение outline-фокуса (согласовано с кольцом кнопки) |
| `--altum-focus-ring-color` | → `--altum-color-input-border-focus` | Общий цвет outline-фокуса |
| `--altum-button-focus-inner` / `--altum-button-focus-outer` | 1px / 3px | Ширины двойного кольца кнопки (алиасы `--altum-color-button-focus-*`) |
| `--altum-opacity-disabled` | 0.5 | Отключённые контролы |
| `--altum-field-disabled-opacity` | 0.8 | Chrome отключённого поля (текст остаётся читаемым) |
| `--altum-field-label-gap` / `--altum-field-message-gap` | `--altum-g-space-1` | Зазор внешнего лейбла / helper+ошибка |
| `--altum-form-helper-indent` | `--altum-g-space-1` | Левый отступ helper / ошибки |
| `--altum-field-placeholder` / `--altum-color-input-placeholder` | `color-mix(… label 88%, transparent)` | Текст плейсхолдера |
| `--altum-switch-track-width/height/thumb-size-*` | sm/md/lg | Геометрия Switch (из toggle-box + inset) |
| `--altum-switch-track-off` | смесь ink на ctrl-bg | Заливка трека выключенного Switch |
| `--altum-overlay-close-size` | 28px | Хит-зона закрытия Overlay / Alert / Notification |
| `--altum-overlay-close-fg` / `--altum-overlay-close-bg` / `--altum-overlay-close-bg-hover` | тема | `ButtonIcon` `diskClose` idle/hover (Modal / Sheet) |
| `--altum-overlay-arrow-size` | 8px | Стрелка Popover / tooltip |
| `--altum-badge-overhang` | `space-1` + `control-inset` (6px) | Запас раскладки + смещение overlay-бейджа |

### Статусы (`--altum-color-status-*`)

Семантические цвета для уведомлений, текстовых вариантов, ошибок формы, бейджей.

| Переменная | Назначение |
|------------|------------|
| `--altum-color-status-info` | Информационный |
| `--altum-color-status-success` / `--altum-color-status-success-strong` | Успех |
| `--altum-color-status-warning` / `--altum-color-status-warning-strong` | Предупреждение |
| `--altum-color-status-error` | Ошибки, деструктивный бейдж |

### Оверлеи (`--altum-overlay-*`)

| Переменная | Назначение |
|------------|------------|
| `--altum-overlay-scrim` | Затемнение Modal / Sheet (`Backdrop` по умолчанию) |
| `--altum-overlay-scrim-strong` | Затемнение ImageLightbox (`Backdrop variant="strong"`) |
| `--altum-overlay-on-scrim` | Текст/иконки на тёмном scrim |
| `--altum-overlay-control-bg` / `--altum-overlay-control-border` | Контролы на scrim |

### Слои z-index (`--altum-g-z-*`)

Глобальный порядок стека для портальных оверлеев. Переопределяйте на `:root` или `.themeProvider`, если приложению нужны другие значения.

| Переменная | По умолчанию | Кто использует |
|------------|--------------|----------------|
| `--altum-g-z-below` | `-1` | Линия-коннектор Steps |
| `--altum-g-z-raised` | `1` | Слайдер SegmentedControl |
| `--altum-g-z-raised-above` | `2` | Контент кнопки, контролы NumberField |
| `--altum-g-z-control` | `5` | Бегунок Slider |
| `--altum-g-z-local` | `10` | Badge, липкий заголовок таблицы, маска TextField |
| `--altum-g-z-upload` | `50` | Drag-оверлей UploadZone |
| `--altum-g-z-overlay` | `1000` | **Sheet** (по умолчанию), портальные панели между chrome и Modal |
| `--altum-g-z-modal` | `1100` | Modal |
| `--altum-g-z-tooltip` | `1150` | Tooltip (выше модалки, чтобы подсказки работали в диалогах) |
| `--altum-g-z-dropdown` | `1200` | Dropdown (выше Modal) |
| `--altum-g-z-lightbox` | `1250` | ImageLightbox |
| `--altum-g-z-notification` | `1300` | Тосты Notification; Sheet с `zIndexTier="notification"` |

`Overlay` использует **`purpose`** вместо сырых `zIndex` / `sideOffset`:

| purpose | z-index | sideOffset |
|---------|---------|------------|
| `tooltip` | `--altum-g-z-tooltip` | `--altum-overlay-offset-tooltip` (8px) |
| `popover` | `--altum-g-z-dropdown` | `--altum-overlay-offset-popover` (8px) |
| `dropdown` | `--altum-g-z-dropdown` | `--altum-overlay-offset-dropdown` (4px) |
| `modal` | `--altum-g-z-modal` | — |
| `sheet` | `--altum-g-z-overlay` | — |
| `lightbox` | `--altum-g-z-lightbox` | — |
| `notification` | `--altum-g-z-notification` | — |

Переопределение `Sheet`: `zIndexTier` (`overlay` \| `modal` \| `dropdown` \| `lightbox` \| `notification`) или сырой `zIndex`. Меню, открытые внутри приподнятого Sheet, стекаются выше него (`max(--altum-g-z-dropdown, parent + 1)`).

### Акцент (`--altum-color-brand-*`)

Основная кнопка (Prominent), активная навигация, прогресс-бары, кольца фокуса.

| Переменная | Light по умолчанию |
|------------|--------------------|
| `--altum-color-brand` | `#475569` |
| `--altum-color-brand-hover` | `#334155` |
| `--altum-color-brand-active` | `#1e293b` |
| `--altum-color-brand-text` | `#ffffff` |
| `--altum-color-brand-disabled` / `--altum-color-brand-text-disabled` | Заливка/лейбл отключённой primary (не смывка opacity) |

### Тонированный (`--altum-color-brand-tint-*`)

Приглушённый акцентный вариант (Apple-style Tinted / Light): заливка ~12% от акцента, текст остаётся ярким и контрастным. Используется в `Button` / `Chip` / `SegmentedControl` с `variant="tinted"`.

| Переменная | Назначение |
|------------|------------|
| `--altum-color-brand-tint` | Фон заливки (~12% accent) |
| `--altum-color-brand-tint-hover` | Hover |
| `--altum-color-brand-tint-active` | Active / pressed |
| `--altum-color-brand-tint-text` | Контрастный акцентный текст |
| `--altum-color-brand-tint-border` | Рамка |
| `--altum-color-button-border-tinted` | Рамка кнопки |

Светлая заливка деструктивной кнопки использует `--altum-color-danger-bg-solid: #dc2626` (WCAG AA с белым текстом).

### Вторичный (`--altum-color-surface`, `--altum-color-border`)

Карточки, вторичные кнопки, рамки.

| Переменная | Назначение |
|------------|------------|
| `--altum-color-surface` | Фон поверхности |
| `--altum-color-border` | Рамки |
| `--altum-color-text-secondary` | Приглушённый текст |

### Опасность / деструктив (`--altum-color-danger-*`)

Действия удаления, состояния ошибки. API кнопки: `status="danger"` вместе с `variant` (`primary` — заливка, `secondary` — контур по поверхности, `tinted` — мягкая смывка).

| Переменная | Назначение |
|------------|------------|
| `--altum-color-danger-bg-solid` | Залитая деструктивная кнопка |
| `--altum-color-danger-text-secondary` | Текст контурной деструктивной (`variant="secondary"`) |
| `--altum-color-danger-tint-bg` / `--altum-color-danger-tint-text` | Мягкий tint опасности (`variant="tinted"`) |

### Контролы формы (`--altum-color-input-*`, `--altum-color-control-*`)

TextField, Checkbox (`mode="task"`), Switch, Radio. Примитивы — исходные значения для слоя элементов ниже.

| Переменная | Назначение |
|------------|------------|
| `--altum-color-input-bg` | Фон поля |
| `--altum-color-input-text` | Текст поля |
| `--altum-color-input-border` | Рамка по умолчанию |
| `--altum-color-input-border-focus` | Рамка в фокусе |
| `--altum-color-muted` | Плавающий лейбл (light: `#64748b`, dark: `#94a3b8`) |
| `--altum-color-control-bg` | Фон checkbox/radio |
| `--altum-color-control-bg-checked` | Состояние checked |
| `--altum-color-control-text-color` | Текст лейбла контрола |

### Chrome элементов (`--altum-field-*`, `--altum-color-button-*`, `--altum-color-chip-*`, `--altum-color-segmented-*`, `--altum-color-panel-*`, `--altum-type-*`, `--altum-color-link-*`)

Компоненты читают токены **элементов**. Значения по умолчанию — алиасы примитивов выше (визуально без изменений). Адаптивные варианты `Box` (`outlined` / `elevated` / `tinted` / `secondary` / `muted` / `glass` / `overlay`) переопределяют их для потомков через CSS-каскад, а не через React-контекст.

| Группа | Примеры |
|--------|---------|
| Поле | `--altum-color-field-bg`, `--altum-color-field-border`, `--altum-color-border-hover`, `--altum-color-field-text`, `--altum-field-label` |
| Кнопка (secondary / tinted / ghost) | `--altum-color-button-secondary-bg`, `--altum-color-button-tinted-border`, `--altum-color-button-ghost-hover-bg` |
| Chip | `--altum-color-chip-secondary-bg`, `--altum-color-chip-tinted-text` |
| Segmented | `--altum-color-segmented-*` (алиасы на `--altum-color-button-*`); primary active: `--altum-color-segmented-primary-slider-bg` (в dark контрастнее трека) |
| Панель | `--altum-color-panel-bg`, `--altum-color-panel-border`, `--altum-color-panel-bg-hover` |
| Типографика | `--altum-color-type`, `--altum-color-type-secondary`, `--altum-color-type-muted` (`Title` / `Text`) |
| Ссылка | `--altum-color-link-color`, `--altum-color-link-secondary`, `--altum-color-link-muted`, `--altum-color-link-danger`, `--altum-color-link-focus-ring` |

Primary- и danger-кнопки остаются на `--altum-color-brand-*` / `--altum-color-danger-*` (Box их не перемапливает). Ремап типографики/ссылок сильнее всего на `tinted` и `overlay`.

### Поверхности

| Переменная | Назначение |
|------------|------------|
| `--altum-color-bg` | Фон страницы |
| `--altum-color-text` | Текст страницы |
| `--altum-color-dropdown-bg` | Modal, выпадающие панели |
| `--altum-color-option-hover` | Фоны при наведении |
| `--altum-color-selection-fill` / `--altum-color-selection-fill-fg` / `--altum-color-selection-fill-emphasis` | Акцентный выбранный chrome (Segmented primary, Chip primary/tinted active) |
| `--altum-color-selection-neutral-fill` / `--altum-color-selection-neutral-border` / `--altum-color-selection-neutral-slider` | Мягкий выбранный chrome (Segmented secondary, Chip secondary active) |
| `--altum-color-empty-icon` | Чернила иллюстрации EmptyState (`--altum-color-text-secondary`) |

## Тёмная тема

`ThemeProvider` поставляется с классом `.dark`, который перемапливает все токены. Переключение через хук:

```tsx
import { useTheme } from 'altum';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme === 'light' ? 'Тёмная' : 'Светлая'}</button>;
}
```

Системное предпочтение:

```tsx
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
<ThemeProvider initialTheme={prefersDark ? 'dark' : 'light'} />
```

Тёмная заливка primary (`--altum-color-brand: #6b7f98`) даёт явную affordance относительно modal/sheet (`--altum-color-dropdown-bg: #1e1e24`) и отключённого состояния (`--altum-color-brand-disabled`). Лейбл на заливке остаётся AA (`--altum-color-brand-text: #f8fafc`). Приглушённые / лейбловые чернила в dark (`--altum-color-muted` / `--altum-color-text-secondary`: `#a3b0c2`) и плейсхолдеры (mix 88%) подобраны для читаемых подписей на `--altum-color-bg`. Рамки Checkbox / Radio идут через `--altum-color-control-border` → `--altum-color-input-border`, чтобы тогглы совпадали с chrome полей.
