# Компоненты altum

Краткий справочник публичного API. Установка и точки входа — [README](../README.md). Токены — [THEMING.md](./THEMING.md). Раскладка — [LAYOUT.md](./LAYOUT.md). Иконки — [ICONS.md](./ICONS.md).

**Link:** единственный элемент-потомок получает стили через Slot (роутерный `Link`). Смена HTML-тега у кнопок — `as` (`button` | `a`). **`Dropdown`** / **`Popover`**: якорь — `renderTrigger(props, ref)`; **`Tooltip`**: элемент-child или render-prop. Без пропа `asChild`.

Оверлеи: кнопки — в `Modal.Footer` / `Modal.FormFooter` / `Sheet.Footer`, sibling к `Body`, не внутри скролла.

---

## Действия

| Компонент | Описание |
|-----------|----------|
| **Button** | Кнопка: `variant` (`primary` / `tinted` / `secondary` / `ghost` / `link`) × `status` (`default` / `danger`), иконки, `loading`, `fullWidth`, `shortcut`. |
| **ButtonIcon** | Иконка-кнопка; `circle` / `square`; по умолчанию `variant="ghost"`. |
| **ButtonGroup** | Составная группа (`ButtonGroup` + `ButtonGroup.Item`): `mode` `button` (независимые, выбранность через `active` на Item) / `toggle` (один выбранный, слайдер) / `multi_toggle` (несколько); `itemFit` `equal` \| `content`; `width` `auto` \| `full`; `variant` / `status` / `size` / `borderless` на Root. |
| **SegmentedControl** | Обёртка над `ButtonGroup` (`mode="toggle"`, `width="full"`): `options` + `value` / `onChange`; `itemFit` `equal` \| `content`; варианты `primary` / `tinted` / `secondary` (по умолчанию) / `ghost` / `plain`. |
| **Overflow** | Лишние пункты за ⋯ в `Dropdown`. `Overflow.Item` — панель действий; прочие дети — измерение ширины. `longPress` открывает меню долгим нажатием (хост — **`ActionSheetTrigger`**). |
| **ActionList** | Список действий: `items` / `groups` (`groupId`), `filterable`, `onAction`. |
| **ActionSheetTrigger** | Хост long-press → `Overflow` на тач-экранах; опциональная кнопка ⋯ на десктопе (`showOverflowTrigger`). |

---

## Формы

| Компонент | Описание |
|-----------|----------|
| **TextField** | Однострочное поле. `keepPlaceholder` — не скрывать placeholder при фокусе пустого поля. |
| **PasswordField** | Пароль на базе TextField: показать/скрыть, опциональный индикатор сложности. |
| **SearchField** | Обёртка над `TextField` с `labelPlacement="none"` по умолчанию и иконкой поиска (`onClear` от TextField). |
| **TextareaField** | Многострочное поле на **FieldBase**; авто-рост высоты. |
| **NumberField** | Числовой ввод на базе `TextField` с кнопками +/-. |
| **MaskedField** | Поле с маской ввода (телефон, дата и т.п.) на базе `TextField`; опционально `maskAsPlaceholder`. Не переопределяйте `padding` / `font-size` на inner `input`. |
| **PinInput** | PIN / OTP (2FA, код из SMS). |
| **Rating** | Оценка звёздами. |
| **FormMessage** | Подсказка / ошибка / успех под полем; `variant` `hint` / `error` / `success`. |
| **Select** | Поле выбора: `options`, `value` / `onChange`, `label`, `filterable`; `selectionMode="multiple"` рисует chips. |
| **SuggestField** | Автодополнение на TextField; chrome от **`FieldBaseProps`** (`label`, `onClear`, `prefix`, …). |
| **Checkbox** | `size`, `labelSide`, `indeterminate`, `mode` (`default` \| `task`), `align`, `labelVisibility`, `onCheckedChange(checked)` (native `onChange` сохраняется). |
| **Switch** | `size`, `labelSide`; `onChange(checked)` и алиас `onCheckedChange`. |
| **CheckboxGroup** | Группа чекбоксов с управляемым `value: string[]`. |
| **Radio** / **RadioGroup** | Радиокнопка и группа; `labelSide`, `onCheckedChange` на `Radio`. |
| **SelectionGroup** | Без собственного chrome: составной `Root` / `List` / `Item` / `Panel` (roving focus). На нём собраны **Tabs** и **ColorSwatchGroup**. Внешний вид — через `className`. |
| **Slider** | Ползунок: `value: number` или диапазон `value: [from, to]` (два thumb). |
| **DateField** | Выбор даты: MaskedField + календарь; по умолчанию prefix — `FieldBaseIcon` + календарь; chrome от **`FieldBaseProps`**. |
| **DateRangeField** | Диапазон дат (`value`/`onChange` как `{ start?, end? }`); chrome от **`FieldBaseProps`**; `layout` `single` / `split`. |
| **TimeField** | Поле времени с маской `HH:MM` и барабанами **`WheelTimePicker`**; по умолчанию prefix — иконка часов. |
| **WheelTimePicker** | Два барабана часов и минут (`TimeValue`); выбор кликом или прокруткой применяется сразу. |
| **Calendar** | Составной: `Provider` / `Root` / `Header` / `Title` / `Nav` / `Body`. `selectionMode` `single` \| `range` на Provider. `value` — `Date` или `DateRangeValue`. |
| **DayStripCalendar** | Горизонтальная полоса дней: `daysCount`, prev/next выбирают соседний день, `value` / `onChange`, `renderDay`. |
| **ColorSwatchGroup** | Выбор цвета из набора цветных точек. |
| **UploadZone** | Зона перетаскивания файлов для загрузки. |
| **Fieldset** | Группа полей: `legend` / `description` / `hint` / `footer` / `gap`; содержимое — `children`. Варианты `default` / `card` / `plain`. |

---

## Оверлеи

| Компонент | Описание |
|-----------|----------|
| **Modal** | Составной диалог: `Header` / `Title` / `Close` / `Body` / `Footer` / **`FormFooter`**. `open` / `onOpenChange`. |
| **ConfirmDialog** | Готовый диалог на **`Modal`**: отмена + подтверждение, `confirmLabel`, `secondaryAction`, `status="danger"`, `onOpenChange`. |
| **Sheet** | Панель: `Header` / `Title` / `Close` / `Body` / `Footer`; `mode` / `direction` / `backdrop` / `showHandle`. `open` / `onOpenChange`. |
| **ImageLightbox** | Полноэкранный просмотр; `open` / `onOpenChange`. |
| **Dropdown** | Выпадающая панель. Якорь — `renderTrigger(props, ref)`; содержимое — `children`. `align` `start` \| `center` \| `end` \| `auto` (`left`/`right` — алиасы). `triggerMode` `toggle` \| `combobox`. `open` / `onOpenChange`. На мобильных — нижний Sheet. |
| **Menu** | Меню действий: клик по `trigger` (Dropdown + ActionList) или `trigger="context"` (ПКМ / Shift+F10 у курсора). |
| **Tooltip** | Подсказка при наведении / фокусе; триггер — элемент-child или render-prop; `side` (алиас `position`), `openDelay` / `closeDelay`, wrap, arrow. |
| **Popover** | Плавающий слой. Якорь — `renderTrigger`; содержимое — `children`. `trigger` click/hover/manual; `variant` panel/plain, `side` / `align` / delays, стрелка `arrow`. Подсказки — **Tooltip**. |
| **CommandPalette** | Палитра Cmd+K: `items` / `groups`, фильтр — **`ActionList`** с `filterable`. |

---

## Навигация

| Компонент | Описание |
|-----------|----------|
| **Pagination** | Постраничная навигация. Без `children` — `Controls`; опционально `totalItems` / `pageSize` / `onPageSizeChange`. Составной: `Summary`, `Controls`, `PageSize`. |
| **Sidebar** | Составной: `Root`, `Header`, `Title`, `Collapse`, `Content`, `Group`, `GroupLabel`, `Item`, `Footer`, `MobileTrigger`; `value` / `onChange`; десктопный rail + мобильный Sheet. |
| **Steps** | Мастер: горизонтальный/вертикальный, статус шага, `onStepClick`. |
| **Tabs** | Составные вкладки: `Tabs.List` / `Tabs.Trigger` / `Tabs.Panel`; `value` / `defaultValue` / `onChange` (без `defaultValue` вкладка не выбирается сама); `line` / `pill`, горизонтальные/вертикальные и бейдж на Trigger. |

---

## Отображение данных

| Компонент | Описание |
|-----------|----------|
| **Table** | Один компонент: `columns` / `data` / `rowKey`, плюс `toolbar`, `loading`, `empty` (`title` / `description` / `action`) и `footer` (пагинация). Сортировка (клиент/сервер), выбор строк, раскрытие, липкие колонки, `density`, resize и `rowActions` (`ActionListItem[]`). |
| **Timeline** | Вертикальный/горизонтальный, сворачиваемые подробности (`<details>`), `currentId`. |
| **Card** | `variant` outlined/elevated/ghost; радиус по умолчанию `lg`; `header` / `media` / `actions` (ReactNode), `children` — body; `loading`. |
| **Accordion** | `Accordion.Item` с `title` и содержимым в `children`; `flush` (по умолчанию) / `bordered`; `multiple`, отключённый пункт. |
| **Badge** | `size` sm/md, `position` overlay/standalone, `variant` включая `error`; overlay — `--altum-badge-overhang`. Числовой `label` ограничивается через `max`; `children` — якорь overlay. |
| **Avatar** / **AvatarGroup** | Размеры `xs`…`xl`, кольцо статуса, запасная иконка; группа с наложением. |
| **Chip** | Тег / фильтр: `mode` `chip` \| `tag` \| `toggle` (`as` — deprecated-алиас), `size`, `onRemove` / `onClick`. **`ChipGroup`**: `mode` `chip` \| `tag`, `layout` `wrap` \| `scrollX`. |
| **StatBadge** | Компактный блок статистики: число + подпись; `variant` `default` / `success` / `warning` / `error`; `size` `md` / `sm`. |
| **EmptyState** | Пустое состояние: иконка (`--altum-color-empty-icon`), заголовок, описание, действие; `size` для вложенных панелей. |
| **DescriptionList** | Список «ключ — значение» (`stacked` / `inline`, колонки). |
| **RelativeTime** | Относительное время («2 ч назад»). |
| **SortableList** | Перетаскивание любой модели `{id}`: `renderItem`, `variant` (`default` / `plain` для Item / SwipeToAction), `handleOnly`, перестановка с клавиатуры. |
| **CalendarBoard** | Составной: `Provider` / `Root` / `Header` / `Title` / `Nav` / `ViewSwitch` / `Body` / `Month` / `Week` / `Day` / `Year` / `TaskChip`. |
| **VirtualList** | Виртуализированный список: `items`, `height`, `estimateSize`, `scrollToIndex`, `onRangeChange`. |

---

## Типографика

| Компонент | Описание |
|-----------|----------|
| **Title** | Заголовки уровней `h1`–`h4`; цвет `--altum-color-type`. |
| **Text** | Текстовый примитив (`--altum-type-*`). Дефолт `as="span"` (inline); для блочного copy — `as="p"` / `as="div"`, иначе соседние `Text` склеятся в одну строку. |
| **Link** | Ссылка: `variant` `primary`\|`secondary`\|`muted`, `status` `danger`, `size` `xs`–`xl` (или inherit), `--altum-color-link-*`. Единственный элемент-child — Slot (роутерный Link). |
| **Kbd** / **KbdGroup** | Отображение клавиш и сочетаний клавиатуры. |

---

## Раскладка

| Компонент | Описание |
|-----------|----------|
| **Layout** | Панель: скролл на корне; `Header` / `Footer` sticky; алиасы `Inline` / `Split` / `ControlRow` / `Item`. |
| **Stack** / **Inline** / **Split** / **ControlRow** / **LayoutItem** | Flex-примитивы (вертикаль / чипы / края / ряд контролов / `grow`). |
| **Grid** / **GridItem** | CSS Grid; `GRID_BREAKPOINTS`. |
| **Container** / **Page** | Колонка с max-width (`sm`…`xl` / `full`) и оболочка страницы. |
| **Box** | Поверхность (`outlined` / `elevated` / `floating` / `tinted` / `secondary` / `muted` / `glass` / `overlay` / `ghost` / `plain`). Красит только себя; потомки остаются на глобальных токенах. |
| **Collapse** | Плавное сворачивание по высоте (CSS `grid-template-rows`). |
| **Separator** | Разделитель: `orientation` horizontal \| vertical, текст (`children`), отступы `start` / `end`. |
| **Item** | Строка: `media` / `mediaVariant`, `title`, `description`, `actions`; поверхность — `Box`. |
| **AspectRatio** | Обёртка с `aspect-ratio` (16:9 / 1:1). |
| **Media** | img/video-превью с `aspect-ratio`. |
| **ScrollArea** | Стилизованный скролл (`orientation` y/x/both); `maxHeight` / `maxWidth` без дефолта. |

---

## Медиа

| Компонент | Описание |
|-----------|----------|
| **ImageGallery** | Галерея: `images`, chrome `default` \| `none`, `showNav` / `showThumbnails` / `showCounter`. |
| **ImageCrop** | Обрезка изображения. |
| **FileList** | Список загрузок на **`Item`**: progress / retry / remove через `FileList.Item`. |
| **Attachment** | Карточка файла: `Item` + статус загрузки (`idle` / `uploading` / `error` / `done`). Действия в слоте — **`ButtonIcon`**. |

---

## Графики

| Компонент | Описание |
|-----------|----------|
| **LineChart** | SVG-линейный график без внешних chart-библиотек. |
| **BarChart** | Столбчатый SVG-график; `showHoverValue`. |
| **DonutChart** | Кольцевая диаграмма + легенда; `hoverExpand`. |

---

## Переписка / AI-лента

| Компонент | Описание |
|-----------|----------|
| **Bubble** | Пузырь сообщения: `variant` default/outgoing/incoming/system, `align`, `group`, `reactions`, `collapsible`. |
| **Marker** | Системная заметка / status / bordered row / labeled separator; `icon`, `shimmer`, `children`. |

---

## Mobile

| Компонент | Описание |
|-----------|----------|
| **SafeArea** | Отступы под notch / home-indicator (`env(safe-area-inset-*)`). |
| **PullToRefresh** | Жест «потянуть, чтобы обновить» для контейнера с прокруткой. |
| **SwipeToAction** | Сенсорная обёртка: свайп раскрывает действия (iOS). |

---

## Обратная связь

| Компонент | Описание |
|-----------|----------|
| **Spinner** | Индикатор загрузки: `spin` \| `dots` \| `pulse` \| `typing`; размеры `sm` \| `md` \| `lg`. |
| **Skeleton** | Плейсхолдер; `variant` `block` / `text` / `avatar` / `card` / `table`. |
| **Progress** / **ProgressCircle** | `size`, `variant` (auto → success при 100%), `showValueText`, indeterminate, labels; у круга `diameter` перекрывает токен размера. |
| **Alert** | `title`, `icon` (`null` скрывает), `actions`, `onClose`; `children` — текст; `variant`, `size`, `layout` block/inline. |
| **Notification** | Карточка: `title`, `description`, `actions`. Императивно: `NotificationProvider` + `notify()`. Декларативно: `Notification.Viewport`. |

---

## Инфраструктура

| Экспорт | Описание |
|---------|----------|
| **ThemeProvider** | Светлая/тёмная тема. `applyTo` и контролируемая тема — [THEMING.md](./THEMING.md). |
| **LocaleProvider** | Локаль и переводы встроенных строк (`locale="ru" \| "en"`, опциональный `messages`). |
| **useLocale** / **useT** | Хук `{ locale, messages, t }` / только `t`. |
| **ru** / **en** | Встроенные словари. |
| **useTheme** | Хук `{ theme, setTheme, toggleTheme }` внутри `ThemeProvider`. |
| **VisuallyHidden** | Контент только для скринридеров (скрыт визуально). |
| **SkipLink** | «Перейти к содержимому» (виден при фокусе). |
