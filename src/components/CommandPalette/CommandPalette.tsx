import type {CommandPaletteProps} from './CommandPalette.types';
export type {
	CommandPaletteGroup,
	CommandPaletteItem,
	CommandPaletteProps,
} from './CommandPalette.types';

import {forwardRef, useId} from 'react';
import {ActionList} from '../ActionList/ActionList';
import {Overlay} from '../Overlay/Overlay';
import {DialogBase} from '../../base/DialogBase';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import styles from './CommandPalette.module.css';

/**
 * Модальная палитра команд на `Overlay` (`variant="modal"`) и `DialogBase`.
 * Список и фильтр — `ActionList` (`filterable`).
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
export const CommandPalette = forwardRef<HTMLElement, CommandPaletteProps>(function CommandPalette(
	{
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
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const titleId = useId();

	return (
		<Overlay
			ref={ref}
			variant='modal'
			open={open}
			onOpenChange={onOpenChange}
			aria-labelledby={titleId}
		>
			<DialogBase.Surface
				variant='floating'
				padding='none'
				radius='lg'
				onClose={() => onOpenChange(false)}
				titleId={titleId}
				id={id}
				className={cn(styles.panel, className)}
				style={style}
				{...rest}
			>
				<DialogBase.Title as='h2' className={styles.title}>
					{titleProp ?? t('commandPalette.title')}
				</DialogBase.Title>
				<ActionList
					key={open ? 'open' : 'closed'}
					className={styles.list}
					items={items}
					groups={groups}
					filterable
					filterPlaceholder={placeholder ?? t('commandPalette.placeholder')}
					emptyText={emptyText}
					onAction={(item) => {
						onAction?.(item);
						onOpenChange(false);
					}}
				/>
				{footer != null ? (
					<DialogBase.Footer className={styles.footer}>
						{footer}
					</DialogBase.Footer>
				) : null}
			</DialogBase.Surface>
		</Overlay>
	);
});

CommandPalette.displayName = 'CommandPalette';
