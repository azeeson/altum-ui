export const ruSlice = {
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
	dayWithTasks: {
		one: '{day} {month}, {count} задача',
		few: '{day} {month}, {count} задачи',
		many: '{day} {month}, {count} задач',
	},
	dayWithoutTasks: '{day} {month}',
	moreTasks: {
		one: 'ещё {count} задача',
		few: 'ещё {count} задачи',
		many: 'ещё {count} задач',
	},
} as const;
