/**
 * Встроенный словарь русского языка (эталон для типа {@link Messages}).
 */
export const ru = {
	common: {
		close: 'Закрыть',
		clear: 'Очистить',
		collapse: 'Свернуть',
	},

	calendar: {
		months: [
			'Январь',
			'Февраль',
			'Март',
			'Апрель',
			'Май',
			'Июнь',
			'Июль',
			'Август',
			'Сентябрь',
			'Октябрь',
			'Ноябрь',
			'Декабрь',
		],
		monthsShort: [
			'Янв',
			'Фев',
			'Мар',
			'Апр',
			'Май',
			'Июн',
			'Июл',
			'Авг',
			'Сен',
			'Окт',
			'Ноя',
			'Дек',
		],
		weekdaysShort: [
			'Пн',
			'Вт',
			'Ср',
			'Чт',
			'Пт',
			'Сб',
			'Вс'
		],
		prevMonth: 'Предыдущий месяц',
		nextMonth: 'Следующий месяц',
		prevYear: 'Предыдущий год',
		nextYear: 'Следующий год',
		prevYears: 'Предыдущие годы',
		nextYears: 'Следующие годы',
		selectYear: 'Выбрать год, сейчас {year}',
		selectMonth: 'Выбрать месяц, сейчас {month}',
		monthsOfYear: 'Месяцы {year}',
		yearsRange: 'Годы {start}–{end}',
	},

	calendarBoard: {
		ariaLabel: 'Календарная доска',
		prevPeriod: 'Предыдущий период',
		nextPeriod: 'Следующий период',
		viewSwitchAria: 'Представление календаря',
		views: {
			month: 'Месяц',
			week: 'Неделя',
			day: 'День',
			year: 'Год',
		},
		scheduleAria: 'Расписание',
		allDay: 'События на весь день',
		allDayShort: 'весь день',
		dayWithTasks: '{day} {month}, задач: {count}',
		dayWithoutTasks: '{day} {month}',
		moreTasks: 'ещё {count}',
	},

	dayStrip: {
		ariaLabel: 'Навигация по дням',
		prev: 'Предыдущие дни',
		next: 'Следующие дни',
		days: 'Дни',
	},

	timePicker: {
		hours: 'Часы',
		minutes: 'Минуты',
	},

	dateRangePicker: {
		label: 'Период',
		start: 'С',
		end: 'По',
	},

	select: {
		removeItem: 'Удалить {label}',
	},

	customSelect: {
		filterPlaceholder: 'Поиск...',
		noOptions: 'Ничего не найдено',
	},

	listbox: {
		noOptions: 'Ничего не найдено',
	},

	suggestField: {
		noOptions: 'Ничего не найдено',
	},

	sheet: {
		ariaLabel: 'Панель',
	},

	modal: {
		ariaLabel: 'Диалог',
	},

	confirmDialog: {
		confirm: 'Подтвердить',
		cancel: 'Отмена',
	},

	table: {
		expandColumn: 'Развернуть',
		selectAll: 'Выбрать все строки',
		selectRow: 'Выбрать строку {id}',
		resizeColumn: 'Изменить ширину: {header}',
		emptyTitle: 'Нет данных',
		rowActions: 'Действия строки',
	},

	pagination: {
		ariaLabel: 'Пагинация',
		prev: 'Предыдущая страница',
		next: 'Следующая страница',
		page: 'Страница {page}',
		summary: '{start}–{end} из {total}',
		pageSizeLabel: 'На странице',
		pageSizeAria: 'Размер страницы',
	},

	sortable: {
		moveUp: 'Переместить вверх',
		moveDown: 'Переместить вниз',
		moved: 'Позиция {position} из {total}: элемент перемещён',
		dragItem: 'Перетащить элемент',
	},

	upload: {
		dropHint: 'Перетащите файлы сюда или',
		choose: 'выберите',
		selectedCount: 'Выбрано файлов: {count}',
		release: 'Отпустите файл для загрузки',
	},

	imageCrop: {
		title: 'Обрезка изображения',
		confirm: 'Применить',
		cancel: 'Отмена',
		choose: 'Выберите изображение',
		hint: 'Перетащите рамку или измените масштаб за углы',
		loadError: 'Не удалось загрузить изображение',
		cropError: 'Не удалось обрезать изображение',
		exportError: 'Не удалось экспортировать изображение',
		scaleHandle: 'Масштаб {corner}',
	},

	imageGallery: {
		empty: 'Нет изображений',
		prev: 'Предыдущее изображение',
		next: 'Следующее изображение',
		imageN: 'Изображение {index}',
	},

	imageLightbox: {
		close: 'Закрыть галерею',
		ariaLabel: 'Галерея изображений',
	},

	sidebar: {
		ariaLabel: 'Навигация сайдбара',
		openMenu: 'Открыть меню',
		expand: 'Развернуть',
		collapse: 'Свернуть',
		expandSidebar: 'Развернуть сайдбар',
		collapseSidebar: 'Свернуть сайдбар',
	},

	password: {
		reveal: 'Показать пароль',
		hide: 'Скрыть пароль',
		strength: {
			weak: 'Слабый',
			fair: 'Средний',
			good: 'Хороший',
			strong: 'Надёжный',
		},
	},

	numberField: {
		group: 'Изменить значение',
		decrement: 'Уменьшить',
		increment: 'Увеличить',
	},

	pinInput: {
		ariaLabel: 'Код подтверждения',
		digit: 'Цифра {index}',
	},

	searchField: {
		label: 'Поиск',
	},

	slider: {
		ariaLabel: 'Ползунок',
		from: 'От',
		to: 'До',
	},

	rating: {
		ariaLabel: 'Рейтинг',
		value: '{score} из {max}',
	},

	actionList: {
		filterPlaceholder: 'Фильтр…',
		empty: 'Ничего не найдено',
		ariaLabel: 'Список действий',
	},

	commandPalette: {
		placeholder: 'Поиск команд…',
		title: 'Командная палитра',
	},

	pullToRefresh: {
		pull: 'Потяните для обновления',
		release: 'Отпустите',
		refreshing: 'Обновление…',
	},

	timeline: {
		hide: 'Скрыть',
		more: 'Подробнее',
	},

	spinner: {
		typing: 'Печатает',
		loading: 'Загрузка',
	},

	steps: {
		ariaLabel: 'Шаги',
	},

	segmentedControl: {
		ariaLabel: 'Сегментированный контроль',
	},

	bubble: {
		expand: 'Ещё',
		collapse: 'Свернуть',
		reactions: 'Реакции',
	},

	chip: {
		remove: 'Удалить',
		groupChips: 'Чипы',
		groupTags: 'Теги',
	},

	fileList: {
		remove: 'Удалить',
		retry: 'Повторить',
	},

	virtualList: {
		ariaLabel: 'Список',
	},

	skipLink: {
		label: 'Перейти к содержимому',
	},

	overflowActions: {
		title: 'Действия',
		ariaLabel: 'Действия',
		more: 'Ещё действия',
	},

	overflowGroup: {
		title: 'Ещё',
		ariaLabel: 'Группа',
		more: 'Показать ещё',
	},

	buttonGroup: {
		ariaLabel: 'Группа кнопок',
	},

	dropdownMenu: {
		mobileTitle: 'Меню',
		ariaLabel: 'Меню',
	},

	contextMenu: {
		ariaLabel: 'Контекстное меню',
	},

	charts: {
		donut: 'Круговая диаграмма',
		bar: 'Столбчатый график',
	},
} as const;
