import type {
	ComponentPropsWithoutRef,
	ElementType,
	Ref,
} from 'react';

export type TypographyProps = {
	/** HTML-тег корня. @default `'span'` */
	as?: ElementType;
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLElement>
		| Ref<HTMLSpanElement>
		| Ref<HTMLParagraphElement>
		| Ref<HTMLHeadingElement>
		| Ref<HTMLAnchorElement>
		| Ref<HTMLButtonElement>
		| Ref<HTMLDivElement>
		| Ref<HTMLLabelElement>;
	className?: string;
	type?: string;
	disabled?: boolean;
	href?: string;
	tabIndex?: number;
} & Omit<ComponentPropsWithoutRef<'span'>, 'ref' | 'color' | 'type'>;

/**
 * Плоский полиморфный текстовый хост без собственных стилей.
 * Донор для `Text` / `Title` / `Link` / `Button`.
 *
 * @component
 */
export function Typography({
	as: Comp = 'span',
	rootRef,
	className,
	...rest
}: TypographyProps) {
	return (
		<Comp
			ref={rootRef}
			className={className}
			{...rest}
		/>
	);
}
