import type {ReactNode, Ref} from 'react';
import {ButtonIcon} from '../../components/ButtonIcon/ButtonIcon';
import {Title} from '../../components/Title/Title';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
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
	/** Корень шапки периода. */
	rootRef?: Ref<HTMLDivElement>;
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
	rootRef,
}: PeriodHeaderProps) {
	if (!showTitle && !showNav) return null;

	return (
		<div ref={rootRef} className={chrome.header}>
			{showNav && (
				<ButtonIcon
					variant='ghost'
					size='sm'
					icon={<IconChevronLeft size={16} aria-hidden />}
					aria-label={prevLabel}
					onClick={onPrev}
				/>
			)}
			{showTitle ? (
				<Title
					level={4}
					id={titleId}
					className={chrome.title}
				>
					{title}
				</Title>
			) : (
				<span className={chrome.titleSpacer} />
			)}
			{showNav && (
				<ButtonIcon
					variant='ghost'
					size='sm'
					icon={<IconChevronRight size={16} aria-hidden />}
					aria-label={nextLabel}
					onClick={onNext}
				/>
			)}
		</div>
	);
}
