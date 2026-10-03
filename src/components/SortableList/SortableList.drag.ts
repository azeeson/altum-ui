export const SORTABLE_INDEX = 'data-sortable-index';
export const SORTABLE_ID = 'data-sortable-id';
export const SORTABLE_HANDLE = 'data-sortable-handle';
export const SORTABLE_MOVE = 'data-sortable-move';

/** Кнопки и поля внутри строки не начинают перетаскивание, ручка — начинает. */
export const DRAG_IGNORE = `button:not([${SORTABLE_HANDLE}]), a, input, textarea, select, [data-no-drag]`;

export {
	beginSortableDrag,
	isReorderDragActive as isSortableDragActive,
	cancelReorderDrag as cancelSortableDrag,
} from '../../core/utils/dom';
