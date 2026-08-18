import type {
	CollapseProps,
} from './Collapse.types';
export type {
	CollapseProps,
} from './Collapse.types';

import {forwardRef, useEffect, useLayoutEffect, useRef} from 'react';
import {usePrefersReducedMotion} from '../../hooks/usePrefersReducedMotion';
import styles from './Collapse.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';

const TRANSITION_MS = 280;

/**
 * Плавное раскрытие и сворачивание блока по высоте с учётом reduced motion.
 *
 * @component
 * @example
 * <Collapse open={expanded}>
 *   <p>Дополнительные детали секции</p>
 * </Collapse>
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
	{
		open,
		children,
		className,
		style,
		reducedMotion,
		...rest
	},
	ref,
) {
	const isOpen = open;
	const prefersReduced = usePrefersReducedMotion();
	const skipMotion = reducedMotion ?? prefersReduced;
	const panelRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const mountedRef = useRef(false);
	const isOpenRef = useRef(isOpen);

	useEffect(() => {
		isOpenRef.current = isOpen;
	});

	useLayoutEffect(() => {
		const panel = panelRef.current;
		const inner = innerRef.current;
		if (!panel || !inner) return;

		const applyInstant = (open: boolean) => {
			const previousTransition = panel.style.transition;
			panel.style.transition = 'none';
			panel.style.height = open ? 'auto' : '0px';
			void panel.offsetHeight;
			panel.style.transition = previousTransition;
		};

		if (!mountedRef.current) {
			mountedRef.current = true;
			applyInstant(isOpen);
			return;
		}

		if (skipMotion) {
			applyInstant(isOpen);
			return;
		}

		if (isOpen) {
			const start = panel.getBoundingClientRect().height;
			const target = inner.scrollHeight;
			panel.style.height = `${start}px`;
			void panel.offsetHeight;
			panel.style.height = `${target}px`;

			const settleOpen = () => {
				if (!isOpenRef.current) return;
				panel.style.height = 'auto';
			};

			const onEnd = (event: TransitionEvent) => {
				if (event.target !== panel || event.propertyName !== 'height') return;
				panel.removeEventListener('transitionend', onEnd);
				window.clearTimeout(fallback);
				settleOpen();
			};

			const fallback = window.setTimeout(() => {
				panel.removeEventListener('transitionend', onEnd);
				settleOpen();
			}, TRANSITION_MS + 50);

			panel.addEventListener('transitionend', onEnd);
			return () => {
				panel.removeEventListener('transitionend', onEnd);
				window.clearTimeout(fallback);
			};
		}

		const from = panel.style.height === 'auto' || panel.style.height === ''
			? inner.scrollHeight
			: panel.getBoundingClientRect().height;
		panel.style.height = `${from}px`;
		void panel.offsetHeight;
		panel.style.height = '0px';
	}, [isOpen, skipMotion]);

	return (
		<div
			ref={composeRefs(ref, panelRef)}
			className={cn(
				styles.collapse,
				skipMotion ? styles.collapseInstant : '',
				className,
			)}
			style={style}
			aria-hidden={!isOpen}
			{...(!isOpen ? {inert: true} as React.HTMLAttributes<HTMLDivElement> : {})}
			{...rest}
		>
			<div ref={innerRef} className={styles.collapseInner}>
				{children}
			</div>
		</div>
	);
});

Collapse.displayName = 'Collapse';
