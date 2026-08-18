import type {Messages} from './types';

/**
 * Встроенный словарь английского языка.
 */
export const en: Messages = {
	common: {
		close: 'Close',
		clear: 'Clear',
		collapse: 'Collapse',
	},

	calendar: {
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
		monthsShort: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		],
		weekdaysShort: [
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
			'Su'
		],
		prevMonth: 'Previous month',
		nextMonth: 'Next month',
		prevYear: 'Previous year',
		nextYear: 'Next year',
		prevYears: 'Previous years',
		nextYears: 'Next years',
		selectYear: 'Select year, currently {year}',
		selectMonth: 'Select month, currently {month}',
		monthsOfYear: 'Months {year}',
		yearsRange: 'Years {start}–{end}',
	},

	calendarBoard: {
		ariaLabel: 'Calendar board',
		prevPeriod: 'Previous period',
		nextPeriod: 'Next period',
		viewSwitchAria: 'Calendar view',
		views: {
			month: 'Month',
			week: 'Week',
			day: 'Day',
			year: 'Year',
		},
		scheduleAria: 'Schedule',
		allDay: 'All-day events',
		allDayShort: 'all day',
		dayWithTasks: '{day} {month}, tasks: {count}',
		dayWithoutTasks: '{day} {month}',
		moreTasks: '{count} more',
	},

	dayStrip: {
		ariaLabel: 'Day navigation',
		prev: 'Previous days',
		next: 'Next days',
		days: 'Days',
	},

	timePicker: {
		hours: 'Hours',
		minutes: 'Minutes',
	},

	dateRangePicker: {
		label: 'Period',
		start: 'From',
		end: 'To',
	},

	select: {
		removeItem: 'Remove {label}',
	},

	customSelect: {
		filterPlaceholder: 'Search...',
		noOptions: 'No results found',
	},

	listbox: {
		noOptions: 'No results found',
	},

	suggestField: {
		noOptions: 'No results found',
	},

	sheet: {
		ariaLabel: 'Sheet',
	},

	modal: {
		ariaLabel: 'Dialog',
	},

	confirmDialog: {
		confirm: 'Confirm',
		cancel: 'Cancel',
	},

	table: {
		expandColumn: 'Expand',
		selectAll: 'Select all rows',
		selectRow: 'Select row {id}',
		resizeColumn: 'Resize {header}',
		emptyTitle: 'No data',
		rowActions: 'Row actions',
	},

	pagination: {
		ariaLabel: 'Pagination',
		prev: 'Previous page',
		next: 'Next page',
		page: 'Page {page}',
		summary: '{start}–{end} of {total}',
		pageSizeLabel: 'Per page',
		pageSizeAria: 'Page size',
	},

	sortable: {
		moveUp: 'Move up',
		moveDown: 'Move down',
		moved: 'Position {position} of {total}: item moved',
		dragItem: 'Drag item',
	},

	upload: {
		dropHint: 'Drop files here or',
		choose: 'browse',
		selectedCount: 'Selected files: {count}',
		release: 'Release to upload',
	},

	imageCrop: {
		title: 'Crop image',
		confirm: 'Apply',
		cancel: 'Cancel',
		choose: 'Choose an image',
		hint: 'Drag the frame or scale from the corners',
		loadError: 'Failed to load image',
		cropError: 'Failed to crop image',
		exportError: 'Failed to export image',
		scaleHandle: 'Scale {corner}',
	},

	imageGallery: {
		empty: 'No images',
		prev: 'Previous image',
		next: 'Next image',
		imageN: 'Image {index}',
	},

	imageLightbox: {
		close: 'Close gallery',
		ariaLabel: 'Image gallery',
	},

	sidebar: {
		ariaLabel: 'Sidebar navigation',
		openMenu: 'Open menu',
		expand: 'Expand',
		collapse: 'Collapse',
		expandSidebar: 'Expand sidebar',
		collapseSidebar: 'Collapse sidebar',
	},

	password: {
		reveal: 'Show password',
		hide: 'Hide password',
		strength: {
			weak: 'Weak',
			fair: 'Fair',
			good: 'Good',
			strong: 'Strong',
		},
	},

	numberField: {
		group: 'Change value',
		decrement: 'Decrease',
		increment: 'Increase',
	},

	pinInput: {
		ariaLabel: 'Confirmation code',
		digit: 'Digit {index}',
	},

	searchField: {
		label: 'Search',
	},

	slider: {
		ariaLabel: 'Slider',
		from: 'From',
		to: 'To',
	},

	rating: {
		ariaLabel: 'Rating',
		value: '{score} of {max}',
	},

	actionList: {
		filterPlaceholder: 'Filter…',
		empty: 'No results found',
		ariaLabel: 'Action list',
	},

	commandPalette: {
		placeholder: 'Search commands…',
		title: 'Command palette',
	},

	pullToRefresh: {
		pull: 'Pull to refresh',
		release: 'Release',
		refreshing: 'Refreshing…',
	},

	timeline: {
		hide: 'Hide',
		more: 'Show more',
	},

	spinner: {
		typing: 'Typing',
		loading: 'Loading',
	},

	steps: {
		ariaLabel: 'Progress steps',
	},

	segmentedControl: {
		ariaLabel: 'Segmented control',
	},

	bubble: {
		expand: 'More',
		collapse: 'Collapse',
		reactions: 'Reactions',
	},

	chip: {
		remove: 'Remove',
		groupChips: 'Chips',
		groupTags: 'Tags',
	},

	fileList: {
		remove: 'Remove',
		retry: 'Retry',
	},

	virtualList: {
		ariaLabel: 'List',
	},

	skipLink: {
		label: 'Skip to content',
	},

	overflowActions: {
		title: 'Actions',
		ariaLabel: 'Actions',
		more: 'More actions',
	},

	overflowGroup: {
		title: 'More',
		ariaLabel: 'Group',
		more: 'Show more',
	},

	buttonGroup: {
		ariaLabel: 'Button group',
	},

	dropdownMenu: {
		mobileTitle: 'Menu',
		ariaLabel: 'Menu',
	},

	contextMenu: {
		ariaLabel: 'Context menu',
	},

	charts: {
		donut: 'Donut chart',
		bar: 'Bar chart',
	},
};
