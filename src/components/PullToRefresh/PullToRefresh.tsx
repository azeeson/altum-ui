import type {
	PullToRefreshProps,
} from './PullToRefresh.types';
export type {
	PullToRefreshProps,
} from './PullToRefresh.types';

import React, {forwardRef, useCallback, useRef, useState} from 'react';
import {Spinner} from '../Spinner/Spinner';
import styles from './PullToRefresh.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../../locales/localeContext';
import {composeRefs} from '../../utils/composeRefs';

/**
 * Pull-to-refresh для mobile-first списков (опционально).
 *
 * @component
 * @example
 * <PullToRefresh onRefresh={async () => { await refetch(); }}>
 *   <VirtualList … />
 * </PullToRefresh>
 */
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh(
	{
		children,
		onRefresh,
		threshold = 64,
		disabled = false,
		className = '',
		pullLabel,
		releaseLabel,
		refreshingLabel,
		onTouchStart: onTouchStartProp,
		onTouchMove: onTouchMoveProp,
		onTouchEnd: onTouchEndProp,
		onTouchCancel: onTouchCancelProp,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const rootRef = useRef<HTMLDivElement>(null);
	const startY = useRef<number | null>(null);
	const [pull, setPull] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

	const atTop = () => {
		const el = rootRef.current;
		if (!el) return true;
		return el.scrollTop <= 0;
	};

	const finish = useCallback(async () => {
		if (pull < threshold || refreshing || disabled) {
			setPull(0);
			return;
		}
		setRefreshing(true);
		setPull(threshold);
		try {
			await onRefresh();
		} finally {
			setRefreshing(false);
			setPull(0);
		}
	}, [
		disabled,
		onRefresh,
		pull,
		refreshing,
		threshold
	]);

	const handleTouchStart = composeEventHandlers(onTouchStartProp, (event: React.TouchEvent<HTMLDivElement>) => {
		if (disabled || refreshing || !atTop()) return;
		startY.current = event.touches[0].clientY;
	});

	const handleTouchMove = composeEventHandlers(onTouchMoveProp, (event: React.TouchEvent<HTMLDivElement>) => {
		if (disabled || refreshing || startY.current == null || !atTop()) return;
		const delta = event.touches[0].clientY - startY.current;
		if (delta > 0) {
			setPull(Math.min(delta * 0.45, threshold * 1.4));
		}
	});

	const handleTouchEnd = composeEventHandlers(onTouchEndProp, () => {
		startY.current = null;
		void finish();
	});

	const handleTouchCancel = composeEventHandlers(onTouchCancelProp, () => {
		startY.current = null;
		void finish();
	});

	const ready = pull >= threshold;
	const label = refreshing
		? refreshingLabel ?? t('pullToRefresh.refreshing')
		: ready
			? releaseLabel ?? t('pullToRefresh.release')
			: pull > 8
				? pullLabel ?? t('pullToRefresh.pull')
				: null;

	return (
		<div
			ref={composeRefs(ref, rootRef)}
			className={cn(styles.root, className)}
			{...rest}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchCancel}
		>
			<div
				className={styles.indicator}
				style={{
					height: pull > 0 || refreshing ? Math.max(pull, refreshing ? threshold : 0) : 0,
					opacity: pull > 8 || refreshing ? 1 : 0,
				}}
				aria-hidden={!refreshing && pull < 8}
			>
				{refreshing ? (
					<Spinner size={20} />
				) : (
					<span
						className={styles.arrow}
						style={{transform: `rotate(${ready ? 180 : Math.min(180, (pull / threshold) * 180)}deg)`}}
					>
						↓
					</span>
				)}
				{label && (
					<span className={styles.label}>
						{label}
					</span>
				)}
			</div>
			<div
				className={styles.content}
				aria-busy={refreshing || undefined}
			>
				{children}
			</div>
		</div>
	);
});

PullToRefresh.displayName = 'PullToRefresh';
