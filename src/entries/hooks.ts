/** Точка входа сабпути: универсальные хуки (`altum-ui/hooks`). */
export {useOutsideClick} from '../hooks/useOutsideClick';
export type {UseOutsideClickOptions} from '../hooks/useOutsideClick';

export {useDocumentKeyDown} from '../hooks/useDocumentKeyDown';
export type {DocumentKeyDownTarget, UseDocumentKeyDownOptions} from '../hooks/useDocumentKeyDown';

export {useEscapeKey} from '../hooks/useEscapeKey';
export type {UseEscapeKeyOptions} from '../hooks/useEscapeKey';

export {useBodyScrollLock} from '../hooks/useBodyScrollLock';
export {
	useControlledState,
	useControlledStateWithCallback,
} from '../hooks/useControlledState';
export {useOverlay} from '../hooks/useOverlay';
export type {UseOverlayOptions} from '../hooks/useOverlay';
export {useFocusRestore} from '../hooks/useFocusRestore';
export {useInertSiblings} from '../hooks/useInertSiblings';
export {useOverlayPanel} from '../hooks/useOverlayPanel';
export type {UseOverlayPanelOptions} from '../hooks/useOverlayPanel';
export {useFocusTrap} from '../hooks/useFocusTrap';
export type {UseFocusTrapOptions} from '../hooks/useFocusTrap';

export {useMediaQuery, MOBILE_MEDIA_QUERY} from '../hooks/useMediaQuery';
export {useLongPress} from '../hooks/useLongPress';
export type {UseLongPressOptions, UseLongPressHandlers} from '../hooks/useLongPress';
export {
	usePrefersReducedMotion,
	REDUCED_MOTION_QUERY,
} from '../hooks/usePrefersReducedMotion';

export {useForm} from '../hooks/useForm';
export type {ValidationRules} from '../hooks/useForm';
