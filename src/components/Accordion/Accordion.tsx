import type {
	AccordionProps,
	AccordionItemProps,
} from './Accordion.types';
export type {
	AccordionVariant,
	AccordionProps,
	AccordionItemProps,
} from './Accordion.types';

import React, {
	createContext,
	forwardRef,
	useId,
} from 'react';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './Accordion.module.css';
import {handleVerticalTriggerKeyDown} from '../../utils/keyboard';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {cn} from '../../utils/cn';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {Collapse} from '../Collapse/Collapse';

interface AccordionContextValue {
	openIds: string[];
	toggle: (value: string) => void;
	baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Корневой контейнер аккордеона: состояние открытых секций + chrome.
 *
 * @component
 * @example
 * <Accordion multiple defaultOpenIds={['delivery']}>
 *   <Accordion.Item value="delivery" title="Доставка">
 *     Бесплатно от 3000 ₽
 *   </Accordion.Item>
 * </Accordion>
 */
const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(
	{
		children,
		multiple = false,
		variant = 'flush',
		defaultOpenIds,
		openIds: controlledOpenIds,
		onOpenChange,
		className,
		...rest
	},
	ref,
) {
	const baseId = useId();
	const [openIds, setOpenIds] = useControlledStateWithCallback(
		controlledOpenIds,
		defaultOpenIds ?? [],
		onOpenChange,
	);

	return (
		<AccordionContext.Provider
			value={{
				openIds,
				baseId,
				toggle: (value) => {
					const open = openIds.includes(value);
					setOpenIds(open
						? openIds.filter((id) => id !== value)
						: multiple ? [...openIds, value] : [value]);
				},
			}}
		>
			<div
				ref={ref}
				className={cn(styles.accordion, styles[variant], className)}
				{...rest}
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
});

/**
 * Секция аккордеона: `title` — заголовок-триггер, `children` — панель.
 *
 * @component
 */
const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
	{
		value,
		disabled = false,
		className,
		title,
		headingLevel: Heading = 'h3',
		children,
		...rest
	},
	ref,
) {
	const {openIds, baseId, toggle} = useRequiredContext(
		AccordionContext,
		'Accordion.Item должен использоваться внутри Accordion',
	);
	const isOpen = openIds.includes(value) && !disabled;
	const triggerId = `${baseId}-trigger-${value}`;
	const panelId = `${baseId}-panel-${value}`;

	return (
		<div
			ref={ref}
			className={cn(styles.item, disabled ? styles.disabled : '', className)}
			{...rest}
		>
			<Heading className={styles.heading}>
				<button
					type='button'
					id={triggerId}
					className={cn(unstyled.control, styles.trigger)}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={() => {
						if (!disabled) toggle(value);
					}}
					onKeyDown={(event) => {
						const root = event.currentTarget.closest(`.${styles.accordion}`);
						const triggers = Array.from(
							root?.querySelectorAll<HTMLButtonElement>(
								`:scope > .${styles.item} .${styles.trigger}:not(:disabled)`,
							) ?? [],
						);
						handleVerticalTriggerKeyDown(
							event,
							triggers,
							triggers.indexOf(event.currentTarget),
							() => {
								if (!disabled) toggle(value);
							},
						);
					}}
				>
					{title}
					<IconChevronDown
						className={styles.icon}
						size='1em'
						aria-hidden
					/>
				</button>
			</Heading>
			<Collapse open={isOpen}>
				<div
					className={styles.panelInner}
					id={panelId}
					role='region'
					aria-labelledby={triggerId}
				>
					{children}
				</div>
			</Collapse>
		</div>
	);
});

AccordionRoot.displayName = 'Accordion';
AccordionItem.displayName = 'Accordion.Item';

type AccordionComponent = React.ForwardRefExoticComponent<
	AccordionProps & React.RefAttributes<HTMLDivElement>
> & {
	Item: typeof AccordionItem;
};

/**
 * Вертикальный список раскрывающихся секций.
 *
 * @component
 * @example
 * <Accordion multiple variant="flush">
 *   <Accordion.Item value="1" title="Доставка">
 *     Бесплатно от 3000 ₽
 *   </Accordion.Item>
 *   <Accordion.Item value="2" title="Возврат" disabled>
 *     …
 *   </Accordion.Item>
 * </Accordion>
 */
export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
}) as AccordionComponent;
