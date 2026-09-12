import type {
	ActionListItem,
	ActionListHandle,
	ActionListProps,
} from './ActionList.types';
export type {
	ActionListItem,
	ActionListGroup,
	ActionListHandle,
	ActionListProps,
} from './ActionList.types';

import React, {
	forwardRef,
	useId,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {Listbox, type ListboxGroup, type ListboxHandle, type ListboxOption} from '../Listbox/Listbox';
import {handleListHighlightKeyDown} from '../../utils/keyboard';
import {filterListboxOptions, getListboxOptionDomId} from '../../utils/listboxOptions';
import {cn} from '../../utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {FieldBaseIcon} from '../../base/FieldBase';
import {TextField} from '../TextField/TextField';
import {IconSearch} from '../../icons/icons/IconSearch';
import styles from './ActionList.module.css';

function itemText(item: ActionListItem): string {
	const label = item.textValue
		?? (typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : item.id);
	return [label, ...(item.keywords ?? []), typeof item.description === 'string' ? item.description : ''].join(' ');
}

function renderItemLabel(item: ActionListItem): React.ReactNode {
	return (
		<>
			{item.icon && (
				<span className={styles.icon} aria-hidden>
					{item.icon}
				</span>
			)}
			<span className={styles.itemBody}>
				<span className={styles.itemLabel}>
					{item.label}
				</span>
				{item.description != null && (
					<span className={styles.itemDescription}>
						{item.description}
					</span>
				)}
			</span>
			{item.shortcut != null && (
				<span className={styles.shortcut}>
					{item.shortcut}
				</span>
			)}
		</>
	);
}

/**
 * Список действий с поиском, группами и клавиатурной навигацией.
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
export const ActionList = forwardRef<ActionListHandle, ActionListProps>(function ActionList(
	{
		items,
		groups,
		className = '',
		id: providedId,
		'aria-label': ariaLabelProp,
		onAction,
		onHighlightChange,
		filterable = false,
		filterPlaceholder,
		query: queryProp,
		onQueryChange,
		emptyText,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const generatedId = useId();
	const listId = providedId ?? generatedId;
	const listRef = useRef<ListboxHandle>(null);
	const [query, setQuery] = useControlledStateWithCallback(queryProp, '', onQueryChange);
	const [highlight, setHighlight] = useState(-1);
	const listboxOptions = useMemo((): ListboxOption[] => filterListboxOptions({
		query,
		options: items.map((item) => ({
			value: item.id,
			label: renderItemLabel(item),
			textValue: itemText(item),
			disabled: item.disabled,
			groupId: item.groupId,
			buttonProps: item.buttonProps,
		})),
	}), [items, query]);
	const listboxGroups = useMemo((): ListboxGroup[] | undefined => {
		if (!groups?.length) return undefined;
		const used = new Set(
			listboxOptions.map((option) => option.groupId).filter((id): id is string => Boolean(id)),
		);
		return groups.filter((group) => used.has(group.id));
	}, [listboxOptions, groups]);
	const activateById = (itemId: string) => {
		const item = items.find((entry) => entry.id === itemId);
		if (!item || item.disabled) return undefined;
		item.onSelect?.();
		onAction?.(item);
		return item;
	};
	const updateHighlight = (index: number) => {
		setHighlight(index);
		onHighlightChange?.(index);
	};
	useImperativeHandle(ref, () => {
		const list = () => listRef.current;
		return {
			highlightNext: () => list()?.highlightNext(),
			highlightPrev: () => list()?.highlightPrev(),
			highlightFirst: () => list()?.highlightFirst(),
			highlightLast: () => list()?.highlightLast(),
			selectHighlighted: () => {
				const id = list()?.selectHighlighted();
				return id ? items.find((item) => item.id === id) : undefined;
			},
			getHighlightedIndex: () => list()?.getHighlightedIndex() ?? -1,
			getActiveDescendantId: () => list()?.getActiveDescendantId(),
			getListId: () => listId,
		};
	}, [items, listId]);
	const filterLabel = filterPlaceholder ?? t('actionList.filterPlaceholder');
	const nav = {
		onNext: () => listRef.current?.highlightNext(),
		onPrev: () => listRef.current?.highlightPrev(),
		onFirst: () => listRef.current?.highlightFirst(),
		onLast: () => listRef.current?.highlightLast(),
		onSelect: () => {
			const id = listboxOptions[highlight]?.value;
			if (id) activateById(id);
		},
	};

	return (
		<div
			className={cn(styles.root, className)}
			{...rest}
		>
			{filterable && (
				<div className={styles.filter}>
					<TextField
						type='search'
						size='sm'
						width='full'
						labelPlacement='none'
						keepPlaceholder
						label={filterLabel}
						placeholder={filterLabel}
						value={query}
						autoComplete='off'
						prefix={(
							<FieldBaseIcon>
								<IconSearch />
							</FieldBaseIcon>
						)}
						role='combobox'
						aria-expanded
						aria-controls={listId}
						aria-autocomplete='list'
						aria-activedescendant={highlight >= 0 ? getListboxOptionDomId(listId, highlight) : undefined}
						autoFocus
						onChange={(event) => setQuery(event.target.value)}
						onKeyDown={(event) => handleListHighlightKeyDown(event, nav)}
					/>
				</div>
			)}
			<Listbox
				ref={listRef}
				id={listId}
				className={styles.list}
				options={listboxOptions}
				groups={listboxGroups}
				navigation='highlight'
				highlightedIndex={highlight}
				onHighlightChange={updateHighlight}
				preventOptionMouseDown={filterable || queryProp !== undefined}
				multiline
				noOptionsText={emptyText ?? t('actionList.empty')}
				aria-label={ariaLabelProp ?? t('actionList.ariaLabel')}
				onSelect={activateById}
			/>
		</div>
	);
});

ActionList.displayName = 'ActionList';
