import type {ButtonProps} from '../../Button/Button.types';
import {ButtonIcon} from '../../ButtonIcon/ButtonIcon';
import {IconCross} from '../../../icons/icons/IconCross';
import overlayClose from '../../../styles/overlayClose.module.css';
import {cn} from '../../../core/utils/cn';
import {useLocale} from '../../../locales/localeContext';
import {ruSlice as ru_common} from '../../../locales/slices/common.ru';

const localeFallback = {
	common: ru_common,
};

type CloseControlProps = Omit<
	ButtonProps,
	'prefix' | 'postfix' | 'children' | 'variant' | 'loading' | 'fullWidth'
>;

/**
 * Крестик закрытия overlay: `ButtonIcon` и chrome `overlayClose`.
 * Внутренний узел — не экспорт библиотеки и не сторис.
 *
 * @component
 * @example
 * <CloseControl onClick={onClose} />
 */
export function CloseControl({
	'aria-label': ariaLabel,
	className,
	...props
}: CloseControlProps) {
	const {t} = useLocale(localeFallback);

	return (
		<ButtonIcon
			variant='ghost'
			className={cn(overlayClose.close, className)}
			data-shape='circle'
			data-appearance='diskClose'
			aria-label={ariaLabel ?? t('common.close')}
			icon={(
				<IconCross
					size='var(--altum-overlay-close-icon-size)'
					aria-hidden
				/>
			)}
			{...props}
		/>
	);
}
