# Компоненты altum

Краткий справочник публичного API. Установка и точки входа — [README](../README.md). Токены — [THEMING.md](./THEMING.md). Раскладка — [LAYOUT.md](./LAYOUT.md). Иконки — [ICONS.md](./ICONS.md).

**Link:** единственный элемент-потомок получает стили через Slot (роутерный `Link`). Смена HTML-тега у кнопок — `as` (`button` | `a`). **`Dropdown`**: якорь — `trigger` (элемент или render-prop, через `renderChildren`). **`Popover`**: якорь — `trigger` (элемент или render-prop, через `renderChildren`). **`Tooltip`**: элемент-child или render-prop. Без пропа `asChild`.

Оверлеи: кнопки — в `Modal.Footer` / `Sheet.Footer`, sibling к `Body`, не внутри скролла. Статус и кнопки в одном ряду — `ControlRow` внутри футера.

---

## Действия

| Компонент | Описание |
|-----------|----------|
| **Button** | Кнопка: `variant` (`primary` / `tinted` / `secondary` / `danger` / `danger_tinted` / `ghost` / `link`), `prefix` / `postfix`, `loading`, `fullWidth`. Icon-only: `data-icon-only` (+ `data-shape="circle"`); закрытие overlay: `overlayClose.close` + `data-appearance="diskClose"`. |
| **ButtonGroup** | Коробка для независимых **`Button`**: `orientation` `horizontal` / `vertical`, `itemFit` `equal` \| `content`, `width` `auto` \| `full`, `size`. `variant` как у **Button**, кроме `link`: `primary` / `tinted` / `secondary` / `danger` / `danger_tinted` / `ghost`. Группа снимает chrome кнопки и не рисует выбранный пункт. Выбор — **SelectionGroup**. |
| **SegmentedControl** | Один сегмент: **`SelectionGroup`** `radio`. Выбранный пункт — заливка кнопки, без бегунка. `options` + `value` / `onChange`; `orientation` `horizontal` / `vertical`; `itemFit` `equal` \| `content`; варианты `primary` / `tinted` / `secondary` (по умолчанию) / `ghost` / `plain`. |
| **Overflow** | Лишние пункты за ⋯. `Overflow.Item` открывает **`Menu`**; прочие дети измеряются по ширине и уходят в **`Dropdown`**. `longPress` открывает меню долгим нажатием (хост — **`ActionSheetTrigger`**). |
| **ActionList** | Список действий: `items` / `groups` (`groupId`), `filterable`, `onAction`. Подпись пункта — **`ActionItem`**. |
| **ActionItem** | Подпись пункта: иконка, текст, описание, шорткат. Её рисует **`ActionList`**. |
| **ActionSheetTrigger** | Long-press host. С `items` — внутренний **`Menu`** + `Button[data-overflow-trigger]`; без `items` — дети с `[data-overflow-trigger]` (`Overflow`). `showOverflowTrigger` показывает ⋯ на touch. Хост — `rootRef`. |

---

## Формы

| Компонент | Описание |
|-----------|----------|
| **TextField** | Примитив поля: chrome + `as` (`input` / `textarea` / `button` / `div`). `label` — floating-лейбл внутри chrome (центр → вверх при фокусе/значении); без `label` — поле без подписи (`aria-label` / `placeholder`). `description` — подсказка или слот под chrome. `keepPlaceholder` — не скрывать placeholder при фокусе пустого поля. |
| **PasswordField** | Пароль на базе TextField: показать/скрыть, опциональный индикатор сложности. |
| **SearchField** | Обёртка над `TextField` с иконкой поиска (`onClear` от TextField). Без `label` — тулбарный вид. |
| **TextareaField** | Многострочное поле на **TextField** `as="textarea"`; авто-рост высоты. |
| **NumberField** | Числовой ввод на базе `TextField` с кнопками +/-. |
| **MaskedField** | Поле с маской ввода (телефон, дата и т.п.) на базе `TextField`; опционально `maskAsPlaceholder`. Не переопределяйте `padding` / `font-size` на inner `input`. |
| **PinInput** | PIN / OTP: группа ячеек на **TextField**. `label` — **FieldLabel**; `description` / `error` — **FormMessage**. |
| **Rating** | Оценка звёздами. |
| **FormMessage** | Подсказка / ошибка / успех под полем; `variant` `hint` / `error` / `success`. |
| **Select** | Поле выбора: `options`, `value` / `onChange`, `label`, `filterable`. Один `TextField`; перекрытие поля — `inputProps`. |
| **SuggestField** | Подсказки: печатный `TextField` внутри **`Select`** через `inputProps`. Chrome от **`FieldBaseProps`**. Узел поля — `inputRef`. |
| **Checkbox** | `size`, `labelSide`, `indeterminate`, `mode` (`default` \| `task`), `align`, `labelVisibility`, `onCheckedChange(checked)` (native `onChange` сохраняется). |
| **Switch** | `size`, `labelSide`; `onChange(checked)` и алиас `onCheckedChange`. |
| **CheckboxGroup** | Группа чекбоксов с управляемым `value: string[]`. |
| **Radio** / **RadioGroup** | Радиокнопка и группа; `labelSide`, `onCheckedChange` на `Radio`. |
| **SelectionGroup** | Выбор на **`ButtonGroup`** и **`Button`**: `options` (`value`, `label`), `value`, `onChange`, `disabled`. `type` `radio` (одно значение) / `checkbox` (несколько). Выбранный пункт — заливка кнопки. `children` — узел перед пунктами. `customRenderOption` рисует пункт сам и раскладывает `optionProps`, без трека **`ButtonGroup`**. |
| **Slider** | Ползунок: `value: number` или диапазон `value: [from, to]` (два thumb). |
| **DateField** | Выбор даты: MaskedField + календарь; по умолчанию prefix — `FieldBaseIcon` + календарь; chrome от **`FieldBaseProps`**. |
| **DateRangeField** | Диапазон дат (`value`/`onChange` как `{ start?, end? }`); chrome от **`FieldBaseProps`**; `layout` `single` / `split`. |
| **TimeField** | Поле времени с маской `HH:MM` и барабанами **`WheelTimePicker`**; по умолчанию prefix — иконка часов. |
| **WheelTimePicker** | Два барабана часов и минут (`TimeValue`); выбор кликом или прокруткой применяется сразу. |
| **Calendar** | Составной: `Provider` / `Root` / `Header` / `Title` / `Nav` / `Body`. `selectionMode` `single` \| `range` на Provider. `value` — `Date` или `DateRangeValue`. |
| **DayStripCalendar** | Горизонтальная полоса дней: `daysCount`, prev/next выбирают соседний день, `value` / `onChange`, `renderDay`. |
| **ColorSwatchGroup** | Выбор цвета из набора цветных точек. Это **`SelectionGroup`** с `customRenderOption`. |
| **UploadZone** | Зона перетаскивания файлов для загрузки. |
| **FieldGroup** | Ряд без своего визуала: поля и `Button` / `ButtonGroup` / `PopupSwitch` стыкуются одной рамкой, скругление снимается со стороны касания. `width="full"` растягивает поля. |
| **Fieldset** | Группа полей: `legend` / `description` / `hint` / `footer` / `gap`; содержимое — `children`. Варианты `default` / `card` / `plain`. |

---

## Оверлеи

| Компонент | Описание |
|-----------|----------|
| **DialogLayout** | Поверхность `Box` с крестиком в правом верхнем углу поверх контента. `onClose`, `showClose`. |
| **Modal** | Составной диалог: корень — **`DialogLayout`**, шапка — **`Header`** внутри **`Layout.Header`**, тело и футер — **`Layout`**. `Header` / `Header.Title` / `Header.Subtitle` / `Header.Tabs` / `Body` / `Footer`. Ряд действий — **`ControlRow`** внутри `Footer`. `open` / `onOpenChange`, `showClose`, `size` `sm` / `md` / `lg` на корне. |
| **ConfirmDialog** | Готовый диалог на **`Modal`**: отмена + подтверждение, `confirmLabel`, `secondaryAction`, `status="danger"`, `onOpenChange`. |
| **Sheet** | Панель: поверхность **`Box`**, шапка / тело / футер — **`Layout`**. `Header` / `Body` / `Footer`. Заголовок — **`Title`**. Крестик — `showClose` на `Header`. `mode` / `direction` / `showHandle`. Слой — нативный `<dialog>`. |
| **ImageLightbox** | Полноэкранный просмотр; `open` / `onOpenChange`. |
| **Dropdown** | Список или меню у кнопки, на базе **`Popover`** (`popover="auto"`). Якорь — `trigger`. Выбор пункта закрывает панель, клик снаружи и Escape — браузер. Стрелки — у списка внутри. `align`, `widthMode`, `triggerMode` `toggle` \| `combobox`. На узком экране та же панель — нижняя шторка на CSS. Узел — `rootRef`. Форма и календарь — **`Popover`**. |
| **Menu** | Меню действий: клик по `trigger` (**`Dropdown`** + **`ActionList`**) или `trigger="context"` (ПКМ / Shift+F10 у курсора). Пункты — **`ActionListItem`** (`id`) и `{ type: 'separator' }`, как в **`Listbox`**. Программный показ — `popupRef`. |
| **Tooltip** | Текстовая подсказка. Ховер и клавиатурный фокус — CSS (`:hover`, `:focus-visible`), позиция — CSS Anchor. Пузырь — `popover="manual"` в top layer, `overflow` предка не режет. Клик мышью не оставляет подсказку. `side`, `openDelay` / `closeDelay` как задержки CSS, без JS-таймера. |
| **Popover** | Немодальная панель: текст, форма, фильтры, календарь. Открытие — `popovertarget`, закрытие по клику снаружи и Escape — `popover="auto"`. Клик внутри не закрывает, фокус не запирается. Якорь — `trigger`. Позиция — CSS Anchor (`side` / `align`, `positionArea()`). Подсказки — **Tooltip**. |
| **CommandPalette** | Палитра Cmd+K: поверхность **`Box`**, подпись **`Text`**. `items` / `groups`, фильтр — **`ActionList`** с `filterable`. Ширина как у **`Modal`** `md`. |

---

## Навигация

| Компонент | Описание |
|-----------|----------|
| **Pagination** | Постраничная навигация. Без `children` — `Controls`; опционально `totalItems` / `pageSize` / `onPageSizeChange`. Составной: `Summary`, `Controls`, `PageSize`. |
| **Sidebar** | Составной: `Root`, `Header`, `Title`, `Content`, `Group`, `GroupLabel`, `Item`, `Footer`, `MobileTrigger`. Шапка, меню и футер — `Layout`. Кнопка сворачивания — на корне, по центру правой границы. `value` / `onChange`; десктопный rail + мобильный Sheet. |
| **Steps** | Мастер: горизонтальный/вертикальный, статус шага. `onStepClick` слушает список. Узел — `rootRef`. Ориентация, размер, соединители и статус — `data-*`. |
| **Tabs** | Список — **`SegmentedControl`** (`itemRole="tab"`): `items` на корне (`value`, `label`, `badge`, `badgeDot`, `disabled`). Панель — `Tabs.Panel` с тем же `rootRef` в `tabsRef`, без контекста. `value` / `defaultValue` / `onChange`. `pill` — заливка выбранной вкладки, `line` — черта у выбранной. |

---

## Отображение данных

| Компонент | Описание |
|-----------|----------|
| **Table** | Один компонент: `columns` / `data` / `rowKey`, плюс `toolbar`, `loading`, `empty` (`title` / `description` / `action`) и `footer` (пагинация). Сортировка (клиент/сервер), выбор строк, раскрытие, липкие колонки, `density`, resize и `rowActions` (`ActionListItem[]`). |
| **Timeline** | Вертикальный/горизонтальный, сворачиваемые подробности (`<details>`), `currentId`. |
| **Card** | `variant` outlined/elevated/ghost; радиус по умолчанию `lg`; `header` / `media` / `actions` (ReactNode), `children` — body; `loading`. |
| **Accordion** | `Accordion.Item` с `title` и содержимым в `children`; секция — `<details>`. `flush` (по умолчанию) / `bordered`; `multiple`, отключённый пункт. Начальное открытие — `defaultOpenIds`. |
| **Badge** | `size` sm/md, `position` overlay/standalone, `variant` включая `error`; overlay — `--altum-badge-overhang`. Числовой `label` ограничивается через `max`; `children` — якорь overlay. |
| **Avatar** / **AvatarGroup** | Размеры `xs`…`xl`, кольцо статуса, запасная иконка; группа с наложением. |
| **Chip** | Тег / фильтр: `mode` `chip` \| `tag` \| `toggle`, `size`, `onRemove` / `onClick`. **`ChipGroup`**: `mode` `chip` \| `tag`, `gap`. |
| **StatBadge** | Компактный блок статистики: число + подпись; `variant` `default` / `success` / `warning` / `error`; `size` `md` / `sm`. Узел — `rootRef`. Размер и статус — `data-size` и `data-variant`. |
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
| **Header** | Шапка страницы: `Title`, `Subtitle` и вкладки `Tabs` в одной колонке. |
| **Layout** | Панель: скролл на корне; `Header` / `Footer` sticky. `padding` 12 / 20 / 28px. У sticky `variant` красит фон после сдвига скролла. |
| **Stack** / **Inline** / **Split** / **ControlRow** / **LayoutItem** | Flex-примитивы (вертикаль / чипы / края / ряд контролов / `grow`). |
| **Grid** / **GridItem** | CSS Grid; скалярные `columns` / `span`, `mode` autoFit/autoFill. |
| **Container** / **Page** | Колонка с max-width (`sm`…`xl` / `full`) и оболочка страницы. |
| **Box** | Поверхность (`outlined` / `elevated` / `floating` / `tinted` / `secondary` / `muted` / `glass` / `overlay` / `ghost` / `plain`). Красит только себя; потомки остаются на глобальных токенах. |
| **Collapse** | Плавное сворачивание по высоте (CSS `grid-template-rows`). |
| **Separator** | Разделитель: `orientation` horizontal \| vertical, текст (`children`), отступы `start` / `end`. |
| **Gap** | Пустой зазор: `size` (токен spacing), `orientation` horizontal \| vertical. Ритм группы — `gap` у Stack / Inline. |
| **Item** | Строка: `media` / `mediaVariant`, `title`, `description`, `actions`; `wrap` переносит длинный текст вместо ellipsis; поверхность — `Box`. |
| **AspectRatio** | Обёртка с `aspect-ratio` (16:9 / 1:1). |
| **Media** | img/video-превью с `aspect-ratio`. |
| **ScrollArea** | Стилизованный скролл (`orientation` y/x/both); `maxHeight` / `maxWidth` без дефолта. |

---

## Медиа

| Компонент | Описание |
|-----------|----------|
| **ImageGallery** | Галерея: `images`, chrome `default` \| `none`, `showNav` / `showThumbnails` / `showCounter`. |
| **ImageCrop** | Обрезка изображения. Корень — **`DialogLayout`**, шапка и кнопки — разметка компонента, заголовок — **`Title`**. |
| **FileList** | Список загрузок на **`Item`**: progress / retry / remove через `FileList.Item`. |
| **Attachment** | Карточка файла: `Item` + статус загрузки (`idle` / `uploading` / `error` / `done`). Действия в слоте — icon-only **`Button`**. |

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
| **SwipeToAction** | Сенсорная обёртка: свайп раскрывает действия (iOS). Узел — `rootRef`. Жест пишется в DOM, полный свайп — `data-full-swipe-active`. |

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
| **LiveRegion** | Скрытая область: озвучивает `message`. `politeness` `polite` / `assertive`. Пустое сообщение ничего не рендерит. |
| **SkipLink** | «Перейти к содержимому» (виден при фокусе). |
