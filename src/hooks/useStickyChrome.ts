import {useLayoutEffect, useState, type RefObject} from 'react';

/** Край scrollport, от которого считается «уехал». */
export type StickyChromeEdge = 'start' | 'end';

/** Куда писать атрибут или CSS-переменную. */
export type StickyChromeTarget = 'ref' | 'scrollport' | RefObject<HTMLElement | null>;

/** Кривая прогресса от 0 до 1. */
export type StickyChromeEasing = 'linear' | 'smoothstep';

/**
 * Непрерывный прогресс 0…1 в CSS-переменной, без ререндера.
 * `offset` флаг не двигает: переменная доходит до 1 на `rangePx`.
 */
export interface StickyChromeProgress {
	/** Имя custom property, например `--ws-chrome-progress`. */
	cssVar: string;
	/**
	 * Дистанция, px, на которой значение доходит до 1.
	 * При `rangePx` ≤ 0 прогресс сразу 0 или 1.
	 */
	rangePx: number;
	/**
	 * `linear` — путь / `rangePx`. `smoothstep` — t²(3−2t).
	 * @default 'linear'
	 */
	easing?: StickyChromeEasing;
	/**
	 * Куда писать переменную. Наследники читают её без ререндера.
	 * @default 'scrollport'
	 */
	target?: StickyChromeTarget;
}

/**
 * Ширина полосы прокрутки в CSS-переменной (`12px`).
 * Считается по scrollport: `offsetWidth - clientWidth`. Рамка входит в разницу.
 * У окна — `innerWidth - clientWidth` документа.
 */
export interface StickyChromeScrollbarSize {
	/** Имя custom property. */
	cssVar: string;
	/**
	 * Куда писать значение.
	 * @default 'scrollport'
	 */
	target?: StickyChromeTarget;
}

/**
 * Опции `useStickyChrome`.
 * Scrollport: `scrollRef`, иначе ближайший предок с вертикальным overflow, иначе окно.
 */
export interface UseStickyChromeOptions {
	/** Следить за скроллом. Пока `false`, атрибут снимается и хук возвращает `false`. */
	enabled?: boolean;
	/**
	 * `start` — ушли от начала. `end` — до конца ещё есть ход.
	 * @default 'start'
	 */
	edge?: StickyChromeEdge;
	/** Явный scrollport. Стабильный ref: читается в layout-эффекте. */
	scrollRef?: RefObject<HTMLElement | null>;
	/**
	 * Presence-атрибут. `false` — только вернуть флаг, DOM не трогать.
	 * Куда вешать — `host`.
	 * @default 'data-scrolled'
	 */
	attribute?: string | false;
	/**
	 * Куда вешать presence-атрибут.
	 * `ref` — узел chrome. `scrollport` — контейнер скролла. Либо отдельный ref,
	 * чтобы CSS смотрел на предка, а не на шапку. Стабильный ref: читается в layout-эффекте.
	 * @default 'ref'
	 */
	host?: StickyChromeTarget;
	/**
	 * Допуск у края, px: когда ставить флаг. Гасит дрожание на субпикселе.
	 * Не связан с `progress.rangePx`.
	 * @default 1
	 */
	offset?: number;
	/** Прогресс 0…1 в CSS-переменной. Не вызывает ререндер. */
	progress?: StickyChromeProgress;
	/** Ширина полосы прокрутки в CSS-переменной. Не вызывает ререндер. */
	scrollbarSize?: StickyChromeScrollbarSize;
}

const isScrollable = (element: HTMLElement) => {
	const overflow = getComputedStyle(element).overflowY;
	return overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay';
};

const resolveScrollTarget = (
	node: HTMLElement,
	explicit: HTMLElement | null,
): HTMLElement | Window => {
	if (explicit) return explicit;
	let parent = node.parentElement;
	while (parent) {
		if (isScrollable(parent)) return parent;
		parent = parent.parentElement;
	}
	return window;
};

const isWindowTarget = (
	target: HTMLElement | Window,
): target is Window => target === window;

const scrollportElement = (target: HTMLElement | Window): HTMLElement => (
	isWindowTarget(target) ? document.documentElement : target
);

const resolveWriteNode = (
	spec: StickyChromeTarget,
	chrome: HTMLElement,
	scrollport: HTMLElement | Window,
): HTMLElement | null => {
	if (spec === 'ref') return chrome;
	if (spec === 'scrollport') return scrollportElement(scrollport);
	return spec.current;
};

const readScroll = (target: HTMLElement | Window) => {
	const scrolling = isWindowTarget(target)
		? document.scrollingElement ?? document.documentElement
		: target;
	return {
		top: scrolling.scrollTop,
		max: scrolling.scrollHeight - scrolling.clientHeight,
	};
};

const readScrollbar = (target: HTMLElement | Window) => (
	isWindowTarget(target)
		? window.innerWidth - document.documentElement.clientWidth
		: target.offsetWidth - target.clientWidth
);

const isAway = (
	edge: StickyChromeEdge,
	top: number,
	max: number,
	offset: number,
) => (
	edge === 'start'
		? top > offset
		: max > 0 && top < max - offset
);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const easeProgress = (t: number, easing: StickyChromeEasing) => (
	easing === 'smoothstep' ? t * t * (3 - 2 * t) : t
);

const progressUnit = (
	edge: StickyChromeEdge,
	top: number,
	max: number,
	rangePx: number,
	easing: StickyChromeEasing,
) => {
	const distance = edge === 'start' ? Math.max(0, top) : Math.max(0, max - top);
	const linear = rangePx <= 0 ? (distance > 0 ? 1 : 0) : clamp01(distance / rangePx);
	return easeProgress(linear, easing);
};

const formatUnit = (value: number) => String(Math.round(value * 10000) / 10000);

const bindScroll = (
	target: HTMLElement | Window,
	sync: () => void,
) => {
	target.addEventListener('scroll', sync, {passive: true});
	const resize = new ResizeObserver(sync);
	const box = isWindowTarget(target) ? document.documentElement : target;
	const content = isWindowTarget(target) ? document.body : target;
	resize.observe(box);
	const watchChildren = () => {
		Array.from(content.children).forEach((child) => {
			if (child instanceof HTMLElement) resize.observe(child);
		});
	};
	watchChildren();
	const mutations = new MutationObserver(() => {
		watchChildren();
		sync();
	});
	mutations.observe(content, {childList: true});
	return () => {
		target.removeEventListener('scroll', sync);
		resize.disconnect();
		mutations.disconnect();
	};
};

/**
 * Следит, уехал ли липкий chrome от края scrollport.
 * Ставит presence-атрибут (по умолчанию `data-scrolled`) и возвращает тот же флаг.
 * Ререндер только при смене флага. Прогресс и ширина полосы пишутся в CSS-переменные
 * на кадр, без ререндера.
 *
 * Наблюдатели висят на scrollport и на каждом его прямом ребёнке. Для оболочки
 * из шапки и main это дёшево. Не делайте scrollport виртуальным списком: каждый
 * ряд станет целью наблюдателя. Передайте `scrollRef` оболочки над списком.
 *
 * @param ref - Узел chrome. По умолчанию на нём же живёт атрибут (`host: 'ref'`).
 * @param options - Край, scrollport, атрибут, прогресс, ширина полосы.
 * @returns `true`, когда chrome уехал от края дальше `offset`.
 *
 * @example
 * const scrolled = useStickyChrome(barRef, {
 *   scrollRef,
 *   offset: 4,
 *   host: shellRef,
 *   progress: {cssVar: '--ws-chrome-progress', rangePx: 120, easing: 'smoothstep'},
 * });
 */
export function useStickyChrome(
	ref: RefObject<HTMLElement | null>,
	options: UseStickyChromeOptions = {},
): boolean {
	const {
		enabled = true,
		edge = 'start',
		scrollRef,
		attribute = 'data-scrolled',
		host = 'ref',
		offset = 1,
		progress,
		scrollbarSize,
	} = options;
	const progressVar = progress?.cssVar;
	const progressRange = progress?.rangePx ?? 0;
	const progressEasing = progress?.easing ?? 'linear';
	const progressTarget = progress?.target ?? 'scrollport';
	const scrollbarVar = scrollbarSize?.cssVar;
	const scrollbarTarget = scrollbarSize?.target ?? 'scrollport';
	const [scrolled, setScrolled] = useState(false);

	useLayoutEffect(() => {
		const node = ref.current;
		if (!node || !enabled) {
			setScrolled(false);
			return;
		}
		const target = resolveScrollTarget(node, scrollRef?.current ?? null);
		const attributeNode = attribute
			? resolveWriteNode(host, node, target)
			: null;
		const progressNode = progressVar
			? resolveWriteNode(progressTarget, node, target)
			: null;
		const scrollbarNode = scrollbarVar
			? resolveWriteNode(scrollbarTarget, node, target)
			: null;
		let frame = 0;
		let lastFlag: boolean | null = null;
		let lastProgress: string | null = null;
		let lastScrollbar: number | null = null;
		const apply = () => {
			const {top, max} = readScroll(target);
			const next = isAway(edge, top, max, offset);
			if (next !== lastFlag) {
				lastFlag = next;
				if (attribute && attributeNode) attributeNode.toggleAttribute(attribute, next);
				setScrolled(next);
			}
			if (progressVar && progressNode) {
				const value = formatUnit(progressUnit(
					edge,
					top,
					max,
					progressRange,
					progressEasing,
				));
				if (value !== lastProgress) {
					lastProgress = value;
					progressNode.style.setProperty(progressVar, value);
				}
			}
			if (scrollbarVar && scrollbarNode) {
				const size = readScrollbar(target);
				if (size !== lastScrollbar) {
					lastScrollbar = size;
					scrollbarNode.style.setProperty(scrollbarVar, `${size}px`);
				}
			}
		};
		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				apply();
			});
		};
		apply();
		const unbind = bindScroll(target, schedule);
		return () => {
			unbind();
			if (frame) cancelAnimationFrame(frame);
			if (attribute && attributeNode) attributeNode.removeAttribute(attribute);
			if (progressVar && progressNode) progressNode.style.removeProperty(progressVar);
			if (scrollbarVar && scrollbarNode) scrollbarNode.style.removeProperty(scrollbarVar);
		};
	}, [
		attribute,
		edge,
		enabled,
		host,
		offset,
		progressEasing,
		progressRange,
		progressTarget,
		progressVar,
		ref,
		scrollRef,
		scrollbarTarget,
		scrollbarVar,
	]);

	return scrolled;
}
