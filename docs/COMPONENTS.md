# Компоненты altum

Краткий справочник публичного API. Установка и точки входа — [README](../README.md). Токены — [THEMING.md](./THEMING.md). Раскладка — [LAYOUT.md](./LAYOUT.md). Иконки — [ICONS.md](./ICONS.md).

**Button / Link `asChild`:** единственный потомок получает стили и обработчики через Slot.

Оверлеи: кнопки — в `Modal.Footer` / `Modal.FormFooter` / `Sheet.Footer`, sibling к `Body`, не внутри скролла.

---

## Действия

| Компонент | Описание |
|-----------|----------|
| **ButtonBase** | Примитив кнопки: `variant` (`primary` / `tinted` / `secondary` / `ghost` / `link`) × `status` (`default` / `danger`), `size`, опциональный `active`. |
| **Button** | Кнопка на **ButtonBase**: иконки, `loading`, `fullWidth`, `shortcut`. |
| **ButtonIcon** | Иконка-кнопка на **ButtonBase**; `circle` / `square`; по умолчанию `variant="ghost"`. |
| **ButtonGroup** | Составная группа (`ButtonGroup` + `ButtonGroup.Item`): высота = `--altum-control-height-*`; `width` `auto` \| `full` (full — колонка формы); `variant` / `status` / `size` / `borderless` на Root; переключение через `active` на Item; циклический клавиатурный фокус. |
| **SegmentedControl** | Переключатель сегментов (на **SelectionGroup**): `itemFit` `equal` \| `content`; варианты `primary` / `tinted` / `secondary` / `ghost` / `plain`. |
| **SelectionGroup** | Составной (`Root` / `List` / `Item` / `Panel`): взаимоисключающий выбор + циклический клавиатурный фокус; `value` / `onChange`. База для SegmentedControl и Tabs. |
| **OverflowActions** | Составной: видимые действия + лишние в `Dropdown` (⋯). `visibleCount`, `display` (`icon` \| `icon-label`), `showOverflowTrigger`, `Item`. |
| **ActionList** | Клавиатурный список действий на **Listbox** + **SearchField**: группы, сочетание клавиш, `onAction`. |
| **OverflowGroup** | Лишние потомки по ширине уходят за ⋯ в `Dropdown`. `fit` `content` \| `container`, `gap`, `size`, `maxVisible`. |
| **ActionSheetTrigger** | Долгое нажатие → OverflowActions; `showOverflowTrigger` (по умолчанию `false`) — на touch+mobile ⋯ скрыт; пульс при срабатывании. |

---

## Формы

| Компонент | Описание |
|-----------|----------|
| **FieldBase** | Составная оболочка полей: `Root` / `Label` / `Prefix` / `Control` / `Postfix` / `Button` / `Icon` / `Clear` / `Helper` / `Error`. `Clear` рендерится внутри `Postfix`. |
| **TextField** | Однострочное поле на **FieldBase**. |
| **PasswordField** | Пароль на базе TextField: показать/скрыть, опциональный индикатор сложности. |
| **SearchField** | Обёртка над `TextField` с `labelPlacement="none"` по умолчанию и иконкой поиска (`onClear` от TextField). |
| **TextareaField** | Многострочное поле на **FieldBase**; авто-рост высоты. |
| **NumberField** | Числовой ввод на базе `TextField` с кнопками +/-. |
| **MaskedField** | Поле с маской ввода (телефон, дата и т.п.) на базе `TextField`; опционально `maskAsPlaceholder`. Не переопределяйте `padding` / `font-size` на inner `input`. |
| **PinInput** | PIN / OTP (2FA, код из SMS). |
| **Rating** | Оценка звёздами. |
| **FormMessage** / **FieldError** | Подсказка / ошибка / успех под полем; `variant`; `FieldError` = `variant="error"`. |
| **Listbox** | Список опций с клавиатурой и группами; база для Select / CustomSelect / SuggestField / ActionList. |
| **CustomSelect** | Составной примитив select/combobox (`Root` / `Filter` / `List` / `Shell`): Dropdown + Listbox; `groups` + `groupId`; `selectionMode`: `single` \| `multiple` \| `path`; `value` / `onChange`. |
| **Select** | Составной select на CustomSelect: `Root` / `Trigger` / `Panel` / `Filter` / `List`; `value` / `onChange`; множественный выбор — `Chips` / `Chip`. |
| **SuggestField** | Автодополнение на TextField; chrome от **`FieldBaseProps`** (`label`, `onClear`, `prefix`, …). |
| **Checkbox** | `size`, `labelSide`, `indeterminate`, `mode` (`default` \| `task`), `align` (`start` \| `center`; для task по умолчанию `start`), `labelVisibility` (`visible` \| `hidden` + обязательный `aria-label` / `aria-labelledby`). |
| **Switch** | `size`, `labelSide`. |
| **CheckboxGroup** | Группа чекбоксов с управляемым `value: string[]`. |
| **Radio** / **RadioGroup** | Радиокнопка и группа взаимоисключающих опций. |
| **Slider** | Ползунок: `value: number` или диапазон `value: [from, to]` (два thumb). |
| **DatePicker** | Выбор даты: MaskedField + календарь; по умолчанию prefix — `FieldBase.Icon` + календарь; chrome от **`FieldBaseProps`**. |
| **DateRangePicker** | Диапазон дат (`value`/`onChange` как `{ start?, end? }` / `DateRangeValue`); `layout` `single` / `split`. |
| **TimePicker** / **TimePickerField** | Панель времени + поле с маской `HH:MM`; по умолчанию prefix — `FieldBase.Icon` + часы. |
| **Calendar** | Составной: `Provider` / `Root` / `Header` / `Title` / `Nav` / `Body`. `selectionMode` `single` \| `range` на Provider. Контекст: `view` / `setView` (`CalendarViewMode`). |
| **DayStripCalendar** | Горизонтальная полоса дней (недельный chrome): `daysCount`, предыдущий/следующий, `value` / `onChange`, `renderDay`. |
| **ColorSwatchGroup** | Выбор цвета из набора цветных точек. |
| **UploadZone** | Зона перетаскивания файлов для загрузки. |
| **Fieldset** | Составной: `Inner` / `Legend` / `Description` / `Hint` / `Content` / `Footer`; варианты `default` / `card` / `plain`. |
| **FieldLabel** | Лейбл + контент: `layout` vertical / horizontal; `align` start / center / baseline; `justify` start / between. |

---

## Оверлеи

| Компонент | Описание |
|-----------|----------|
| **Overlay** | Примитив позиционирования без chrome: `variant` `modal` / `floating` / `sheet` / `popover` / `dropdown`. Видимость: `open` / `onOpenChange` / `onClose`. Портал + появление/скрытие; z-index / offset — `purpose` (см. [THEMING.md](./THEMING.md)). |
| **Backdrop** | Затемнение под оверлеем: `variant` `default` / `strong`, `blur`, клик закрывает слой. |
| **Modal** | Составной на **`Overlay`** (`variant="modal"`): `Header` / `Title` / `Close` / `Body` / `Footer` / **`FormFooter`**. |
| **ConfirmDialog** | Готовый диалог на **`Modal`**: отмена + подтверждение, `confirmLabel`, `secondaryAction`, `status="danger"`, `onClose`. |
| **Sheet** | Панель на **`Overlay`** (`variant="sheet"`): `Header` / `Title` / `Close` / `Body` / `Footer`; `mode` / `direction` / `backdrop` / `showHandle`. |
| **ImageLightbox** | Полноэкранный просмотр на **`Overlay`** (`variant="modal"`, `purpose="lightbox"`, сильный Backdrop); внутри `ImageGallery`. |
| **Dropdown** | Выпадающая панель на **`Overlay`** (`variant="dropdown"`). Составной: `Dropdown` + `Dropdown.Trigger` + `Dropdown.Content`. Trigger без лишней DOM-обёртки (`asChild` / render-prop). На мобильных — нижний Sheet. |
| **DropdownMenu** | Готовое меню по клику: Dropdown (`menu`) + ActionList. |
| **ContextMenu** | Контекстное меню по правому клику (ActionList у курсора). |
| **Tooltip** | Подсказка на **`Overlay`** (`variant="popover"`, `triggerMode="hover"`); триггер через `renderChildren` (`asChild` / render-prop); `openDelay` / `closeDelay`, wrap, arrow. Мьютекс наведения: не больше одной подсказки одновременно при быстром переходе между триггерами. |
| **Popover** | Плавающий слой на **`Overlay`** (`variant="popover"`). Составной: `Trigger` (`asChild` / render-prop) + `Content` (`panel`/`tooltip`/`plain`, `arrow`); `trigger` click/hover/manual. |
| **CommandPalette** | Палитра Cmd+K: явный `ActionList` в `List` (без автосбора команд). |

---

## Навигация

| Компонент | Описание |
|-----------|----------|
| **Pagination** | Составной: `Summary` («N–M из K»), `Controls`, `PageSize`; многоточие при многих страницах. |
| **Sidebar** | Составной: `Root`, `Header`, `Title`, `Collapse`, `Content`, `Group`, `GroupLabel`, `Item`, `Footer`, `MobileTrigger`; `value` / `onChange`; десктопный rail + мобильный Sheet. |
| **Steps** | Мастер: горизонтальный/вертикальный, статус шага, `onStepClick`. |
| **Tabs** | Составные вкладки: `Tabs.List` / `Tabs.Trigger` / `Tabs.Panel`; `value` / `defaultValue` / `onChange`; `line` / `pill`, горизонтальные/вертикальные и бейдж на Trigger. |

---

## Отображение данных

| Компонент | Описание |
|-----------|----------|
| **Table** | Составной: `Root` / `Toolbar` / `Content` / `Loading` / `Empty` / `Footer` / `RowActions`. `Content` содержит сортировку (клиент/сервер), выбор строк, раскрытие, липкие колонки, `density`, resize и действия строки; loading, empty и пагинация собираются sibling-слотами. |
| **Timeline** | Вертикальный/горизонтальный, сворачиваемые подробности, `currentId`. |
| **Card** | `variant` outlined/elevated/ghost; составной `Header` / `Media` / `Body` / `Actions`; `loading`. |
| **Accordion** | Составной: `Item` / `Trigger` / `Content`; `bordered` (зазор + Box) / `flush` (разделители); `multiple`, отключённый пункт. |
| **Badge** | `size` sm/md, `position` overlay/standalone, `variant` включая `error`; overlay — `--altum-badge-overhang`. Числовой `label` / `BadgeCounter` ограничивается через `max`; `children` — якорь overlay. |
| **Avatar** / **AvatarGroup** | Размеры `xs`…`xl`, кольцо статуса, запасная иконка; группа с наложением. |
| **Chip** | Тег / фильтр: `mode` `chip` \| `tag`, `size`, `active`, `onRemove` / `onClick`. **`ChipGroup`**: `layout` `wrap` \| `scrollX`. |
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
| **Title** | Заголовки уровней `h1`–`h4`; цвет `--altum-color-type` (адаптация в `Box`). |
| **Text** | Текстовый примитив (`--altum-type-*`). Дефолт `as="span"` (inline); для блочного copy — `as="p"` / `as="div"`, иначе соседние `Text` склеятся в одну строку. |
| **Link** | Ссылка: `variant` `primary`\|`secondary`\|`muted`, `status` `danger`, `size` `xs`–`xl` (или inherit), `--altum-color-link-*`. |
| **Kbd** / **KbdGroup** | Отображение клавиш и сочетаний клавиатуры. |

---

## Раскладка

| Компонент | Описание |
|-----------|----------|
| **Layout** | Панель: скролл на корне; `Header` / `Footer` sticky; алиасы `Stack` / `Inline` / `Split` / `ControlRow` / `Item` / `Grid`. |
| **Stack** / **Inline** / **Split** / **ControlRow** / **LayoutItem** | Flex-примитивы (вертикаль / чипы / края / ряд контролов / `grow`). |
| **Grid** / **GridItem** | CSS Grid; `GRID_BREAKPOINTS`. |
| **Container** / **Page** | Колонка с max-width (`sm`…`xl` / `full`) и оболочка страницы. |
| **Box** | Поверхность (`outlined` / `elevated` / `floating` / `tinted` / `secondary` / `muted` / `glass` / `overlay` / `ghost` / `plain`). |
| **Collapse** | Плавное сворачивание по высоте. |
| **Separator** (`Spacer`) | Разделитель: `orientation` horizontal \| vertical, текст (`children`), отступы `start` / `end`. |
| **Item** | Составная строка: `Media` / `Content` / `Title` / `Description` / `Actions`; поверхность — `Box`. |
| **AspectRatio** | Обёртка с `aspect-ratio` (16:9 / 1:1). |
| **Media** | img/video-превью на базе **AspectRatio**. |
| **ScrollArea** | Стилизованный скролл (`orientation` y/x/both). |

---

## Медиа

| Компонент | Описание |
|-----------|----------|
| **ImageGallery** | Составная галерея: `Root` + `Viewport` / `Image` / `Prev` / `Next` / `Thumbnails` / `Thumb` / `Counter` / `Empty`. |
| **ImageCrop** | Обрезка изображения. |
| **FileList** | Список загрузок на **`Attachment`**: progress / retry / remove через `FileList.Item`. |
| **Attachment** | Карточка файла/изображения (compound `Media` / `Content` / `Title` / `Description` / `Actions`). |

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
| **Marker** | Системная заметка / status / bordered row / labeled separator (`Marker.Icon` + `Marker.Content`). |

---

## Mobile

| Компонент | Описание |
|-----------|----------|
| **SafeArea** | Отступы под notch / home-indicator (`env(safe-area-inset-*)`). |
| **PullToRefresh** | Жест «потянуть, чтобы обновить» для контейнера с прокруткой. |
| **GrabHandle** | Ручка захвата в стиле iOS. |
| **SwipeToAction** | Сенсорная обёртка: свайп раскрывает действия (iOS). |

---

## Обратная связь

| Компонент | Описание |
|-----------|----------|
| **Spinner** | Индикатор загрузки: `spin` \| `dots` \| `pulse` \| `typing`; размеры `sm` \| `md` \| `lg`. |
| **Skeleton** | Плейсхолдер + пресеты `.Text` / `.Avatar` / `.Card` / `.Table`. |
| **Progress** / **ProgressCircle** | `size`, `variant` (auto → success при 100%), `showValueText`, indeterminate, labels; у круга `diameter` перекрывает токен размера. |
| **Alert** | Составной: `Icon`, `Body` (`Title`, `Content`, `Actions`), `Close`; `variant`, `size`, `layout` block/inline. |
| **Notification** | Составной тост: `Provider`, `Viewport`, `Root`, `Title`, `Description`, `Actions`, `Close`. `variant` `info` / `success` / `warning` / `error`. Императивно: `NotificationProvider` + `notify()`. |

---

## Инфраструктура

| Экспорт | Описание |
|---------|----------|
| **ThemeProvider** | Светлая/тёмная тема. `applyTo` и контролируемая тема — [THEMING.md](./THEMING.md). |
| **LocaleProvider** | Локаль и переводы встроенных строк (`locale="ru" \| "en"`, опциональный `messages`). |
| **useLocale** / **useT** | Хук `{ locale, messages, t }` / только `t`. |
| **ru** / **en** | Встроенные словари. |
| **useTheme** | Хук `{ theme, setTheme, toggleTheme }` внутри `ThemeProvider`. |
| **FocusTrap** | Ловушка фокуса для доступности в модальных окнах. |
| **VisuallyHidden** | Контент только для скринридеров (скрыт визуально). |
| **SkipLink** | «Перейти к содержимому» (виден при фокусе). |
