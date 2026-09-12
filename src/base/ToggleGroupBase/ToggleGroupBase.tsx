import {forwardRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode} from 'react';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {focusElement} from '../../utils/a11y';
import {handleRovingFocusKeyDown} from '../../utils/keyboard';
import styles from '../../styles/toggleGroup.module.css';

/**
 * Fieldset-группа тогглов: legend, стек, roving focus по input.
 */
export interface ToggleGroupBaseProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children'> {
	label?: ReactNode;
	orientation?: 'vertical' | 'horizontal';
	readOnly?: boolean;
	disabled?: boolean;
	/** После фокуса соседнего input (RadioGroup выбирает значение). */
	onMove?: (index: number) => void;
	children: ReactNode;
}

/**
 * Общий fieldset для CheckboxGroup / RadioGroup.
 *
 * @component
 * @example
 * <ToggleGroupBase label="Тариф" orientation="vertical">{items}</ToggleGroupBase>
 */
export const ToggleGroupBase = forwardRef<HTMLFieldSetElement, ToggleGroupBaseProps>(
	function ToggleGroupBase(
		{
			label,
			orientation = 'vertical',
			className,
			readOnly = false,
			disabled = false,
			onKeyDown,
			onMove,
			children,
			...rest
		},
		ref,
	) {
		const handleKeyDown = composeEventHandlers(onKeyDown, (event: KeyboardEvent<HTMLFieldSetElement>) => {
			if (readOnly || disabled) return;
			const inputs = Array.from(
				event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]'),
			);
			const currentIndex = inputs.indexOf(document.activeElement as HTMLInputElement);
			handleRovingFocusKeyDown(event, {
				currentIndex,
				length: inputs.length,
				orientation: orientation === 'horizontal' ? 'horizontal' : 'vertical',
				onMove: (nextIndex) => {
					focusElement(inputs[nextIndex]);
					onMove?.(nextIndex);
				},
			});
		});

		return (
			<fieldset
				ref={ref}
				className={cn(styles.fieldset, className)}
				{...rest}
				onKeyDown={handleKeyDown}
			>
				{label ? (
					<legend className={styles.legend}>
						{label}
					</legend>
				) : null}
				<div className={cn(styles.stack, orientation === 'horizontal' ? styles.horizontal : '')}>
					{children}
				</div>
			</fieldset>
		);
	},
);

ToggleGroupBase.displayName = 'ToggleGroupBase';
