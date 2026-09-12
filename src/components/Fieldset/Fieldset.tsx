import type {FieldsetProps} from './Fieldset.types';
export type {FieldsetVariant, FieldsetProps} from './Fieldset.types';

import {forwardRef, type CSSProperties} from 'react';
import {Box} from '../Box/Box';
import {Flex} from '../../base/Flex';
import {Type} from '../../base/Type';
import {useFallbackId} from '../../hooks/useFallbackId';
import {cn} from '../../utils/cn';
import {resolveSpacingCss} from '../../utils/spacing';
import toggleGroup from '../../styles/toggleGroup.module.css';
import styles from './Fieldset.module.css';

/**
 * Группа полей формы: заголовок, описание и поля на корневых пропах.
 *
 * @component
 * @example
 * <Fieldset
 *   legend="Контакты"
 *   description="Для уведомлений"
 *   footer={<Button>Сохранить</Button>}
 * >
 *   <TextField label="Телефон" />
 * </Fieldset>
 */
export const Fieldset = forwardRef<HTMLDivElement, FieldsetProps>(function Fieldset(
	{
		variant = 'default',
		disabled = false,
		className,
		style,
		id: providedId,
		children,
		legend,
		description,
		hint,
		footer,
		gap = 'var(--altum-g-space-4)',
		...rest
	},
	ref,
) {
	const id = useFallbackId(providedId);
	const descriptionId = description ? `${id}-description` : undefined;
	const hintId = hint ? `${id}-hint` : undefined;
	const plain = variant === 'plain';

	return (
		<Box
			ref={ref}
			variant={plain ? 'plain' : 'outlined'}
			padding={plain ? 'none' : 'lg'}
			className={cn(
				styles.root,
				plain && styles.plain,
				disabled && styles.disabled,
				className,
			)}
			style={style}
			{...rest}
		>
			<fieldset
				id={id}
				className={toggleGroup.fieldset}
				disabled={disabled || undefined}
				aria-describedby={cn(descriptionId, hintId) || undefined}
			>
				{legend ? (
					<legend className={toggleGroup.legend}>
						{legend}
					</legend>
				) : null}
				{description ? (
					<Type
						as='p'
						size='sm'
						id={descriptionId}
						className={styles.lede}
					>
						{description}
					</Type>
				) : null}
				{hint ? (
					<Type
						as='p'
						size='xs'
						id={hintId}
						className={styles.lede}
					>
						{hint}
					</Type>
				) : null}
				<Flex
					direction='column'
					wrap={false}
					style={{'--altum-flex-gap': resolveSpacingCss(gap)} as CSSProperties}
				>
					{children}
				</Flex>
			</fieldset>
			{footer ? (
				<Flex
					align='center'
					gap='sm'
					className={styles.footer}
				>
					{footer}
				</Flex>
			) : null}
		</Box>
	);
});

Fieldset.displayName = 'Fieldset';
