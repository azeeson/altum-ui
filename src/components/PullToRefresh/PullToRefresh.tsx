import type {
	PullToRefreshProps,
} from './PullToRefresh.types';
export type {
	PullToRefreshProps,
} from './PullToRefresh.types';

import {useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import {Spinner} from '../Spinner/Spinner';
import styles from './PullToRefresh.module.css';
import scroll from '../../styles/scrollable.module.css';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {
	setPointerCapture,
	releasePointerCapture,
} from '../../core/utils/dom';
import {pointerDelta, pullDistance} from '../../core/utils/math';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_pullToRefresh} from '../../locales/slices/pullToRefresh.ru';

const localeFallback = {
	pullToRefresh: ru_pullToRefresh,
};

/**
 * Pull-to-refresh для mobile-first списков (опционально).
 * Сдвиг пальца пишется в CSS-переменную и не перерисовывает список.
 *
 * @component
 * @example
 * <PullToRefresh onRefresh={async () => { await refetch(); }}>
 *   <VirtualList … />
 * </PullToRefresh>
 */
export const PullToRefresh = ({
	children,
	onRefresh,
	threshold = 64,
	disabled = false,
	className = '',
	pullLabel,
	releaseLabel,
	refreshingLabel,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	rootRef,
	style,
	...rest
}: PullToRefreshProps) => {
	const {t} = useLocale(localeFallback);
	const localRootRef = useRef<HTMLDivElement>(null);
	const startY = useRef<number | null>(null);
	const activePointer = useRef<number | null>(null);
	const currentPullRef = useRef(0);
	const refreshingRef = useRef(false);
	const [refreshing, setRefreshing] = useState(false);

	const atTop = () => {
		const el = localRootRef.current;
		if (!el) return true;
		return el.scrollTop <= 0;
	};

	const setDOMPull = (value: number) => {
		currentPullRef.current = value;
		const el = localRootRef.current;
		if (!el) return;
		if (value >= threshold) el.setAttribute('data-ptr-state', 'ready');
		else if (value > 8) el.setAttribute('data-ptr-state', 'pull');
		else el.removeAttribute('data-ptr-state');
		if (value <= 0) {
			// Пока тянем, transition выключен. Сначала возвращаем его, потом сбрасываем высоту.
			void el.offsetHeight;
		}
		el.style.setProperty('--local-pull-height', `${value}px`);
	};

	const finish = async () => {
		const pull = currentPullRef.current;
		if (pull < threshold || refreshingRef.current || disabled) {
			setDOMPull(0);
			return;
		}
		refreshingRef.current = true;
		setRefreshing(true);
		setDOMPull(threshold);
		try {
			await onRefresh();
		} finally {
			refreshingRef.current = false;
			setRefreshing(false);
			setDOMPull(0);
		}
	};

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		onPointerDown?.(event);
		if (disabled || refreshingRef.current || !atTop()) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		startY.current = event.clientY;
		activePointer.current = event.pointerId;
		setPointerCapture(event.currentTarget, event.pointerId);
	};

	const handlePointerMoveEvent = (event: PointerEvent<HTMLDivElement>) => {
		onPointerMove?.(event);
		if (
			disabled
			|| refreshingRef.current
			|| startY.current == null
			|| activePointer.current !== event.pointerId
			|| !atTop()
		) {
			return;
		}
		const dy = pointerDelta(event.clientY, startY.current);
		if (dy > 0) setDOMPull(pullDistance(dy, threshold));
	};

	const endGesture = (event: PointerEvent<HTMLDivElement>) => {
		if (activePointer.current !== event.pointerId) return;
		releasePointerCapture(event.currentTarget, event.pointerId);
		activePointer.current = null;
		startY.current = null;
		void finish();
	};

	const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
		onPointerUp?.(event);
		endGesture(event);
	};

	const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
		onPointerCancel?.(event);
		endGesture(event);
	};

	return (
		<div
			ref={uRef(rootRef, localRootRef)}
			className={cn(scroll.area, styles.root, className)}
			{...rest}
			style={{
				'--altum-ptr-threshold': `${threshold}px`,
				...style,
			} as CSSProperties}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMoveEvent}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			data-refreshing={refreshing ? '' : undefined}
		>
			<div
				className={styles.indicator}
				aria-hidden={refreshing ? undefined : true}
			>
				{refreshing ? (
					<Spinner size={20} />
				) : (
					<span className={styles.arrow}>
						↓
					</span>
				)}
				<span
					className={styles.label}
					data-label-pull={pullLabel ?? t('pullToRefresh.pull')}
					data-label-release={releaseLabel ?? t('pullToRefresh.release')}
					data-label-refreshing={refreshingLabel ?? t('pullToRefresh.refreshing')}
				/>
			</div>
			<div
				className={styles.content}
				aria-busy={refreshing || undefined}
			>
				{children}
			</div>
		</div>
	);
};
