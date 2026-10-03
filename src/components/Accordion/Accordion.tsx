import type {
	AccordionProps,
	AccordionItemProps,
} from './Accordion.types';
export type {
	AccordionVariant,
	AccordionProps,
	AccordionItemData,
	AccordionItemProps,
} from './Accordion.types';

import {
	createContext,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	type KeyboardEvent,
} from 'react';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import styles from './Accordion.module.css';
import {uEv, uRef} from '../../core/utils/bundle';
import {cn} from '../../core/utils/cn';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';

interface AccordionConfig {
	/** Общий `name` для эксклюзивного режима. Без него секции открываются независимо. */
	name?: string;
	defaultOpen: ReadonlySet<string>;
}

const EMPTY_DEFAULT_OPEN: ReadonlySet<string> = new Set();

const AccordionStaticContext = createContext<AccordionConfig>({
	name: undefined,
	defaultOpen: EMPTY_DEFAULT_OPEN,
});

/** Узел уже получил начальный `open`. Повторный ref не возвращает секцию. */
const initialOpenApplied = new WeakSet<HTMLDetailsElement>();

const blockDisabledKeys = (event: KeyboardEvent<HTMLElement>) => {
	if (event.currentTarget.getAttribute('aria-disabled') !== 'true') return;
	if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
};

function readOpenIds(root: HTMLElement): string[] {
	const ids: string[] = [];
	root.querySelectorAll('details[data-accordion-item]').forEach((node) => {
		if (!(node instanceof HTMLDetailsElement) || !node.open) return;
		if (node.closest('[data-accordion]') !== root) return;
		const id = node.getAttribute('data-value');
		if (id) ids.push(id);
	});
	return ids;
}

/**
 * Вертикальный список раскрывающихся секций на нативных `<details>`.
 * При `multiple={false}` общий атрибут `name` закрывает предыдущую секцию силами браузера.
 * Плоский `items` и compound `Accordion.Item` можно смешивать.
 *
 * @component
 * @example
 * <Accordion
 *   multiple
 *   defaultOpenIds={['delivery']}
 *   items={[{value: 'delivery', title: 'Доставка', children: 'Бесплатно от 3000 ₽'}]}
 * />
 */
function AccordionRoot({
	children,
	items,
	multiple = false,
	variant = 'flush',
	defaultOpenIds,
	onOpenChange,
	className,
	rootRef,
	...rest
}: AccordionProps) {
	const groupName = useId().replace(/:/g, '');
	const name = multiple ? undefined : groupName;
	const openKey = defaultOpenIds?.join('\0') ?? '';
	const config = useMemo<AccordionConfig>(() => ({
		name,
		defaultOpen: openKey.length > 0 ? new Set(openKey.split('\0')) : EMPTY_DEFAULT_OPEN,
	}), [name, openKey]);
	const nodeRef = useRef<HTMLDivElement>(null);
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	useEffect(() => {
		const root = nodeRef.current;
		if (!root) return undefined;
		const handleToggle = (event: Event) => {
			const target = event.target;
			if (!(target instanceof HTMLDetailsElement)) return;
			if (!target.hasAttribute('data-accordion-item')) return;
			if (target.closest('[data-accordion]') !== root) return;
			onOpenChangeRef.current?.(readOpenIds(root));
		};
		root.addEventListener('toggle', handleToggle);
		return () => root.removeEventListener('toggle', handleToggle);
	}, []);

	return (
		<AccordionStaticContext.Provider value={config}>
			<div
				{...rest}
				ref={uRef(rootRef, nodeRef)}
				data-accordion=''
				data-variant={variant}
				className={cn(utilities.fColumn, styles.accordion, className)}
			>
				{items?.map((item) => (
					<AccordionItem
						key={item.value}
						value={item.value}
						title={item.title}
						disabled={item.disabled}
						headingLevel={item.headingLevel}
					>
						{item.children}
					</AccordionItem>
				))}
				{children}
			</div>
		</AccordionStaticContext.Provider>
	);
}

/**
 * Секция аккордеона: `title` — заголовок в `<summary>`, `children` — панель.
 *
 * @component
 */
function AccordionItem({
	value,
	disabled = false,
	className,
	title,
	headingLevel: Heading = 'h3',
	children,
	rootRef,
	...rest
}: AccordionItemProps) {
	const {name, defaultOpen} = useContext(AccordionStaticContext);
	const startsOpen = defaultOpen.has(value) && !disabled;
	const headingId = useId().replace(/:/g, '');
	const panelId = `${headingId}-panel`;
	const bindDetails = (node: HTMLDetailsElement | null) => {
		if (!node || initialOpenApplied.has(node)) return;
		initialOpenApplied.add(node);
		if (startsOpen) node.open = true;
	};

	return (
		<details
			{...rest}
			ref={uRef(rootRef, bindDetails)}
			name={name}
			data-accordion-item=''
			data-value={value}
			data-disabled={disabled ? '' : undefined}
			className={cn(styles.item, className)}
		>
			<summary
				className={cn(unstyled.control, styles.trigger)}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? -1 : undefined}
				onClick={disabled ? uEv(undefined, false, true) : undefined}
				onKeyDown={blockDisabledKeys}
			>
				<Heading
					id={headingId}
					className={styles.heading}
				>
					{title}
				</Heading>
				<IconChevronDown
					className={styles.icon}
					size='1em'
					aria-hidden
				/>
			</summary>
			<div
				className={styles.panelInner}
				id={panelId}
				role='region'
				aria-labelledby={headingId}
			>
				{children}
			</div>
		</details>
	);
}

type AccordionComponent = typeof AccordionRoot & {
	Item: typeof AccordionItem;
};

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
}) as AccordionComponent;
