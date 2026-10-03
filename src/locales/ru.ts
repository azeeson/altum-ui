/**
 * Встроенный словарь русского языка (эталон для типа {@link Messages}).
 */
import {ruSlice as common} from './slices/common.ru';
import {ruSlice as calendar} from './slices/calendar.ru';
import {ruSlice as calendarBoard} from './slices/calendarBoard.ru';
import {ruSlice as dayStrip} from './slices/dayStrip.ru';
import {ruSlice as timeField} from './slices/timeField.ru';
import {ruSlice as dateRangeField} from './slices/dateRangeField.ru';
import {ruSlice as select} from './slices/select.ru';
import {ruSlice as customSelect} from './slices/customSelect.ru';
import {ruSlice as listbox} from './slices/listbox.ru';
import {ruSlice as suggestField} from './slices/suggestField.ru';
import {ruSlice as sheet} from './slices/sheet.ru';
import {ruSlice as modal} from './slices/modal.ru';
import {ruSlice as confirmDialog} from './slices/confirmDialog.ru';
import {ruSlice as table} from './slices/table.ru';
import {ruSlice as pagination} from './slices/pagination.ru';
import {ruSlice as sortable} from './slices/sortable.ru';
import {ruSlice as upload} from './slices/upload.ru';
import {ruSlice as imageCrop} from './slices/imageCrop.ru';
import {ruSlice as imageGallery} from './slices/imageGallery.ru';
import {ruSlice as imageLightbox} from './slices/imageLightbox.ru';
import {ruSlice as sidebar} from './slices/sidebar.ru';
import {ruSlice as password} from './slices/password.ru';
import {ruSlice as numberField} from './slices/numberField.ru';
import {ruSlice as pinInput} from './slices/pinInput.ru';
import {ruSlice as searchField} from './slices/searchField.ru';
import {ruSlice as slider} from './slices/slider.ru';
import {ruSlice as rating} from './slices/rating.ru';
import {ruSlice as actionList} from './slices/actionList.ru';
import {ruSlice as commandPalette} from './slices/commandPalette.ru';
import {ruSlice as pullToRefresh} from './slices/pullToRefresh.ru';
import {ruSlice as spinner} from './slices/spinner.ru';
import {ruSlice as steps} from './slices/steps.ru';
import {ruSlice as bubble} from './slices/bubble.ru';
import {ruSlice as chip} from './slices/chip.ru';
import {ruSlice as fileList} from './slices/fileList.ru';
import {ruSlice as virtualList} from './slices/virtualList.ru';
import {ruSlice as skipLink} from './slices/skipLink.ru';
import {ruSlice as overflow} from './slices/overflow.ru';
import {ruSlice as buttonGroup} from './slices/buttonGroup.ru';
import {ruSlice as menu} from './slices/menu.ru';

export const ru = {
	common,
	calendar,
	calendarBoard,
	dayStrip,
	timeField,
	dateRangeField,
	select,
	customSelect,
	listbox,
	suggestField,
	sheet,
	modal,
	confirmDialog,
	table,
	pagination,
	sortable,
	upload,
	imageCrop,
	imageGallery,
	imageLightbox,
	sidebar,
	password,
	numberField,
	pinInput,
	searchField,
	slider,
	rating,
	actionList,
	commandPalette,
	pullToRefresh,
	spinner,
	steps,
	bubble,
	chip,
	fileList,
	virtualList,
	skipLink,
	overflow,
	buttonGroup,
	menu,
} as const;
