import type {ControlTrackVariant} from './controlTrack.types';
import {cn} from './cn';
import styles from './controlTrack.module.css';

export type {ControlTrackVariant} from './controlTrack.types';

/**
 * Хешированные классы заливки трека (border / fill / shadow).
 * Readonly — dashed chrome как у SegmentedControl / FieldBase.
 * @param variant - заливка трека (`plain` у SegmentedControl, `link` у ButtonGroup).
 * @param options.readOnly - dashed readonly-поверхность.
 */
export function controlTrackClassName(
	variant: ControlTrackVariant,
	options?: {readOnly?: boolean},
): string {
	return cn(
		styles.track,
		styles[variant] ?? '',
		options?.readOnly ? styles.readOnly : '',
	);
}
