/** Точка входа сабпути: универсальные хуки (`altum/hooks`). */
export {useOutsideClick} from '../hooks/useOutsideClick';
export type {UseOutsideClickOptions} from '../hooks/useOutsideClick';

export {useDocumentKeyDown} from '../hooks/useDocumentKeyDown';
export type {DocumentKeyDownTarget, UseDocumentKeyDownOptions} from '../hooks/useDocumentKeyDown';

export {
	useControlledState,
	useControlledStateWithCallback,
} from '../hooks/useControlledState';
export {useNow} from '../hooks/useNow';

export {
	MOBILE_MEDIA_QUERY,
	SIDEBAR_LARGE_MEDIA_QUERY,
	SIDEBAR_MEDIUM_MEDIA_QUERY,
	useIsMobile,
	useIsSidebarLarge,
	useIsSidebarMedium,
	useMediaQuery,
} from '../hooks/useMediaQuery';
export {
	REDUCED_MOTION_QUERY,
	usePrefersReducedMotion,
} from '../hooks/usePrefersReducedMotion';

export {useLongPress} from '../hooks/useLongPress';
export type {UseLongPressOptions, UseLongPressHandlers} from '../hooks/useLongPress';

export {useStickyChrome} from '../hooks/useStickyChrome';
export type {
	StickyChromeEasing,
	StickyChromeEdge,
	StickyChromeProgress,
	StickyChromeScrollbarSize,
	StickyChromeTarget,
	UseStickyChromeOptions,
} from '../hooks/useStickyChrome';

export {useForm} from '../hooks/useForm';
export type {FieldValidate, FormErrors, RegisterOptions, UseFormReturn} from '../hooks/useForm';
export {useFormContext, useFormProvider} from '../hooks/useFormProvider';
export {
	checkedValue,
	compose,
	fieldRules,
	pattern,
	required,
} from '../shared/form/formRules';
export type {FormRule, ValidationRules} from '../shared/form/formRules';
