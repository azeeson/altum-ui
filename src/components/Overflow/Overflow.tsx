import type {
	OverflowDisplay,
	OverflowItemDomProps,
	OverflowItemProps,
	OverflowProps,
} from './Overflow.types';
export type {
	OverflowProps,
	OverflowItemProps,
	OverflowDisplay,
	OverflowFit,
	OverflowGap,
} from './Overflow.types';

import {
	isValidElement,
	useLayoutEffect,
	useRef,
	useState,
	type FC,
	type MutableRefObject,
	type ReactElement,
	type ReactNode,
	type Ref,
} from 'react';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {ActionSheetTrigger} from '../ActionSheetTrigger/ActionSheetTrigger';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Dropdown, type DropdownAlign} from '../Dropdown/Dropdown';
import {Menu} from '../Menu/Menu';
import {IconDots3} from '../../icons/icons/IconDots3';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_overflow} from '../../locales/slices/overflow.ru';
import type {ControlSize} from '../../types';
import {cn} from '../../core/utils/cn';
import {visitElementTree} from '../../core/utils/visitElementTree';
import styles from './Overflow.module.css';

const localeFallback = {
	overflow: ru_overflow,
};

type ParsedItem = {
	key: string;
	id: string;
	icon?: ReactNode;
	label: ReactNode;
	textValue?: string;
	disabled?: boolean;
	onSelect?: () => void;
	className?: string;
	dom: OverflowItemDomProps;
};

type MoreProps = {
	size: ControlSize;
	align?: DropdownAlign;
	mobileTitle?: ReactNode;
	ariaLabel: string;
	panelClassName?: string;
	triggerClassName?: string;
	children: ReactNode;
};

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
	if (typeof ref === 'function') {
		ref(node);
		return;
	}
	if (ref != null) {
		(ref as MutableRefObject<T | null>).current = node;
	}
}

/**
 * Маркер действия для `Overflow` (рендерит родитель).
 *
 * @component
 * @example
 * <Overflow.Item icon={<IconTrash />} label="Удалить" onSelect={…} />
 */
export const OverflowItem: FC<OverflowItemProps> = () => null;

function isItem(child: ReactElement): child is ReactElement<OverflowItemProps> {
	return child.type === OverflowItem;
}

function collect(children: ReactNode): {
	items: ParsedItem[];
	extra: ReactNode[]
} {
	const items: ParsedItem[] = [];
	const extra: ReactNode[] = [];
	visitElementTree(children, (child) => {
		if (!isItem(child)) {
			extra.push(child);
			return;
		}
		const {
			id,
			icon,
			label,
			textValue,
			disabled,
			onSelect,
			className,
			...dom
		} = child.props;
		const itemId = id ?? `action-${items.length}`;
		items.push({
			id: itemId,
			key: String(child.key ?? itemId),
			icon,
			label,
			textValue,
			disabled,
			onSelect,
			className,
			dom,
		});
	}, () => false);
	return {
		items,
		extra,
	};
}

function labelText(item: ParsedItem): string {
	if (typeof item.textValue === 'string' && item.textValue.length > 0) return item.textValue;
	if (typeof item.label === 'string' || typeof item.label === 'number') return String(item.label);
	return item.id;
}

function toItems(children: ReactNode): ReactElement[] {
	const list: ReactNode[] = Array.isArray(children)
		? children
		: children == null
			? []
			: [children];
	return list.filter((child): child is ReactElement => isValidElement(child));
}

function itemKey(item: ReactElement, index: number): string {
	if (item.key != null) return String(item.key);
	return `overflow-item-${index}`;
}

/** Сколько пунктов влезает в `width`, с кнопкой ⋯ и потолком `cap`. */
function fitCount(
	width: number,
	widths: number[],
	more: number,
	gap: number,
	cap?: number,
): number {
	const total = widths.length;
	if (total === 0 || width <= 0) return 0;

	const used = (count: number) => {
		let sum = 0;
		for (let i = 0; i < count; i += 1) sum += widths[i] ?? 0;
		return sum + gap * Math.max(0, count - 1);
	};

	const limit = cap === undefined
		? total
		: Math.min(total, Math.max(0, Math.floor(cap)));
	if (limit >= total && used(total) <= width) return total;

	for (let n = limit; n >= 0; n -= 1) {
		const showMore = n < total;
		const totalWidth = used(n) + (showMore ? (n > 0 ? gap : 0) + more : 0);
		if (totalWidth <= width) return n;
	}
	return 0;
}

function More({
	size,
	align = 'right',
	mobileTitle,
	ariaLabel,
	panelClassName,
	triggerClassName,
	children,
}: MoreProps) {
	return (
		<Dropdown
			align={align}
			widthMode='content'
			mobileTitle={mobileTitle}
			panelClassName={panelClassName}
			trigger={(props, ref) => (
				<ButtonIcon
					{...props}
					rootRef={ref}
					size={size}
					variant='ghost'
					icon={<IconDots3 />}
					aria-label={ariaLabel}
					className={cn(triggerClassName, props.className)}
				/>
			)}
		>
			{children}
		</Dropdown>
	);
}

function VisibleAction({
	item,
	display,
	size,
}: {
	item: ParsedItem;
	display: OverflowDisplay;
	size: ControlSize;
}) {
	const text = labelText(item);
	const shared = {
		...item.dom,
		type: 'button' as const,
		variant: 'ghost' as const,
		size,
		id: item.id,
		disabled: item.disabled,
		className: cn(styles.item, item.className),
		onClick: () => item.onSelect?.(),
	};

	if (display === 'icon' && item.icon != null) {
		return (
			<ButtonIcon
				{...shared}
				icon={item.icon}
				aria-label={
					item.dom['aria-label']
					?? (item.dom['aria-labelledby'] ? undefined : text)
				}
			/>
		);
	}

	return (
		<Button
			{...shared}
			prefix={item.icon}
		>
			{item.label}
		</Button>
	);
}

function Actions({
	items,
	visibleCount,
	display = 'icon-label',
	showOverflowTrigger: _showOverflowTrigger,
	size = 'sm',
	mobileTitle,
	className,
	style,
	'aria-label': ariaLabel,
	gap: _gap,
	fit,
	maxVisible,
	align: _align,
	moreLabel: _moreLabel,
	children: _children,
	longPress: _longPress,
	longPressMs: _longPressMs,
	moveThreshold: _moveThreshold,
	rootRef,
	...rest
}: OverflowProps & {items: ParsedItem[]}) {
	const {t} = useLocale(localeFallback);
	const actionsRef = useRef<HTMLDivElement | null>(null);
	const setRoot = (node: HTMLDivElement | null) => {
		actionsRef.current = node;
		assignRef(rootRef, node);
	};
	const explicitLimit = visibleCount !== undefined && Number.isFinite(visibleCount)
		? Math.max(0, Math.floor(visibleCount))
		: maxVisible !== undefined && Number.isFinite(maxVisible)
			? Math.max(0, Math.floor(maxVisible))
			: undefined;
	/** Equal-width toolbar: CSS `@container` hides trailing items (no ResizeObserver). */
	const useCq = fit === 'container' && explicitLimit === undefined;
	const limit = useCq
		? items.length
		: explicitLimit === undefined
			? items.length
			: explicitLimit;
	const overflowItems = useCq ? items : items.slice(limit);
	const showMore = useCq ? items.length > 1 : overflowItems.length > 0;
	const label = ariaLabel ?? t('overflow.ariaLabel');

	return (
		<div
			ref={setRoot}
			className={cn(styles.root, styles.actions, className)}
			style={style}
			{...rest}
			role='toolbar'
			aria-label={label}
			data-size={size !== 'sm' ? size : undefined}
			data-ov-fit={useCq ? 'cq' : undefined}
			data-count={useCq ? items.length : undefined}
		>
			{(useCq ? items : items.slice(0, limit)).map((item, index) => (
				useCq ? (
					<span
						key={item.key}
						data-ov-index={index}
						className={styles.item}
					>
						<VisibleAction
							item={item}
							display={display}
							size={size}
						/>
					</span>
				) : (
					<VisibleAction
						key={item.key}
						item={item}
						display={display}
						size={size}
					/>
				)
			))}
			{showMore && (
				<Menu
					onOpenChange={(open) => {
						actionsRef.current
							?.closest<HTMLElement>('[data-action-sheet-trigger]')
							?.toggleAttribute('data-overflow-open', open);
					}}
					align='right'
					widthMode='content'
					mobileTitle={mobileTitle ?? t('overflow.title')}
					aria-label={label}
					className={styles.more}
					items={overflowItems.map((item): ActionListItem => ({
						id: item.id,
						groupId: 'overflow',
						label: item.label,
						textValue: labelText(item),
						icon: item.icon,
						disabled: item.disabled,
						onSelect: item.onSelect,
						buttonProps: item.dom,
					}))}
					groups={[
						{
							id: 'overflow',
							label: t('overflow.title'),
						},
					]}
					trigger={(
						<ButtonIcon
							size={size}
							variant='ghost'
							icon={<IconDots3 />}
							aria-label={t('overflow.more')}
							data-overflow-trigger=''
						/>
					)}
				/>
			)}
		</div>
	);
}

/**
 * Variable-width children (Chip, …): `fitCount` + ResizeObserver.
 * Actions equal-width toolbars use CSS `@container` instead (no RO).
 * `fit="container"` root is a size container (`container-type: inline-size`);
 * available width ≡ `100cqw` via `root.clientWidth`.
 */
function Measure({
	children,
	gap = 'md',
	size = 'md',
	fit = 'content',
	maxVisible,
	align = 'right',
	moreLabel,
	mobileTitle,
	className,
	style,
	'aria-label': ariaLabel,
	visibleCount: _visibleCount,
	display: _display,
	showOverflowTrigger: _showOverflowTrigger,
	longPress: _longPress,
	longPressMs: _longPressMs,
	moveThreshold: _moveThreshold,
	rootRef,
	...rest
}: OverflowProps) {
	const {t} = useLocale(localeFallback);
	const localRootRef = useRef<HTMLDivElement | null>(null);
	const setRoot = (node: HTMLDivElement | null) => {
		localRootRef.current = node;
		assignRef(rootRef, node);
	};
	const widths = useRef<number[]>([]);
	const items = toItems(children);
	const count = items.length;
	const key = `${items.map((item, index) => itemKey(item, index)).join('\0')}|${gap}|${size}|${fit}|${maxVisible ?? ''}`;
	const [layout, setLayout] = useState(() => ({
		key,
		shown: count,
	}));
	if (layout.key !== key) {
		setLayout({
			key,
			shown: count,
		});
	}
	const shown = layout.key === key ? layout.shown : count;
	const isContainer = fit === 'container';

	useLayoutEffect(() => {
		const root = localRootRef.current;
		if (!root) return undefined;

		const read = () => {
			const nodes: HTMLElement[] = [];
			for (const node of root.children) {
				if (node instanceof HTMLElement && node.hasAttribute('data-ov')) nodes.push(node);
			}
			if (nodes.length === count) {
				widths.current = nodes.map((node) => node.offsetWidth);
			}
			/* container-type: inline-size → clientWidth tracks 100cqw */
			const available = fit === 'container'
				? root.clientWidth
				: (root.parentElement?.clientWidth ?? root.clientWidth);
			if (available <= 0 || widths.current.length === 0) return;

			const css = getComputedStyle(root);
			const more = Number.parseFloat(css.getPropertyValue(`--altum-control-height-${size}`));
			const gapPx = Number.parseFloat(css.columnGap);
			const next = fitCount(
				available,
				widths.current,
				Number.isFinite(more) ? more : 0,
				Number.isFinite(gapPx) ? gapPx : 0,
				maxVisible,
			);
			setLayout((prev) => (prev.shown === next && prev.key === key ? prev : {
				key,
				shown: next,
			}));
		};

		read();
		/* Variable chip widths need RO; Actions CQ path does not. */
		if (typeof ResizeObserver === 'undefined') return undefined;
		const target = fit === 'container' ? root : (root.parentElement ?? root);
		const observer = new ResizeObserver(read);
		observer.observe(target);
		return () => observer.disconnect();
	}, [
		count,
		fit,
		key,
		maxVisible,
		size,
	]);

	return (
		<div
			ref={setRoot}
			className={cn(
				styles.root,
				isContainer ? styles.fitContainer : styles.fitContent,
				className,
			)}
			style={style}
			{...rest}
			role='group'
			aria-label={ariaLabel ?? t('overflow.groupAriaLabel')}
			data-gap={gap !== 'md' ? gap : undefined}
			data-size={size !== 'md' ? size : undefined}
		>
			{items.slice(0, shown).map((item, index) => (
				<div
					key={itemKey(item, index)}
					data-ov=''
					className={styles.item}
				>
					{item}
				</div>
			))}
			{shown < count && (
				<div className={cn(styles.slot, isContainer && styles.moreEnd)}>
					<More
						size={size}
						align={align}
						mobileTitle={mobileTitle ?? t('overflow.groupTitle')}
						ariaLabel={moreLabel ?? t('overflow.groupMore')}
						panelClassName={styles.menuPanel}
						triggerClassName={isContainer ? styles.bare : undefined}
					>
						<div className={styles.menuStack}>
							{items.slice(shown)}
						</div>
					</More>
				</div>
			)}
		</div>
	);
}

/**
 * Overflow: лишние пункты уходят за ⋯.
 *
 * - дети `Overflow.Item` — панель действий (`visibleCount`, `display`);
 *   `fit="container"` без `visibleCount` — equal-width CQ `@container` (без RO);
 * - произвольные дети — измерение ширины (`fit`, `maxVisible`, `gap`, ResizeObserver);
 * - `longPress` — long-press по хосту открывает меню (лишние дети — контент строки).
 *
 * @component
 * @example
 * <Overflow visibleCount={2}>
 *   <Overflow.Item label="Изменить" onSelect={…} />
 *   <Overflow.Item label="Удалить" onSelect={…} />
 * </Overflow>
 * @example
 * <Overflow fit="container">
 *   <Overflow.Item icon={<IconPencil />} label="Edit" onSelect={…} />
 *   <Overflow.Item icon={<IconTrash />} label="Delete" onSelect={…} />
 * </Overflow>
 * @example
 * <Overflow fit="container" gap="sm">
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 * </Overflow>
 */
function OverflowRoot(props: OverflowProps) {
	const {
		longPress = false,
		longPressMs,
		moveThreshold,
		showOverflowTrigger,
		children,
		className,
		rootRef,
		...rest
	} = props;
	const {items, extra} = collect(children);
	const inner = items.length > 0
		? (
			<Actions
				rootRef={longPress ? undefined : rootRef}
				{...rest}
				showOverflowTrigger={showOverflowTrigger}
				className={longPress ? undefined : className}
				items={items}
			/>
		)
		: (
			<Measure
				rootRef={longPress ? undefined : rootRef}
				{...rest}
				className={longPress ? undefined : className}
			>
				{children}
			</Measure>
		);

	if (!longPress) return inner;

	return (
		<ActionSheetTrigger
			rootRef={rootRef}
			className={className}
			showOverflowTrigger={showOverflowTrigger ?? false}
			longPressMs={longPressMs}
			moveThreshold={moveThreshold}
		>
			{items.length > 0 ? extra : null}
			{inner}
		</ActionSheetTrigger>
	);
}

export const Overflow = Object.assign(OverflowRoot, {
	Item: OverflowItem,
});
