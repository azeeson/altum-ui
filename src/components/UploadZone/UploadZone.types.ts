import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `UploadZone`.
 */
export interface UploadZoneProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
	onChange?: (files: FileList) => void;
	multiple?: boolean;
	children?: React.ReactNode | ((openFileDialog: () => void) => React.ReactNode);
	readOnly?: boolean;
	disabled?: boolean;
}
