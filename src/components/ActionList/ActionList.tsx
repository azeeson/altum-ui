import type {ActionListItem, ActionListProps} from './ActionList.types';
export type {
	ActionListItem,
	ActionListSeparator,
	ActionListEntry,
	ActionListGroup,
	ActionListProps,
} from './ActionList.types';

import {
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import {Listbox} from '../Listbox/Listbox';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import {SearchField} from '../SearchField/SearchField';
import {
	ACTION_LIST_EMPTY_ATTR,
	applyActionListFilter,
	buildActionListOptions,
	isActionListItem,
	moveActionListHighlight,
} from './actionListFilter';
import styles from './ActionList.module.css';
import utilities from '../../styles/utilities.module.css';
import {ruSlice as ru_actionList} from '../../locales/slices/actionList.ru';

const localeFallback = {
	actionList: ru_actionList,
};

/**
 * Список действий с поиском, группами и клавиатурной навигацией.
 * Фильтр скрывает строки через `hidden` и не пересобирает `options`.
 *
 * @component
 * @example
 * <ActionList
 *   items={[{id: 'add', label: 'Добавить', groupId: 'actions'}]}
 *   groups={[{id: 'actions', label: 'Действия'}]}
 *   filterable
 *   onAction={handleAction}
 * />
 */
export function ActionList({
	items,
	groups,
	className,
	id: providedId,
	'aria-label': ariaLabelProp,
	onAction,
	onHighlightChange,
	filterable = false,
	filterPlaceholder,
	query,
	onQueryChange,
	emptyText,
	rootRef,
	...rest
}: ActionListProps) {
	const {t} = useLocale(localeFallback);
	const listId = useFallbackId(providedId);
	const containerRef = useRef<HTMLDivElement>(null);
	const onHighlightChangeRef = useRef(onHighlightChange);
	onHighlightChangeRef.current = onHighlightChange;
	const options = useMemo(() => buildActionListOptions(items), [items]);
	const activate = (itemId: string) => {
		const item = items.find((entry): entry is ActionListItem =>
			isActionListItem(entry) && entry.id === itemId);
		if (!item) return;
		item.onSelect?.();
		onAction?.(item);
	};
	const filterLabel = filterPlaceholder ?? t('actionList.filterPlaceholder');
	const resolvedEmpty = emptyText ?? t('actionList.empty');
	const filtersInDom = filterable || query !== undefined;

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container || !filtersInDom) return;
		const field = container.querySelector('input');
		const next = query !== undefined ? query : (field?.value ?? '');
		applyActionListFilter(container, next, onHighlightChangeRef.current);
	}, [filtersInDom, query, items]);

	return (
		<div
			{...rest}
			ref={uRef(rootRef, containerRef)}
			className={cn(styles.root, className)}
		>
			{filterable && (
				<SearchField
					wrapperClassName={styles.filter}
					size='sm'
					keepPlaceholder
					aria-label={filterLabel}
					placeholder={filterLabel}
					value={query}
					autoComplete='off'
					role='combobox'
					aria-expanded
					aria-controls={listId}
					aria-autocomplete='list'
					autoFocus
					onChange={(event) => {
						const container = containerRef.current;
						if (container) {
							applyActionListFilter(container, event.target.value, onHighlightChangeRef.current);
						}
						onQueryChange?.(event.target.value);
					}}
					onKeyDown={(event) => {
						const container = containerRef.current;
						if (!container) return;
						moveActionListHighlight(container, event, onHighlightChangeRef.current);
					}}
				/>
			)}
			<Listbox
				id={listId}
				className={cn(utilities.scrollport, styles.list)}
				options={options}
				groups={groups}
				navigation='highlight'
				multiline
				virtualized={filtersInDom ? false : undefined}
				noOptionsText={resolvedEmpty}
				aria-label={ariaLabelProp ?? t('actionList.ariaLabel')}
				onMouseDown={filtersInDom ? (event) => {
					const target = event.target;
					if (target instanceof Element && target.closest('[role="option"]')) {
						event.preventDefault();
					}
				} : undefined}
				onSelect={activate}
			/>
			{filtersInDom && items.length > 0 ? (
				<p
					{...{[ACTION_LIST_EMPTY_ATTR]: ''}}
					className={styles.empty}
				>
					{resolvedEmpty}
				</p>
			) : null}
		</div>
	);
}
