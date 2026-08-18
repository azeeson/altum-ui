# Тесты altum-ui

Playwright-тесты против статического Storybook.

## Команды

```bash
# Все тесты (визуальные + поведенческие)
npm test

# Только визуальные снапшоты всех stories
npm run test:visual

# Только интерактивные сценарии
npm run test:behavior

# Обновить эталонные скриншоты после осознанных UI-изменений
npm run test:update-snapshots
```

Перед первым запуском установите браузер:

```bash
npx playwright install chromium
```

## Структура

| Путь | Назначение |
|------|------------|
| `tests/visual/all-stories.spec.ts` | Скриншот `#storybook-root` для каждой story (закрытое состояние) |
| `tests/visual/open-states.spec.ts` | Скриншот viewport с открытыми оверлеями / всплывающими панелями |
| `tests/behavior/` | Клики, клавиатура, перетаскивание, оверлеи |
| `tests/unit/` | Чистая логика без UI (контент Badge, хелперы MaskedField) |
| `tests/helpers/` | `visitStory`, загрузка `index.json` |
| `src/test-stories/` | Stories только для тестов (контролируемое состояние, modal, MaskedField, семейные базы) |

## Визуальные тесты

### Закрытые состояния (`all-stories.spec.ts`)

- Берут список stories из `dist-storybook/index.json`
- Пропускают `Examples/*` и `Test/VisualOpenStates` (тяжёлые / дублирующие)
- Снапшот `#storybook-root` — кнопки-триггеры, закрытые поля и т.д.

### Открытые состояния (`open-states.spec.ts`)

- **Статические stories** (`src/test-stories/VisualOpenStates.stories.tsx`) — Modal, ConfirmDialog, Sheet, ImageLightbox, Dropdown, Tooltip уже открыты
- **Интерактивные сценарии** — клик/hover перед скриншотом для Select, CustomSelect, DatePicker, TimePickerField и playground-оверлеев
- Скриншот **всего viewport** (`page`), т.к. оверлеи рендерятся в портал вне `#storybook-root`

Снапшоты: `all-stories.spec.ts-snapshots/` и `open-states.spec.ts-snapshots/` (Chromium / darwin). Файлы хранятся в git.

## Поведенческие тесты

Покрывают типовые сценарии:

- **Dropdown / Select / CustomSelect** — открытие, позиция, выбор
- **Checkbox / Switch / Radio** — переключение и controlled state
- **Modal / Backdrop** — блокировка кликов под оверлеем
- **SortableList** — перестановка перетаскиванием
- **Tabs / Accordion / SegmentedControl** — смена активного раздела
- **TextField / TextareaField / Fieldset / FieldLabel** — базовый ввод и разметка
- **MaskedField** — маска, caret, paste, clear; harness — `altum-ui/Test/MaskedField`
- **actions-extra** — ButtonIcon, ButtonGroup, OverflowActions, OverflowGroup, ActionSheetTrigger, Link, SkipLink, Steps
- **media-calendar** — галерея, lightbox, crop, upload, FileList, Rating, ColorSwatchGroup, Calendar, DateRangePicker, DayStrip, CalendarBoard, TimePicker
- **content-charts** — SwipeToAction, PullToRefresh, Timeline, ScrollArea, Item, Card, Bubble, Alert, FocusTrap, charts
- **content-primitives** — Avatar, Badge, Box, Container/Page, Grid, Layout (Stack/Inline/Split/ControlRow), Skeleton/Spinner, FormMessage, EmptyState, Text, Title, Separator/Spacer, VisuallyHidden, RelativeTime, Kbd, Marker, Media, AspectRatio, Attachment, DescriptionList, StatBadge, SafeArea, GrabHandle
- **hooks** — `useForm` (валидация) и константа `MOBILE_MEDIA_QUERY`
- **fields-extra** — PasswordField, SearchField, NumberField, PinInput, Slider, DatePicker, TimePickerField, SuggestField, Switch, SelectionGroup
- **base** — семейные базы из `src/base/` через стенд `altum-ui/Test/Base` (FieldBase Clear, ButtonBase, ToggleControlBase, DialogBase, ChartBase, MediaRowBase, ListOptionBase)

`visitStory` падает, если iframe показывает оверлей ошибки Storybook или `pageerror`. Визуальные снапшоты всех stories (`all-stories`) поэтому тоже проверяют, что компонент монтируется. Семейные базы `{Family}Base` живут в `src/base/` без каталожных stories: поведение — `tests/behavior/base.spec.ts`, визуально — `Test/Base` и публичные обёртки.

## Unit-тесты

Чистая логика без UI — `tests/unit/` (listbox, шорткаты, якорь, Badge, MaskedField, calendar).

```bash
npx playwright test tests/unit
```