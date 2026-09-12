import {forwardRef, type ComponentPropsWithoutRef} from 'react';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';

export interface ChevronButtonProps extends ComponentPropsWithoutRef<'button'> {
	direction: 'prev' | 'next';
}

/**
 * Кнопка-шеврон prev/next без собственного chrome — класс задаёт потребитель.
 *
 * @component
 * @example
 * <ChevronButton direction="prev" aria-label="Назад" onClick={goPrev} />
 */
export const ChevronButton = forwardRef<HTMLButtonElement, ChevronButtonProps>(
	function ChevronButton({direction, children, type = 'button', ...rest}, ref) {
		return (
			<button
				ref={ref}
				type={type}
				{...rest}
			>
				{children ?? (direction === 'prev'
					? <IconChevronLeft size={16} aria-hidden />
					: <IconChevronRight size={16} aria-hidden />)}
			</button>
		);
	},
);

ChevronButton.displayName = 'ChevronButton';
