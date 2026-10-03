import type {CommandPaletteProps} from './CommandPalette.types';
export type {
	CommandPaletteGroup,
	CommandPaletteItem,
	CommandPaletteProps,
} from './CommandPalette.types';

import {useLayoutEffect, useMemo, useRef} from 'react';
import {Box} from '../Box/Box';
import {Listbox} from '../Listbox/Listbox';
import {Overlay} from '../Overlay/Overlay';
import {SearchField} from '../SearchField/SearchField';
import {Text} from '../Text/Text';
import {
	ACTION_LIST_EMPTY_ATTR,
	applyActionListFilter,
	buildActionListOptions,
	moveActionListHighlight,
} from '../ActionList/actionListFilter';
import {cn} from '../../core/utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import styles from './CommandPalette.module.css';
import overlayScrim from '../../styles/overlayScrim.module.css';
import utilities from '../../styles/utilities.module.css';
import {ruSlice as ru_commandPalette} from '../../locales/slices/commandPalette.ru';

const localeFallback = {
	commandPalette: ru_commandPalette,
};

/**
 * Модальная палитра команд на `Overlay` (`variant="modal"`).
 * Поверхность — `Box`. Подпись — `Text`, ей же назван диалог.
 * Фильтр и список — `SearchField` + `Listbox` (DOM-фильтр ActionList через `hidden`).
 *
 * @component
 * @example
 * <CommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   items={[{id: 'open', label: 'Открыть', groupId: 'files'}]}
 *   groups={[{id: 'files', label: 'Файлы'}]}
 * />
 */
export function CommandPalette({
	open,
	onOpenChange,
	items,
	groups,
	title: titleProp,
	placeholder,
	emptyText,
	footer,
	onAction,
	className,
	id,
	style,
	rootRef,
	...rest
}: CommandPaletteProps) {
	const {t} = useLocale(localeFallback);
	const paletteId = useFallbackId(id);
	const titleId = `${paletteId}-title`;
	const listId = `${paletteId}-list`;
	const title = titleProp ?? t('commandPalette.title');
	const filterLabel = placeholder ?? t('commandPalette.placeholder');
	const resolvedEmpty = emptyText ?? t('commandPalette.empty');
	const containerRef = useRef<HTMLDivElement>(null);
	const options = useMemo(() => buildActionListOptions(items), [items]);

	const activate = (itemId: string) => {
		const item = items.find((entry) => entry.id === itemId);
		if (!item) return;
		item.onSelect?.();
		onAction?.(item);
		onOpenChange(false);
	};

	useLayoutEffect(() => {
		if (!open) return;
		const container = containerRef.current;
		if (!container) return;
		const field = container.querySelector('input');
		applyActionListFilter(container, field?.value ?? '');
	}, [open, items]);

	return (
		<Overlay
			variant='modal'
			open={open}
			onOpenChange={onOpenChange}
			hostClassName={overlayScrim.host}
			aria-labelledby={titleId}
		>
			<Box
				rootRef={rootRef}
				variant='floating'
				radius='lg'
				id={paletteId}
				className={cn(styles.panel, className)}
				style={style}
				{...rest}
			>
				<Text
					as='p'
					id={titleId}
					weight='medium'
					className={styles.title}
				>
					{title}
				</Text>
				<div
					ref={containerRef}
					className={styles.body}
				>
					<SearchField
						wrapperClassName={styles.filter}
						size='sm'
						keepPlaceholder
						aria-label={filterLabel}
						placeholder={filterLabel}
						autoComplete='off'
						role='combobox'
						aria-expanded
						aria-controls={listId}
						aria-autocomplete='list'
						autoFocus
						onChange={(event) => {
							const container = containerRef.current;
							if (container) applyActionListFilter(container, event.target.value);
						}}
						onKeyDown={(event) => {
							const container = containerRef.current;
							if (!container) return;
							moveActionListHighlight(container, event);
						}}
					/>
					<Listbox
						id={listId}
						className={cn(utilities.scrollport, styles.list)}
						options={options}
						groups={groups}
						navigation='highlight'
						multiline
						virtualized={false}
						noOptionsText={resolvedEmpty}
						aria-label={title}
						onMouseDown={(event) => {
							const target = event.target;
							if (target instanceof Element && target.closest('[role="option"]')) {
								event.preventDefault();
							}
						}}
						onSelect={activate}
					/>
					{items.length > 0 ? (
						<p
							{...{[ACTION_LIST_EMPTY_ATTR]: ''}}
							className={styles.empty}
						>
							{resolvedEmpty}
						</p>
					) : null}
				</div>
				{footer != null ? (
					<footer className={styles.footer}>
						{footer}
					</footer>
				) : null}
			</Box>
		</Overlay>
	);
}
