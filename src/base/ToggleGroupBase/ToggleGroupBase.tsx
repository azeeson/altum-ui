import {type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode, type Ref} from 'react';
import {cn} from '../../core/utils/cn';
import {handleRovingFocus} from '../../core/utils/bundle';
import styles from '../../styles/toggleGroup.module.css';

/**
 * Fieldset-группа тогглов: legend, стек, roving focus по input.
 */
export interface ToggleGroupBaseProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children'> {
	label?: ReactNode;
	orientation?: 'vertical' | 'horizontal';
	readOnly?: boolean;
	disabled?: boolean;
	/** После фокуса соседнего input (CheckboxGroup). */
	onMove?: (index: number) => void;
	children: ReactNode;
	/** Корень `<fieldset>`. */
	rootRef?: Ref<HTMLFieldSetElement>;
}

const INPUT_SELECTOR = 'input[type="radio"], input[type="checkbox"]';

/**
 * Общий fieldset для CheckboxGroup.
 *
 * @component
 * @example
 * <ToggleGroupBase label="Опции" orientation="vertical">{items}</ToggleGroupBase>
 */
export const ToggleGroupBase = ({
	label,
	orientation = 'vertical',
	className,
	readOnly = false,
	disabled = false,
	onKeyDown,
	onMove,
	children,
	rootRef,
	...rest
}: ToggleGroupBaseProps) => {
	const handleKeyDown = (event: KeyboardEvent<HTMLFieldSetElement>) => {
		onKeyDown?.(event);
		if (readOnly || disabled || event.defaultPrevented) return;
		handleRovingFocus(event, event.currentTarget, INPUT_SELECTOR, onMove);
	};

	return (
		<fieldset
			ref={rootRef}
			className={cn(styles.fieldset, className)}
			data-orientation={orientation}
			{...rest}
			onKeyDown={handleKeyDown}
		>
			{label ? (
				<legend className={styles.legend}>
					{label}
				</legend>
			) : null}
			<div className={styles.stack}>
				{children}
			</div>
		</fieldset>
	);
};
