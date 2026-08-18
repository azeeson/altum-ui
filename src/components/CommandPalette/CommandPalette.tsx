import type {
	CommandPaletteRootProps,
	CommandPaletteInputProps,
	CommandPaletteListProps,
	CommandPaletteEmptyProps,
	CommandPaletteFooterProps,
} from './CommandPalette.types';
export type {
	CommandPaletteGroup,
	CommandPaletteItem,
	CommandPaletteRootProps,
	CommandPaletteInputProps,
	CommandPaletteListProps,
	CommandPaletteEmptyProps,
	CommandPaletteFooterProps,
} from './CommandPalette.types';

import React, {forwardRef, useCallback, useEffect, useId, useRef, useState} from 'react';
 
import {Box} from '../Box/Box';
import {ActionList, type ActionListHandle} from '../ActionList/ActionList';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {handleListHighlightKeyDown} from '../../utils/keyboard';
import {getListboxOptionDomId} from '../../utils/listboxOptions';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {fieldSurfaceClassName} from '../../base/FieldBase';
import styles from './CommandPalette.module.css';

function marker(displayName: string): React.FC<Record<string, unknown>> {
	const Component = () => null;
	Component.displayName = displayName;
	return Component;
}
export const CommandPaletteInput = marker('CommandPalette.Input');
export const CommandPaletteList = marker('CommandPalette.List');
export const CommandPaletteEmpty = marker('CommandPalette.Empty');
export const CommandPaletteFooter = marker('CommandPalette.Footer');

/**
 * Составная модальная палитра команд на `Overlay` (`variant="modal"`).
 * Список передаётся явно в `List` (группы `ActionList`), без автосбора шорткатов.
 *
 * @component
 * @example
 * <CommandPalette.Root open={open} onClose={close}><CommandPalette.Input /><CommandPalette.List><ActionList.Group id="main">...</ActionList.Group></CommandPalette.List></CommandPalette.Root>
 */
const CommandPaletteRoot = forwardRef<HTMLElement, CommandPaletteRootProps>(function CommandPaletteRoot(
	{open, onClose, onOpenChange, children, title: titleProp, className, id, style, onKeyDown, ...rest},
	ref,
) {
	const {t} = useLocale();
	const title = titleProp ?? t('commandPalette.title');
	const titleId = useId();
	const listId = useId();
	const listRef = useRef<ActionListHandle>(null);
	const [query, setQuery] = useState('');
	const [activeDescendant, setActiveDescendant] = useState<string | undefined>();
	const handleClose = () => {
		onClose();
		onOpenChange?.(false);
	};
	let input: CommandPaletteInputProps | undefined;
	let listChildren: React.ReactNode;
	let empty: React.ReactNode;
	let footer: React.ReactNode;
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		if (child.type === CommandPaletteInput) input = child.props as CommandPaletteInputProps;
		if (child.type === CommandPaletteList) listChildren = (child.props as CommandPaletteListProps).children;
		if (child.type === CommandPaletteEmpty) empty = (child.props as CommandPaletteEmptyProps).children;
		if (child.type === CommandPaletteFooter) footer = (child.props as CommandPaletteFooterProps).children;
	});
	useEffect(() => { if (!open) { setQuery(''); setActiveDescendant(undefined); } }, [open]);
	const handleHighlightChange = useCallback((index: number) => setActiveDescendant(index >= 0 ? getListboxOptionDomId(listId, index) : undefined), [listId]);

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='modal'
			open={open}
			onClose={handleClose}
			aria-labelledby={titleId}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<Box
					ref={contentRef}
					variant='floating'
					padding='none'
					id={id}
					{...rest}
					{...slotProps}
					className={cn(styles.panel, slotProps.className, className)}
					style={slotProps.style ? {
						...slotProps.style,
						...style
					} : style}
					onKeyDown={(event) => {
						onKeyDown?.(event);
						if (event.defaultPrevented) return;
						handleListHighlightKeyDown(event, {
							onNext: () => listRef.current?.highlightNext(),
							onPrev: () => listRef.current?.highlightPrev(),
							onFirst: () => listRef.current?.highlightFirst(),
							onLast: () => listRef.current?.highlightLast(),
							onSelect: () => { if (listRef.current?.selectHighlighted()) handleClose(); },
						});
					}}
				>
					<header className={styles.header}>
						<h2 id={titleId} className={styles.title}>
							{title}
						</h2>
						<input
							type='search'
							className={cn(fieldSurfaceClassName(), styles.search, input?.className)}
							value={query}
							placeholder={input?.placeholder ?? t('commandPalette.placeholder')}
							aria-label={input?.placeholder ?? t('commandPalette.placeholder')}
							role='combobox'
							aria-expanded={open}
							aria-controls={listId}
							aria-autocomplete='list'
							aria-activedescendant={activeDescendant}
							autoFocus={open}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</header>
					<ActionList.Root
						ref={listRef}
						id={listId}
						className={styles.list}
						onAction={() => handleClose()}
						onHighlightChange={handleHighlightChange}
					>
						<ActionList.Search
							query={query}
							onQueryChange={setQuery}
							visible={false}
						/>
						{listChildren}
						{empty != null && (
							<ActionList.Empty>
								{empty}
							</ActionList.Empty>
						)}
					</ActionList.Root>
					{footer != null && (
						<footer>
							{footer}
						</footer>
					)}
				</Box>
			)}
		</Overlay>
	);
});
CommandPaletteRoot.displayName = 'CommandPalette.Root';

type CommandPaletteComponent = React.ForwardRefExoticComponent<
	CommandPaletteRootProps & React.RefAttributes<HTMLElement>
> & {
	Root: typeof CommandPaletteRoot;
	Input: typeof CommandPaletteInput;
	List: typeof CommandPaletteList;
	Empty: typeof CommandPaletteEmpty;
	Footer: typeof CommandPaletteFooter;
};

export const CommandPalette = Object.assign(CommandPaletteRoot, {
	Root: CommandPaletteRoot,
	Input: CommandPaletteInput,
	List: CommandPaletteList,
	Empty: CommandPaletteEmpty,
	Footer: CommandPaletteFooter
}) as CommandPaletteComponent;
