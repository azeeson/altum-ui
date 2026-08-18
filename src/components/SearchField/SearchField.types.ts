import {TextFieldProps} from '../TextField/TextField';

/**
 * Свойства `SearchField`.
 * `onClear` наследуется от `TextField` / `FieldBase`.
 */
export type SearchFieldProps = Omit<TextFieldProps, 'prefix' | 'type'>;
