import type {ButtonProps} from './Button.types';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import overlayClose from '../../styles/overlayClose.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_common} from '../../locales/slices/common.ru';

const localeFallback = {
	common: ru_common,
};

type OverlayCloseControlProps = Omit<
	ButtonProps,
	'prefix' | 'postfix' | 'children' | 'variant' | 'loading' | 'fullWidth'
>;

/**
 * Внутренний крестик закрытия overlay: `ButtonIcon` + `overlayClose` chrome.
 * Не публичный экспорт — только для Modal / Sheet / Alert / Notification / Lightbox.
 */
export function OverlayCloseControl({
	'aria-label': ariaLabel,
	className,
	...props
}: OverlayCloseControlProps) {
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
