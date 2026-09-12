import {forwardRef, useEffect, useRef} from 'react';
import {cn} from '../../utils/cn';
import {handleEnterKeyDown} from '../../utils/keyboard';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../../locales/localeContext';
import {composeRefs} from '../../utils/composeRefs';
import {
	useCustomSelectFilterContext,
	useCustomSelectOpenContext,
	useCustomSelectSelectionContext,
} from './CustomSelect.context';
import {SearchField} from '../SearchField/SearchField';
import styles from './CustomSelect.module.css';
import type {CustomSelectFilterProps} from './CustomSelect.types';

export type {CustomSelectFilterProps} from './CustomSelect.types';

export const CustomSelectFilter = forwardRef<HTMLInputElement, CustomSelectFilterProps>(
	function CustomSelectFilter(
		{
			placeholder: placeholderProp,
			label: labelProp,
			className,
			autoFocus = true,
			onKeyDown,
			onChange,
			size = 'sm',
			...rest
		},
		forwardedRef,
	) {
		const {t} = useLocale();
		const placeholder = placeholderProp ?? t('customSelect.filterPlaceholder');
		const {filterQuery, setFilterQuery, filteredOptions} = useCustomSelectFilterContext('CustomSelect.Filter');
		const {listboxId, selectOption} = useCustomSelectSelectionContext('CustomSelect.Filter');
		const {open} = useCustomSelectOpenContext('CustomSelect.Filter');
		const inputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (open && autoFocus) {
				inputRef.current?.focus({preventScroll: true});
			}
		}, [autoFocus, open]);

		return (
			<div className={cn(styles.filterWrapper, className)}>
				<SearchField
					{...rest}
					ref={composeRefs(forwardedRef, inputRef)}
					size={size}
					keepPlaceholder
					label={labelProp ?? placeholder}
					placeholder={placeholder}
					value={filterQuery}
					autoComplete='off'
					onChange={composeEventHandlers(onChange, (event) => {
						setFilterQuery(event.target.value);
					})}
					onKeyDown={composeEventHandlers(onKeyDown, (event) => {
						handleEnterKeyDown(event, () => {
							const first = filteredOptions[0];
							if (first) selectOption(first.value);
						});
					})}
					aria-controls={listboxId}
				/>
			</div>
		);
	},
);

CustomSelectFilter.displayName = 'CustomSelect.Filter';
