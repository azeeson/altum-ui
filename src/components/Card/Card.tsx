import type {ReactNode} from 'react';
import type {CardProps} from './Card.types';
export type {
	CardVariant,
	CardProps,
} from './Card.types';

import {Box} from '../Box/Box';
import {Spinner} from '../Spinner/Spinner';
import {Text} from '../Text/Text';
import styles from './Card.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {implicitAs} from '../../core/utils/implicitAs';

function asText(node: ReactNode, weight?: 'semibold') {
	if (typeof node === 'string' || typeof node === 'number') {
		return (
			<Text weight={weight}>
				{node}
			</Text>
		);
	}
	return node;
}

/**
 * Карточка-поверхность на `Box`: заголовок, медиа, тело и действия.
 * Клик без `as` поднимает корень до `button` (`implicitAs`).
 * Загрузка — `aria-busy` и `Spinner` поверх контента.
 *
 * @component
 * @example
 * <Card variant="elevated" header="Заголовок" loading={isLoading}>
 *   Содержимое
 * </Card>
 */
export const Card = ({
	children,
	header,
	media,
	actions,
	hoverable = false,
	variant = 'outlined',
	loading = false,
	className,
	as,
	onClick,
	role,
	radius = 'lg',
	rootRef,
	...rest
}: CardProps) => {
	const resolvedAs = implicitAs(as, onClick, role);

	if (
		process.env.NODE_ENV !== 'production'
		&& onClick
		&& resolvedAs !== 'button'
		&& resolvedAs !== 'a'
		&& role !== 'button'
	) {
		console.warn(
			'Card: onClick на неинтерактивном корне. Передайте role="button" или as="a".',
		);
	}

	return (
		<Box
			rootRef={rootRef}
			as={resolvedAs}
			variant={variant}
			radius={radius}
			className={cn(utilities.fColumn, styles.card, className)}
			{...rest}
			data-hoverable={hoverable ? '' : undefined}
			onClick={onClick}
			role={role}
			aria-busy={loading || undefined}
		>
			{header != null && (
				<div className={styles.header}>
					{asText(header, 'semibold')}
				</div>
			)}
			{media != null && (
				<div className={styles.media}>
					{media}
				</div>
			)}
			{children != null && (
				<div className={styles.body}>
					{asText(children)}
				</div>
			)}
			{actions != null && (
				<div className={styles.footer}>
					{actions}
				</div>
			)}
			{loading && (
				<span className={cn(utilities.fCenter, styles.busy)}>
					<Spinner aria-hidden />
				</span>
			)}
		</Box>
	);
};
