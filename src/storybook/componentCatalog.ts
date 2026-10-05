/**
 * Каталог для Storybook About.
 * Список и `bytes` обновляет `npm run catalog`. Описания скрипт не перезаписывает.
 * `bytes` — минифицированный бандл папки: свой код и свой минифицированный CSS.
 * Stories и код из других папок не входят, сумма не считает общее дважды.
 */
export const componentCatalog = [
	{
		name: 'Accordion',
		bytes: 3864,
		description: 'Корневой контейнер аккордеона: состояние открытых секций + chrome.',
	},
	{
		name: 'ActionList',
		bytes: 6632,
		description: 'Список действий с поиском, группами и клавиатурной навигацией.',
	},
	{
		name: 'ActionSheetTrigger',
		bytes: 3687,
		description: 'Обёртка: long-press открывает вложенный Overflow.',
	},
	{
		name: 'Alert',
		bytes: 3594,
		description: 'Inline status-блок: info / success / warning / error.',
	},
	{
		name: 'AspectRatio',
		bytes: 574,
		description: 'Обёртка с фиксированным aspect-ratio (превью 16:9 / 1:1 без магии в CSS).',
	},
	{
		name: 'Attachment',
		bytes: 2219,
		description: 'Карточка файла: Item + статус загрузки (idle / uploading / error / done).',
	},
	{
		name: 'AutocompleteField',
		bytes: 935,
		description: 'Freestyle-комбобокс: произвольный ввод или выбор из options (прокси Select).',
	},
	{
		name: 'Avatar',
		bytes: 2885,
		description: 'Аватар: фото / инициалы / fallback-иконка + status ring.',
	},
	{
		name: 'Badge',
		bytes: 4174,
		description: 'Индикатор: overlay на children или standalone; размеры sm/md.',
	},
	{
		name: 'BarChart',
		bytes: 2136,
		description: 'Столбчатый SVG-график без внешних зависимостей.',
	},
	{
		name: 'Box',
		bytes: 2811,
		description: 'Примитив поверхности: заливка (variant) + border / borderStyle / shadow.',
	},
	{
		name: 'Bubble',
		bytes: 5059,
		description: 'Пузырь сообщения в переписке.',
	},
	{
		name: 'Button',
		bytes: 8255,
		description: 'Кнопка действия с вариантами оформления и loading-состоянием.',
	},
	{
		name: 'ButtonGroup',
		bytes: 7883,
		description: 'Коробка для независимых кнопок: склейка и orientation. Варианты как у Button, кроме link.',
	},
	{
		name: 'ButtonIcon',
		bytes: 185,
		description: 'Тонкий прокси над Button: icon-only кнопка (`data-icon-only`, icon/children → prefix).',
	},
	{
		name: 'Calendar',
		bytes: 11136,
		description: 'Календарь выбора даты с переключением сеток дней, месяцев и лет.',
	},
	{
		name: 'CalendarBoard',
		bytes: 35790,
		description: 'Календарная доска: месяц, неделя, день, год и чипы задач.',
	},
	{
		name: 'Card',
		bytes: 2365,
		description: 'Карточка на базе Box: variant, header / media / children / actions, loading.',
	},
	{
		name: 'Checkbox',
		bytes: 3432,
		description: 'Чекбокс с размером, стороной подписи, indeterminate и режимом task.',
	},
	{
		name: 'Chip',
		bytes: 9865,
		description: 'Компактная метка: чип, тег или toggle-фильтр (mode).',
	},
	{
		name: 'Collapse',
		bytes: 591,
		description: 'Плавное раскрытие и сворачивание блока по высоте с учётом reduced motion.',
	},
	{
		name: 'ColorSwatchGroup',
		bytes: 1958,
		description: 'Группа цветовых swatch-кнопок для выбора одного значения из палитры.',
	},
	{
		name: 'CommandPalette',
		bytes: 3912,
		description: 'Модальная палитра команд на Overlay (variant="modal").',
	},
	{
		name: 'ConfirmDialog',
		bytes: 1263,
		description: 'Модальное окно подтверждения критического или необратимого действия.',
	},
	{
		name: 'Container',
		bytes: 1275,
		description: 'Контентная колонка: max-width + горизонтальные отступы страницы.',
	},
	{
		name: 'DateField',
		bytes: 2964,
		description: 'Поле даты с маской ввода и выпадающим календарём; на мобильных — Sheet.',
	},
	{
		name: 'DateRangeField',
		bytes: 6056,
		description: 'Выбор диапазона дат: маскированное поле + календарь в режиме range.',
	},
	{
		name: 'DayStripCalendar',
		bytes: 3906,
		description: 'Горизонтальная полоса дней для быстрого выбора даты в недельном или произвольном окне.',
	},
	{
		name: 'DescriptionList',
		bytes: 1351,
		description: 'Список описаний (key–value) для карточки сущности и read-only настроек.',
	},
	{
		name: 'DonutChart',
		bytes: 3919,
		description: 'Кольцевая (donut) диаграмма без внешних зависимостей.',
	},
	{
		name: 'Dropdown',
		bytes: 3472,
		description: 'Список или меню у кнопки: выбрать значение или одну команду.',
	},
	{
		name: 'EmptyState',
		bytes: 2372,
		description: 'Заглушка пустого списка или раздела с иконкой, текстом и действием.',
	},
	{
		name: 'FieldGroup',
		bytes: 1363,
		description: 'Ряд без своего визуала: поля и кнопки стыкуются, скругление снимается со стороны касания.',
	},
	{
		name: 'FieldLabel',
		bytes: 2249,
		description: 'Обёртка «подпись + контент» для полей формы в vertical и horizontal раскладках.',
	},
	{
		name: 'Fieldset',
		bytes: 2382,
		description: 'Группа полей формы: заголовок, описание и поля на корневых пропах.',
	},
	{
		name: 'FileList',
		bytes: 3787,
		description: 'Список файлов на базе **Item**: статус загрузки, retry и удаление.',
	},
	{
		name: 'FileUploader',
		bytes: 635,
		description: 'Зона загрузки + опциональный список файлов со статусом и Progress.',
	},
	{
		name: 'FormMessage',
		bytes: 352,
		description: 'Inline-сообщение под полем или над формой: подсказка, ошибка, успех.',
	},
	{
		name: 'Gap',
		bytes: 557,
		description: 'Пустой зазор фиксированного размера.',
	},
	{
		name: 'Grid',
		bytes: 1424,
		description: 'CSS Grid-контейнер с адаптивными колонками и отступами через breakpoints.',
	},
	{
		name: 'Header',
		bytes: 989,
		description: 'Шапка страницы: заголовок, подзаголовок и вкладки в одной колонке.',
	},
	{
		name: 'ImageCrop',
		bytes: 9359,
		description: 'Модальное окно обрезки изображения с pan/zoom и экспортом в файл.',
	},
	{
		name: 'ImageGallery',
		bytes: 6167,
		description: 'Галерея изображений с миниатюрами, стрелками поверх кадра и клавиатурной навигацией.',
	},
	{
		name: 'ImageLightbox',
		bytes: 2263,
		description: 'Полноэкранный просмотр галереи поверх затемнённого backdrop.',
	},
	{
		name: 'Item',
		bytes: 3890,
		description: 'Строка списка: media, title, description, actions.',
	},
	{
		name: 'Kbd',
		bytes: 1253,
		description: 'Отображает клавишу или сочетание ввода с клавиатуры.',
	},
	{
		name: 'Layout',
		bytes: 4470,
		description: 'Корневая колонка панели: Header / Content / Footer.',
	},
	{
		name: 'LineChart',
		bytes: 2715,
		description: 'Линейный SVG-график с несколькими сериями данных и hover-подсказками.',
	},
	{
		name: 'Link',
		bytes: 1981,
		description: 'Стилизованная текстовая ссылка с вариантами, размерами и hover/focus дизайн-системы.',
	},
	{
		name: 'Listbox',
		bytes: 8497,
		description: 'Примитив списка внутри Select и Menu, не поле выбора.',
	},
	{
		name: 'LiveRegion',
		bytes: 307,
		description: 'Скрытая область, которая озвучивает сообщение скринридером.',
	},
	{
		name: 'LocaleProvider',
		bytes: 566,
		description: 'Провайдер локали и переводов встроенных строк библиотеки.',
	},
	{
		name: 'Marker',
		bytes: 2152,
		description: 'Inline-маркер в ленте: статус, системная заметка, bordered-row или labeled separator.',
	},
	{
		name: 'MaskedField',
		bytes: 2092,
		description: 'Текстовое поле с маской ввода: хранит только цифры, отображает форматированное значение.',
	},
	{
		name: 'Media',
		bytes: 928,
		description: 'Медиа-превью с фиксированным aspect-ratio (img / video).',
	},
	{
		name: 'Menu',
		bytes: 3285,
		description: 'Меню действий: клик по триггеру (Dropdown + ActionList) или ПКМ / Shift+F10 (trigger="context").',
	},
	{
		name: 'Modal',
		bytes: 1611,
		description: 'Модальное окно на базе Overlay (variant="modal").',
	},
	{
		name: 'MultiSelect',
		bytes: 2573,
		description: 'Multiple-выбор с chips в триггере (декоратор над Select).',
	},
	{
		name: 'Notification',
		bytes: 12754,
		description: 'Тост / баннер: title, description, actions.',
	},
	{
		name: 'NumberField',
		bytes: 1714,
		description: 'Числовое поле с кнопками ± и clamp по min/max.',
	},
	{
		name: 'Overflow',
		bytes: 10742,
		description: 'Прячет не влезшие пункты в меню «ещё».',
	},
	{
		name: 'Overlay',
		bytes: 3571,
		description: 'Модальный, плавающий и sheet-слой.',
	},
	{
		name: 'Pagination',
		bytes: 4732,
		description: 'Постраничная навигация (составной API).',
	},
	{
		name: 'PasswordField',
		bytes: 3915,
		description: 'Поле пароля на базе TextField: показать/скрыть и опциональный strength-meter.',
	},
	{
		name: 'PinInput',
		bytes: 4485,
		description: 'Поле ввода PIN / OTP (2FA, код из SMS): группа ячеек на TextField.',
	},
	{
		name: 'Popover',
		bytes: 3599,
		description: 'Немодальная панель у триггера для произвольного контента: текст, форма, фильтры, календарь.',
	},
	{
		name: 'PopupSwitch',
		bytes: 7300,
		description: 'Тулбар: кнопка показывает текущее значение и открывает список поверх себя.',
	},
	{
		name: 'Progress',
		bytes: 4679,
		description: 'Горизонтальный индикатор выполнения.',
	},
	{
		name: 'PullToRefresh',
		bytes: 3402,
		description: 'Pull-to-refresh для mobile-first списков (опционально).',
	},
	{
		name: 'Radio',
		bytes: 2455,
		description: 'Радиокнопка с подписью и поддержкой read-only без disabled-стиля.',
	},
	{
		name: 'Rating',
		bytes: 3139,
		description: 'Оценка звёздами (отзывы, рейтинги).',
	},
	{
		name: 'RelativeTime',
		bytes: 1000,
		description: 'Относительное время для лент и таблиц («2 ч назад»).',
	},
	{
		name: 'SafeArea',
		bytes: 1267,
		description: 'Отступы под системные «небезопасные» зоны экрана.',
	},
	{
		name: 'ScrollArea',
		bytes: 774,
		description: 'Область со стилизованным скроллом (панели, меню, списки).',
	},
	{
		name: 'SearchField',
		bytes: 380,
		description: 'Поле поиска с иконкой лупы.',
	},
	{
		name: 'SegmentedControl',
		bytes: 1443,
		description: 'Один сегмент: SelectionGroup, выбранный пункт — заливка кнопки.',
	},
	{
		name: 'Select',
		bytes: 7992,
		description: 'Слепой донор выбора: button/input-триггер, список в панели; chips — MultiSelect.',
	},
	{
		name: 'Separator',
		bytes: 1471,
		description: 'Разделитель: линия ± текст, horizontal / vertical, отступы start / end.',
	},
	{
		name: 'Sheet',
		bytes: 5354,
		description: 'Выезжающая панель с шапкой, телом и футером.',
	},
	{
		name: 'Sidebar',
		bytes: 7926,
		description: 'Навигационный сайдбар: collapsed, mobile drawer, value / onChange.',
	},
	{
		name: 'Skeleton',
		bytes: 2790,
		description: 'Плейсхолдер загрузки с пульсирующей анимацией.',
	},
	{
		name: 'SkipLink',
		bytes: 1158,
		description: '«Перейти к содержимому» — появляется при фокусе (a11y-база).',
	},
	{
		name: 'Slider',
		bytes: 6048,
		description: 'Ползунок: одно значение или диапазон «от–до» (два thumb).',
	},
	{
		name: 'SortableList',
		bytes: 6792,
		description: 'Список с drag-and-drop перестановкой любых элементов (id + renderItem / content).',
	},
	{
		name: 'Spinner',
		bytes: 3690,
		description: 'Индикатор загрузки: круг, typing-точки, inline-dots или pulse.',
	},
	{
		name: 'StatBadge',
		bytes: 2407,
		description: 'Компактный блок метрики «подпись + значение» для дашбордов и профилей.',
	},
	{
		name: 'Steps',
		bytes: 4593,
		description: 'Пошаговый индикатор: horizontal/vertical, error/complete, кликабельные шаги.',
	},
	{
		name: 'SuggestField',
		bytes: 930,
		description: 'Подсказки из списка: filter+match на blur (прокси Select, без freestyle).',
	},
	{
		name: 'SwipeToAction',
		bytes: 8379,
		description: 'Touch-обёртка: свайп раскрывает действия (как уведомления iOS).',
	},
	{
		name: 'Switch',
		bytes: 3349,
		description: 'Переключатель: size, labelSide.',
	},
	{
		name: 'Table',
		bytes: 15059,
		description: 'Таблица: columns, data, опционально toolbar, loading, empty, footer.',
	},
	{
		name: 'Tabs',
		bytes: 3869,
		description: 'Вкладки: список SegmentedControl (line или pill) и панели через rootRef.',
	},
	{
		name: 'Text',
		bytes: 1755,
		description: 'Базовый текстовый примитив с типографическими токенами размера, веса и цвета.',
	},
	{
		name: 'TextField',
		bytes: 13460,
		description: 'Поле ввода с плавающим лейблом, подсказкой и слотами по краям.',
	},
	{
		name: 'TextareaField',
		bytes: 1252,
		description: 'Многострочное поле с авто-ростом по контенту и тем же chrome, что у TextField.',
	},
	{
		name: 'ThemeProvider',
		bytes: 28809,
		description: 'Провайдер светлой и тёмной темы: CSS-переменные на обёртку или на document.',
	},
	{
		name: 'TimeField',
		bytes: 2929,
		description: 'Поле времени (маска HH:MM) с выпадающими барабанами часов и минут.',
	},
	{
		name: 'Timeline',
		bytes: 4890,
		description: 'Таймлайн: vertical/horizontal, collapsible details, current крупнее.',
	},
	{
		name: 'Title',
		bytes: 839,
		description: 'Заголовок страницы или секции с семантическим уровнем h1–h4.',
	},
	{
		name: 'Tooltip',
		bytes: 2474,
		description: 'Текстовая подсказка: ховер и фокус через CSS, позиция через CSS Anchor Positioning.',
	},
	{
		name: 'Type',
		bytes: 0,
		description: 'Роль текста: Title или Text с фиксированным кеглем для экрана, диалога, секции и карточки.',
	},
	{
		name: 'UploadZone',
		bytes: 3301,
		description: 'Зона загрузки файлов drag-and-drop с скрытым input и render-prop для кастомного триггера.',
	},
	{
		name: 'VirtualList',
		bytes: 9446,
		description: 'Виртуализированный список с динамической высотой строк и внешним scroll-контейнером.',
	},
	{
		name: 'VisuallyHidden',
		bytes: 276,
		description: 'Контент скрыт визуально, но доступен скринридерам.',
	},
	{
		name: 'WheelTimePicker',
		bytes: 4551,
		description: 'Попап времени из двух барабанов: часы 00–23 и минуты 00–59.',
	},
] as const;

export const componentCatalogBytes = 445507;
