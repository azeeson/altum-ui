import {forwardRef, type ComponentPropsWithoutRef, type ElementType} from 'react';

/**
 * Полиморфный DOM-хост: единственная вариативность — тег `as`.
 * Без классов, chrome и раскладки.
 *
 * @component
 * @example
 * <As as="section" className={styles.root}>…</As>
 */
export interface AsProps extends ComponentPropsWithoutRef<'div'> {
	as?: ElementType;
}

export const As = forwardRef<HTMLElement, AsProps>(function As(
	{as: Tag = 'div', ...rest},
	ref,
) {
	return <Tag ref={ref as never} {...rest} />;
});

As.displayName = 'As';
