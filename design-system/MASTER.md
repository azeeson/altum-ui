# Дизайн-система altum — MASTER

Правила работы над компонентами в репозитории.

Справочник токенов: [`docs/THEMING.md`](../docs/THEMING.md). Значения: `src/components/ThemeProvider/ThemeProvider.module.css`.

---

## Стек и ограничения

| Правило | Значение |
|---------|----------|
| Фреймворк | React 18+, TypeScript strict |
| Стили | **Только CSS Modules** — без Tailwind, shadcn и styled-components |
| Цвета в `.module.css` | **Только** `var(--altum-token)` — никогда не хардкодить `#hex`, `rgb()`, `hsl()` |
| Определение цветов | **Только** в `ThemeProvider.module.css` (light + `.dark`) |
| Иконки | Набор проекта в `src/icons/` — не использовать эмодзи как иконки |
| Проверка | `npm run storybook` после визуальных правок или правок токенов |

---

## Направление бренда

- **Эстетика:** палитра Slate/Nord, Apple Notes / Linear — спокойно, премиально, минималистично
- **Темы:** светлая + тёмная через `ThemeProvider` (`.light` / `.dark`; по умолчанию `applyTo="wrapper"`, для порталов — `applyTo="document"`)
- **Доступность:** WCAG **AA минимум** (4.5:1 обычный текст, 3:1 крупный текст / UI-компоненты)
- **Движение:** `var(--altum-transition-smooth)` на интерактиве; уважать `prefers-reduced-motion`

---

## Контракт состояний компонента

Каждый интерактивный компонент **обязан** реализовать:

| Состояние | CSS-паттерн | Заметки |
|-----------|-------------|---------|
| По умолчанию | Базовые цвета токенов | — |
| Hover | `:hover:not(:disabled)` | Сдвиг фона через токен, не случайный filter |
| Active | `:active:not(:disabled)` | Более глубокий токен (`*-active`) |
| Focus | `:focus-visible` | Видимое кольцо — **никогда** не снимать outline без замены |
| Disabled | `:disabled` или `[disabled]` | `opacity: var(--altum-opacity-disabled)`, `cursor: not-allowed`, без hover/active |

### Семейства колец фокуса

Tab должен ощущаться одним языком. Токены: [`docs/THEMING.md`](../docs/THEMING.md).

1. **Контролы / навигация / тогглы / выбор** — outline `--altum-focus-ring-*` (light: цвет → `--altum-color-input-border-focus`; dark: светлая hairline `rgba(248,250,252,0.55)`).
2. **Поля** — кольцо 1px на `:focus-within` / `.focused` / `.isOpen`. Невалидное + в фокусе остаётся `--altum-color-status-error`.
3. **Кнопки (`ButtonBase`)** — двойной box-shadow (`--altum-color-button-focus-inner` / `--altum-color-button-focus-outer`). Danger: `--altum-color-danger-bg-solid`, не primary.

Опции списка: outline **плюс** фон при наведении — никогда один только `outline: none`.

### Disabled

Поля могут использовать `--altum-field-disabled-opacity` (по умолчанию `0.8`), чтобы текст оставался читаемым. Hover/active обязаны идти через `:not(:disabled)`.

### Высоты контролов

Публичный `size` (`ControlSize`) — **`sm` \| `md` \| `lg`**. `--altum-control-height-xs` — инфраструктура раскладки (ручки Sortable), не `size="xs"` у Button / Chip / FieldBase / PinInput / SegmentedControl.

Chrome однострочного поля — `--altum-field-size-height` / `--altum-control-height-*` при любом `labelPlacement`. `TextareaField` стартует с той же высоты, когда пуст / `minRows={1}`, затем растёт.

Стеки форм: `labelPlacement="outside"` (включая SearchField и date/time). Поиск в тулбаре: `labelPlacement="none"`. Не смешивайте плавающие лейблы с Button в одном flex-ряду без согласованных высот.

### Helper поля / диалог / движение

- Helper/ошибка: FieldBase `helperText` / `error` и `--altum-form-helper-*` / `--altum-field-message-gap` — не одноразовый `.hint`.
- Modal / ConfirmDialog / Sheet делят `--altum-dialog-*` и `--altum-shadow-md`.
- Предпочитайте `--altum-transition-smooth`. Слои оверлея используют `--altum-motion-overlay`; слайдер Segmented может пружинить. Всегда `prefers-reduced-motion: reduce`.

---

## Чеклист доступности

- [ ] `:focus-visible` на всех фокусируемых кастомных контролах
- [ ] Modal / Sheet: `role="dialog"`, `aria-modal="true"`, подписанный заголовок
- [ ] Кнопки только с иконкой: `aria-label`
- [ ] Кнопки загрузки: `aria-busy="true"`, спиннер `aria-hidden`
- [ ] Dropdown: `aria-haspopup`, `aria-expanded`, `aria-controls`
- [ ] Select / listbox: `role="listbox"`, `aria-selected` на опциях
- [ ] Escape закрывает оверлеи; фокус возвращается на триггер
- [ ] `prefers-reduced-motion: reduce` отключает несущественные анимации
- [ ] Контраст текста ≥ 4.5:1 (обычный), ≥ 3:1 (крупный ≥ 18px или 14px bold)

---

## Анти-паттерны (не делать)

- Классы Tailwind, импорты shadcn, инлайн `style={{ color: '#...' }}`
- Выдуманные токены, которых **нет** (`--altum-color-accent`) — используйте реальные токены altum (`--altum-g-space-4`, `--altum-shadow-sm`, `--altum-g-line-height-relaxed` **существуют**)
- Хардкод hex в `.module.css` компонента
- `outline: none` без замены через `:focus-visible`
- `:focus` вместо `:focus-visible` на кнопках (кольцо появляется по клику мыши)
- Понижение z-index выпадашки ниже модалки
- Хардкод opacity disabled (0.7 / 0.72) — используйте `--altum-opacity-disabled` или `--altum-field-disabled-opacity`
- Эмодзи как UI-иконки

---

## Чеклист перед сдачей (компоненты)

1. Прочитать этот файл + `docs/THEMING.md`
2. CSS Module использует только цвета `var(--*)`
3. Реализованы hover / active / focus-visible / disabled
4. Storybook-story покрывает варианты + disabled + focus (клавиатурный Tab)
5. Тёмная тема проверена переключателем темы в Storybook
6. Нет нового хардкода hex вне ThemeProvider
