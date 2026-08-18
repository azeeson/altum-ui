import type {
	AccordionVariant,
	AccordionProps,
	AccordionItemProps,
	AccordionTriggerProps,
	AccordionContentProps,
} from './Accordion.types';
export type {
	AccordionVariant,
	AccordionProps,
	AccordionItemProps,
	AccordionTriggerProps,
	AccordionContentProps,
} from './Accordion.types';

import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useId,
	useMemo,
} from 'react';
import styles from './Accordion.module.css';
import {Collapse} from '../Collapse/Collapse';
import {Box} from '../Box/Box';
import {handleVerticalTriggerKeyDown} from '../../utils/keyboard';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';

interface AccordionContextValue {
	openIds: string[];
	toggle: (value: string) => void;
	multiple: boolean;
	baseId: string;
	variant: AccordionVariant;
}

interface AccordionItemContextValue {
	value: string;
	disabled: boolean;
	isOpen: boolean;
	triggerId: string;
	panelId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
	const context = useContext(AccordionContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Accordion`);
	}
	return context;
}

function useAccordionItemContext(component: string): AccordionItemContextValue {
	const context = useContext(AccordionItemContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Accordion.Item`);
	}
	return context;
}

/**
 * Корневой контейнер аккордеона: состояние открытых секций + chrome.
 *
 * @component
 * @example
 * <Accordion multiple defaultOpenIds={['delivery']}>
 *   <Accordion.Item value="delivery">
 *     <Accordion.Trigger>Доставка</Accordion.Trigger>
 *     <Accordion.Content>Бесплатно от 3000 ₽</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(
	{
		children,
		multiple = false,
		variant = 'bordered',
		defaultOpenIds,
		openIds: controlledOpenIds,
		onOpenChange,
		className,
		...rest
	},
	ref,
) {
	const baseId = useId();
	const resolvedVariant: AccordionVariant = variant;
	const [openIds, setOpenIds] = useControlledStateWithCallback(
		controlledOpenIds,
		defaultOpenIds ?? [],
		onOpenChange,
	);

	const toggle = useCallback((value: string) => {
		const next = new Set(openIds);
		if (next.has(value)) {
			next.delete(value);
		} else {
			if (!multiple) next.clear();
			next.add(value);
		}
		setOpenIds(Array.from(next));
	}, [multiple, openIds, setOpenIds]);

	const contextValue = useMemo<AccordionContextValue>(() => ({
		openIds,
		toggle,
		multiple,
		baseId,
		variant: resolvedVariant,
	}), [
		openIds,
		toggle,
		multiple,
		baseId,
		resolvedVariant
	]);

	return (
		<AccordionContext.Provider value={contextValue}>
			<div
				ref={ref}
				className={cn(styles.accordion, styles[resolvedVariant], className)}
				data-variant={resolvedVariant}
				{...rest}
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
});

/**
 * Секция аккордеона (`value` + опциональный `disabled`).
 *
 * @component
 */
const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
	{
		value,
		disabled = false,
		className,
		children,
		...rest
	},
	ref,
) {
	const {openIds, baseId, variant} = useAccordionContext('Accordion.Item');
	const isOpen = openIds.includes(value) && !disabled;

	const itemValue = useMemo<AccordionItemContextValue>(() => ({
		value,
		disabled,
		isOpen,
		triggerId: `${baseId}-trigger-${value}`,
		panelId: `${baseId}-panel-${value}`,
	}), [
		value,
		disabled,
		isOpen,
		baseId
	]);

	const itemClassName = cn(
		styles.accordionItem,
		disabled ? styles.disabled : '',
		className,
	);

	return (
		<AccordionItemContext.Provider value={itemValue}>
			{variant === 'flush' ? (
				<div
					ref={ref}
					className={itemClassName}
					{...rest}
				>
					{children}
				</div>
			) : (
				<Box
					ref={ref}
					variant='outlined'
					border
					shadow='none'
					padding='none'
					radius='md'
					className={itemClassName}
					{...rest}
				>
					{children}
				</Box>
			)}
		</AccordionItemContext.Provider>
	);
});

/**
 * Кнопка заголовка секции (внутри `h3` для иерархии заголовков).
 *
 * @component
 */
const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
	{
		className,
		children,
		onClick,
		onKeyDown,
		type = 'button',
		headingLevel: Heading = 'h3',
		...rest
	},
	ref,
) {
	const {toggle} = useAccordionContext('Accordion.Trigger');
	const {value, disabled, isOpen, triggerId, panelId} = useAccordionItemContext('Accordion.Trigger');

	const handleInternalKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		const root = event.currentTarget.closest(`.${styles.accordion}`);
		const triggers = Array.from(
			root?.querySelectorAll<HTMLButtonElement>(
				`:scope > .${styles.accordionItem} button.${styles.accordionTrigger}:not(:disabled)`,
			) ?? [],
		);
		const currentIndex = triggers.indexOf(event.currentTarget);
		handleVerticalTriggerKeyDown(event, triggers, currentIndex, () => {
			if (!disabled) toggle(value);
		});
	};

	return (
		<Heading className={styles.accordionHeading}>
			<button
				ref={ref}
				type={type}
				id={triggerId}
				className={cn(styles.accordionTrigger, className)}
				disabled={disabled}
				{...rest}
				aria-expanded={isOpen}
				aria-controls={panelId}
				onClick={composeEventHandlers(onClick, () => {
					if (disabled) return;
					toggle(value);
				})}
				onKeyDown={composeEventHandlers(onKeyDown, handleInternalKeyDown)}
			>
				<span>
					{children}
				</span>
				<IconChevronDown
					className={cn(styles.accordionIcon, isOpen ? styles.open : '')}
					size='1em'
					aria-hidden
				/>
			</button>
		</Heading>
	);
});

/**
 * Панель содержимого секции (анимация через `Collapse`).
 *
 * @component
 */
const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
	{
		className,
		children,
		...rest
	},
	ref,
) {
	const {disabled, isOpen, triggerId, panelId} = useAccordionItemContext('Accordion.Content');

	return (
		<Collapse open={isOpen && !disabled} className={styles.accordionContent}>
			<div
				ref={ref}
				className={cn(styles.contentInner, className)}
				{...rest}
				id={panelId}
				role='region'
				aria-labelledby={triggerId}
			>
				{children}
			</div>
		</Collapse>
	);
});

AccordionRoot.displayName = 'Accordion';
AccordionItem.displayName = 'Accordion.Item';
AccordionTrigger.displayName = 'Accordion.Trigger';
AccordionContent.displayName = 'Accordion.Content';

type AccordionComponent = React.ForwardRefExoticComponent<
	AccordionProps & React.RefAttributes<HTMLDivElement>
> & {
	Item: typeof AccordionItem;
	Trigger: typeof AccordionTrigger;
	Content: typeof AccordionContent;
};

/**
 * Вертикальный список раскрывающихся секций (составной API: Item / Trigger / Content).
 *
 * @component
 * @example
 * <Accordion multiple variant="flush">
 *   <Accordion.Item value="1">
 *     <Accordion.Trigger>Доставка</Accordion.Trigger>
 *     <Accordion.Content>Бесплатно от 3000 ₽</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="2" disabled>
 *     <Accordion.Trigger>Возврат</Accordion.Trigger>
 *     <Accordion.Content>…</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
}) as AccordionComponent;
