import type {
	ActionListItem as ActionListItemData,
	ActionListGroup as ActionListGroupData,
	ActionListHandle,
	ActionListRootProps,
	ActionListSearchProps,
	ActionListGroupProps,
	ActionListGroupLabelProps,
	ActionListEmptyProps,
} from './ActionList.types';
export type {
	ActionListHandle,
	ActionListRootProps,
	ActionListSearchProps,
	ActionListGroupProps,
	ActionListGroupLabelProps,
	ActionListEmptyProps,
} from './ActionList.types';

/* eslint-disable @stylistic/max-len -- Длинное выражение колбэка остаётся читаемым как один предикат. */
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {Listbox, type ListboxGroup, type ListboxHandle, type ListboxOption} from '../Listbox/Listbox';
import {handleListHighlightKeyDown} from '../../utils/keyboard';
import {getListboxOptionDomId, moveListboxHighlight} from '../../utils/listboxOptions';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {fieldSurfaceClassName} from '../../base/FieldBase';
import styles from './ActionList.module.css';

type ActionListChild = React.ReactElement<ActionListGroupProps | ActionListSearchProps | ActionListEmptyProps>;

function getItemText(item: ActionListItemData): string {
	if (item.textValue) return item.textValue;
	return typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : item.id;
}

function matchesQuery(item: ActionListItemData, query: string): boolean {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return true;
	return [getItemText(item), ...(item.keywords ?? []), typeof item.description === 'string' ? item.description : '']
		.join(' ')
		.toLowerCase()
		.includes(normalized);
}

function renderItemLabel(item: ActionListItemData): React.ReactNode {
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

function marker(displayName: string): React.FC<Record<string, unknown>> {
	const Component = () => null;
	Component.displayName = displayName;
	return Component;
}

export const ActionListSearch = marker('ActionList.Search');
export const ActionListGroup = marker('ActionList.Group');
export const ActionListGroupLabel = marker('ActionList.GroupLabel');
export const ActionListItem = marker('ActionList.Item');
export const ActionListSeparator = marker('ActionList.Separator');
export const ActionListEmpty = marker('ActionList.Empty');

function extractItems(children: React.ReactNode): ActionListItemData[] {
	return React.Children.toArray(children).flatMap((child) => {
		if (!React.isValidElement(child)) return [];
		if (child.type === ActionListItem) return [child.props as ActionListItemData];
		return [];
	});
}

function extractGroups(children: React.ReactNode): {
	groups: ActionListGroupData[];
	search?: ActionListSearchProps;
	empty?: React.ReactNode;
} {
	const result: ActionListGroupData[] = [];
	let search: ActionListSearchProps | undefined;
	let empty: React.ReactNode;
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		const element = child as ActionListChild;
		if (element.type === ActionListSearch) {
			search = element.props as ActionListSearchProps;
		} else if (element.type === ActionListGroup) {
			const group = element.props as ActionListGroupProps;
			const label = React.Children.toArray(group.children).find(
				(item) => React.isValidElement(item) && item.type === ActionListGroupLabel,
			) as React.ReactElement<ActionListGroupLabelProps> | undefined;
			result.push({
				id: group.id,
				label: label ? String(label.props.children) : group.id,
				items: extractItems(group.children),
			});
		} else if (element.type === ActionListEmpty) {
			empty = (element.props as ActionListEmptyProps).children;
		}
	});
	return {
		groups: result,
		search,
		empty
	};
}

/**
 * Составной список действий с поиском, группами и клавиатурной навигацией.
 *
 * @component
 * @example
 * <ActionList.Root><ActionList.Group id="actions"><ActionList.GroupLabel>Действия</ActionList.GroupLabel><ActionList.Item id="add" label="Добавить" /></ActionList.Group></ActionList.Root>
 */
const ActionListRoot = forwardRef<ActionListHandle, ActionListRootProps>(function ActionListRoot(
	{
		children,
		className = '',
		id: providedId,
		'aria-label': ariaLabelProp,
		onAction,
		onHighlightChange,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const {groups, search, empty} = useMemo(() => extractGroups(children), [children]);
	const generatedId = useId();
	const listId = providedId ?? generatedId;
	const listRef = useRef<ListboxHandle>(null);
	const [internalQuery, setInternalQuery] = useState('');
	const [highlight, setHighlight] = useState(0);
	const query = search?.query ?? internalQuery;
	const {
		visible: searchVisible = true,
		placeholder: searchPlaceholder,
		className: searchClassName,
		onChange: searchOnChange,
		'aria-label': searchAriaLabel,
		query: _ignoredQuery,
		onQueryChange: _ignoredOnQueryChange,
		...searchRest
	} = search ?? {};
	void _ignoredQuery;
	void _ignoredOnQueryChange;
	const setQuery = (next: string) => {
		search?.onQueryChange?.(next);
		if (search?.query === undefined) setInternalQuery(next);
	};
	const updateHighlight = useCallback((index: number) => {
		setHighlight(index);
		onHighlightChange?.(index);
	}, [onHighlightChange]);
	const flatItems = useMemo(() => groups.flatMap((group) => group.items
		.filter((item) => matchesQuery(item, query))
		.map((item) => ({
			item,
			group
		}))), [groups, query]);
	const listboxOptions = useMemo((): ListboxOption[] => flatItems.map(({item, group}) => ({
		value: item.id,
		label: renderItemLabel(item),
		textValue: getItemText(item),
		disabled: item.disabled,
		groupId: group.id,
		buttonProps: item.buttonProps,
	})), [flatItems]);
	const listboxGroups = useMemo((): ListboxGroup[] => {
		const seen = new Set<string>();
		const result: ListboxGroup[] = [];
		for (const {group} of flatItems) {
			if (seen.has(group.id)) continue;
			seen.add(group.id);
			result.push({
				id: group.id,
				label: group.label
			});
		}
		return result;
	}, [flatItems]);
	const activateById = useCallback((itemId: string) => {
		const entry = flatItems.find(({item}) => item.id === itemId);
		if (!entry || entry.item.disabled) return undefined;
		entry.item.onSelect?.();
		onAction?.(entry.item);
		return entry.item;
	}, [flatItems, onAction]);
	useEffect(() => {
		if (flatItems.length === 0) return updateHighlight(-1);
		if (highlight < 0 || highlight >= flatItems.length || flatItems[highlight]?.item.disabled) {
			updateHighlight(moveListboxHighlight(-1, flatItems.length, 1, {isDisabled: (index) => !!flatItems[index]?.item.disabled}));
		}
	}, [flatItems, highlight, updateHighlight]);
	useImperativeHandle(ref, () => ({
		highlightNext: () => listRef.current?.highlightNext(),
		highlightPrev: () => listRef.current?.highlightPrev(),
		highlightFirst: () => listRef.current?.highlightFirst(),
		highlightLast: () => listRef.current?.highlightLast(),
		selectHighlighted: () => {
			const entry = flatItems[listRef.current?.getHighlightedIndex() ?? highlight];
			return entry ? activateById(entry.item.id) : undefined;
		},
		getHighlightedIndex: () => listRef.current?.getHighlightedIndex() ?? -1,
		getActiveDescendantId: () => highlight >= 0 ? getListboxOptionDomId(listId, highlight) : undefined,
		getListId: () => listId,
	}), [
		activateById,
		flatItems,
		highlight,
		listId
	]);
	const activeDescendantId = highlight >= 0 ? getListboxOptionDomId(listId, highlight) : undefined;
	return (
		<div
			className={cn(styles.root, className)}
			{...rest}
			onKeyDown={composeEventHandlers(onKeyDown, (event) => handleListHighlightKeyDown(event, {
				onNext: () => listRef.current?.highlightNext(),
				onPrev: () => listRef.current?.highlightPrev(),
				onFirst: () => listRef.current?.highlightFirst(),
				onLast: () => listRef.current?.highlightLast(),
				onSelect: () => { const entry = flatItems[highlight]; if (entry) activateById(entry.item.id); },
			}))}
		>
			{search && searchVisible !== false && (
				<div className={styles.filter}>
					<input
						type='search'
						className={cn(fieldSurfaceClassName(), styles.filterInput, searchClassName)}
						value={query}
						placeholder={searchPlaceholder ?? t('actionList.filterPlaceholder')}
						aria-label={searchAriaLabel ?? searchPlaceholder ?? t('actionList.filterPlaceholder')}
						aria-controls={listId}
						aria-autocomplete='list'
						aria-activedescendant={activeDescendantId}
						onChange={composeEventHandlers(searchOnChange, (event) => {
							setQuery(event.target.value);
						})}
						{...searchRest}
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
				preventOptionMouseDown={!!search}
				multiline
				noOptionsText={typeof empty === 'string' ? empty : t('actionList.empty')}
				aria-label={ariaLabelProp ?? t('actionList.ariaLabel')}
				onSelect={activateById}
			/>
		</div>
	);
});

ActionListRoot.displayName = 'ActionList.Root';
export const ActionList = Object.assign(ActionListRoot, {
	Root: ActionListRoot,
	Search: ActionListSearch,
	Group: ActionListGroup,
	GroupLabel: ActionListGroupLabel,
	Item: ActionListItem,
	Separator: ActionListSeparator,
	Empty: ActionListEmpty,
});
