import styles from './flexPrimitives.module.css';
import {
	LAYOUT_ALIGN_CLASS,
	LAYOUT_GAP_CLASS,
	LAYOUT_JUSTIFY_CLASS,
	type LayoutAlign,
	type LayoutGap,
	type LayoutJustify,
} from './Layout.types';

export function gapClass(gap: LayoutGap): string {
	return styles[LAYOUT_GAP_CLASS[gap]] ?? styles.gapMd;
}

export function alignClass(align: LayoutAlign): string {
	return styles[LAYOUT_ALIGN_CLASS[align]] ?? styles.alignCenter;
}

export function justifyClass(justify: LayoutJustify): string {
	return styles[LAYOUT_JUSTIFY_CLASS[justify]] ?? styles.justifyStart;
}

export {styles as flexStyles};
