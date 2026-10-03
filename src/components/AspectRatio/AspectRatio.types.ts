import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `AspectRatio`.
 */
export interface AspectRatioProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * Соотношение сторон: число (шир./выс.) или строка `"16 / 9"`.
	 * @default 16 / 9
	 */
	ratio?: number | string;
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
}
