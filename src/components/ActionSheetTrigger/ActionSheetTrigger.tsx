import type {ActionSheetTriggerProps} from './ActionSheetTrigger.types';
export type {ActionSheetTriggerProps} from './ActionSheetTrigger.types';
import {useEffect, useRef, type PointerEvent as PE} from 'react';
import {uRef} from '../../core/utils/bundle';
import {releasePointerCapture, setPointerCapture} from '../../core/utils/dom';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_overflow} from '../../locales/slices/overflow.ru';
import {cn} from '../../core/utils/cn';
import {popoverFromInvoker, showPopover} from '../../core/utils/popover';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Menu} from '../Menu/Menu';
import {IconDots3} from '../../icons/icons/IconDots3';
import styles from './ActionSheetTrigger.module.css';

const localeFallback = {
	overflow: ru_overflow,
};

/**
 * Long-press host: pulse + pointer capture → `showPopover` после отпускания.
 * С `items` — семантическая обёртка `Menu` (Dropdown→Popover); без — совместимость с `Overflow`.
 *
 * @component
 * @example
 * <ActionSheetTrigger items={items} onAction={…}>
 *   <Item title="Задача" />
 * </ActionSheetTrigger>
 * @example
 * <ActionSheetTrigger>
 *   <Item title="Задача" />
 *   <Overflow visibleCount={0}>…</Overflow>
 * </ActionSheetTrigger>
 */
export function ActionSheetTrigger({
	children,
	items,
	groups,
	onAction,
	onOpenChange,
	mobileTitle,
	showOverflowTrigger = false,
	longPressMs = 500,
	moveThreshold = 8,
	disabled = false,
	className,
	rootRef,
	'aria-label': ariaLabel,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	onContextMenu,
	onClick,
	onAnimationEnd,
	...rest
}: ActionSheetTriggerProps) {
	const {t} = useLocale(localeFallback);
	const hostRef = useRef<HTMLDivElement | null>(null);
	const tmr = useRef(0), suppress = useRef(0), fired = useRef(false), xy = useRef({
		x: 0,
		y: 0
	});
	const live = useRef({
		disabled,
		delay: longPressMs,
		move: moveThreshold
	});
	live.current = {
		disabled,
		delay: longPressMs,
		move: moveThreshold
	};
	const stop = () => { clearTimeout(tmr.current); tmr.current = 0; };
	const end = (e: PE<HTMLDivElement>) => { releasePointerCapture(e.currentTarget, e.pointerId); stop(); };
	const armSuppress = () => {
		clearTimeout(suppress.current);
		suppress.current = window.setTimeout(() => { fired.current = false; }, 400);
	};
	useEffect(() => () => { clearTimeout(tmr.current); clearTimeout(suppress.current); }, []);

	return (
		<div
			{...rest}
			ref={uRef(hostRef, rootRef)}
			className={cn(styles.host, className)}
			data-action-sheet-trigger=''
			data-show-overflow-trigger={showOverflowTrigger ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			aria-label={items ? undefined : ariaLabel}
			onPointerDown={(e) => {
				onPointerDown?.(e);
				const L = live.current;
				if (L.disabled || e.button > 0 || e.defaultPrevented) return;
				/*
				 * Меню — портал. React доводит pointerdown до хоста, хотя цель вне DOM хоста.
				 * Захват указателя тогда уводит mouseup/click с пункта на карточку.
				 */
				if (!(e.target instanceof Node) || !e.currentTarget.contains(e.target)) return;
				/* ⋯ — нативный popovertarget; capture на хосте съедает click. */
				if (e.target instanceof Element && e.target.closest('[data-overflow-trigger]')) return;
				stop(); fired.current = false; xy.current = {
					x: e.clientX,
					y: e.clientY
				};
				const el = e.currentTarget; setPointerCapture(el, e.pointerId);
				tmr.current = window.setTimeout(() => {
					tmr.current = 0; if (live.current.disabled) return;
					el.classList.remove(styles.pulse); void el.offsetWidth; el.classList.add(styles.pulse);
					/* Только arm: suppress/open — на pointerup (иначе 400ms таймер гасит arm до отпускания). */
					fired.current = true;
				}, L.delay);
			}}
			onPointerMove={(e) => {
				onPointerMove?.(e);
				if (tmr.current && Math.hypot(e.clientX - xy.current.x, e.clientY - xy.current.y) > live.current.move) {
					stop();
				}
			}}
			onPointerUp={(e) => {
				onPointerUp?.(e);
				const armed = fired.current;
				end(e);
				if (!armed || live.current.disabled) return;
				const trigger = e.currentTarget.querySelector<HTMLElement>('[data-overflow-trigger]');
				const panel = popoverFromInvoker(trigger);
				if (panel) showPopover(panel);
				else trigger?.click();
				armSuppress();
			}}
			onPointerCancel={(e) => {
				onPointerCancel?.(e);
				fired.current = false;
				clearTimeout(suppress.current);
				end(e);
			}}
			onContextMenu={(e) => {
				onContextMenu?.(e);
				if (!e.defaultPrevented && (tmr.current || fired.current || live.current.disabled)) {
					e.preventDefault();
				}
			}}
			onClickCapture={(e) => {
				if (!fired.current) return;
				e.preventDefault();
				e.stopPropagation();
				fired.current = false;
				clearTimeout(suppress.current);
			}}
			onClick={onClick}
			onAnimationEnd={(e) => {
				onAnimationEnd?.(e);
				if (!e.defaultPrevented && e.target === e.currentTarget) {
					e.currentTarget.classList.remove(styles.pulse);
				}
			}}
		>
			{children}
			{items ? (
				<Menu
					className={styles.menu}
					align='right'
					widthMode='content'
					mobileTitle={mobileTitle}
					aria-label={ariaLabel}
					items={items}
					groups={groups}
					onAction={onAction}
					onOpenChange={(open) => {
						hostRef.current?.toggleAttribute('data-overflow-open', open);
						onOpenChange?.(open);
					}}
					trigger={(
						<ButtonIcon
							variant='ghost'
							icon={<IconDots3 />}
							aria-label={t('overflow.more')}
							data-overflow-trigger=''
						/>
					)}
				/>
			) : null}
		</div>
	);
}
