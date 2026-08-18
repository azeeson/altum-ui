/** Точка входа сабпути: публичные хелперы (`altum/utils`). */
export {toCssSize} from '../utils/cssSize';
export {moveArrayItem} from '../utils/arrayMove';
export {getTranslateXFromTransform} from '../utils/transform';
export {computeAnchorPosition, resolvePreferredSide, getAnchorSideSpace, clampToViewport} from '../utils/anchorPosition';
export type {
	AnchorSide,
	AnchorAlign,
	AnchorPositionStyle,
	AnchorPositionResult,
} from '../utils/anchorPosition';

export {
	defaultListboxFilterFn,
	filterListboxOptions,
	findEnabledListboxIndex,
	findListboxOption,
	flattenResolvedListboxGroups,
	getListboxDisplayValue,
	getListboxOptionDomId,
	getListboxOptionText,
	getListboxPath,
	matchListboxOption,
	moveListboxHighlight,
	resolveListboxGroups,
} from '../utils/listboxOptions';
export type {
	ListboxOption,
	ListboxGroup,
	ListboxFilterFn,
	ResolvedListboxGroup,
} from '../utils/listboxOptions';

export {adjustElementHeight, getTextareaMinHeightPx} from '../utils/autoHeight';
export {getFormControlState} from '../utils/formControl';
export {
	parseKeyboardShortcut,
	matchesKeyboardShortcut,
	formatKeyboardShortcut,
	formatAriaKeyShortcuts,
} from '../utils/keyboardShortcut';
export type {KeyboardShortcutParts} from '../utils/keyboardShortcut';

export {composeRefs} from '../utils/composeRefs';
export type {PossibleRef} from '../utils/composeRefs';
export {composeEventHandlers} from '../utils/composeEvents';

export {cn} from '../utils/cn';
export {controlTrackClassName} from '../utils/controlTrack';
export type {ControlTrackVariant} from '../utils/controlTrack';
export {mergeStyles} from '../utils/mergeStyles';
export {Slot, mergeSlotProps} from '../utils/slot';
export type {SlotProps} from '../utils/slot';
export {SPACING_TOKEN_CSS, resolveSpacingCss} from '../utils/spacing';

export {renderChildren} from '../utils/renderChildren';
export type {
	RenderChildrenFn,
	RenderChildrenOptions,
	EnrichedThroughFn,
	EnrichedThroughChild,
	WithEnrichedChildren,
} from '../utils/renderChildren';

export type {OverlayZIndexTier} from '../utils/overlayZIndex';
export {
	resolveOverlayZIndex,
	resolveStackedOverlayZIndex,
	OVERLAY_Z_INDEX_DEFAULT,
} from '../utils/overlayZIndex';
export {
	OverlayStackProvider,
	useOverlayStackZIndex,
	elevateAboveOverlayStack,
} from '../utils/overlayStack';

export type {
	SpacingToken,
	SpacingValue,
	GroupGap,
	SurfaceVariant,
	Density,
} from '../types';
