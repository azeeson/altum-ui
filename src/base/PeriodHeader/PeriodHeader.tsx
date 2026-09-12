import type {ReactNode} from 'react';
import {ChevronButton} from '../ChevronButton';
import {cn} from '../../utils/cn';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';

export interface PeriodHeaderProps {
	title?: ReactNode;
	titleId?: string;
	showTitle?: boolean;
	showNav?: boolean;
	onPrev: () => void;
	onNext: () => void;
	prevLabel: string;
	nextLabel: string;
}

/**
 * Шапка периода: optional title и пара шевронов prev/next.
 *
 * @component
 * @example
 * <PeriodHeader title="Март 2026" onPrev={prev} onNext={next} prevLabel="Назад" nextLabel="Вперёд" />
 */
export function PeriodHeader({
	title,
	titleId,
	showTitle = true,
	showNav = true,
	onPrev,
	onNext,
	prevLabel,
	nextLabel,
}: PeriodHeaderProps) {
	if (!showTitle && !showNav) return null;

	const navClass = cn(unstyled.control, chrome.navBtn);

	return (
		<div className={chrome.header}>
			{showNav && (
				<ChevronButton
					direction='prev'
					className={navClass}
					aria-label={prevLabel}
					onClick={onPrev}
				/>
			)}
			{showTitle ? (
				<div id={titleId} className={chrome.title}>
					{title}
				</div>
			) : (
				<span className={chrome.titleSpacer} />
			)}
			{showNav && (
				<ChevronButton
					direction='next'
					className={navClass}
					aria-label={nextLabel}
					onClick={onNext}
				/>
			)}
		</div>
	);
}
