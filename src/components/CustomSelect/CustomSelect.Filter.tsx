import React, {forwardRef, useEffect, useId, useRef} from 'react';
import {cn} from '../../utils/cn';
import {handleEnterKeyDown} from '../../utils/keyboard';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {composeRefs} from '../../utils/composeRefs';
import {
	useCustomSelectFilterContext,
	useCustomSelectOpenContext,
	useCustomSelectSelectionContext,
} from './CustomSelect.context';
import {fieldSurfaceClassName} from '../../base/FieldBase';
import styles from './CustomSelect.module.css';
import type {CustomSelectFilterProps} from './CustomSelect.types';

export type {CustomSelectFilterProps} from './CustomSelect.types';

export const CustomSelectFilter = forwardRef<HTMLInputElement, CustomSelectFilterProps>(
	function CustomSelectFilter(
		{
			placeholder: placeholderProp,
			className,
			wrapperClassName,
			id: providedId,
			autoFocus = true,
			onKeyDown,
			onChange,
			...rest
		},
		forwardedRef,
	) {
		const {t} = useLocale();
		const placeholder = placeholderProp ?? t('customSelect.filterPlaceholder');
		const {filterQuery, setFilterQuery, filteredOptions} = useCustomSelectFilterContext('CustomSelect.Filter');
		const {listboxId, selectOption} = useCustomSelectSelectionContext('CustomSelect.Filter');
		const {open} = useCustomSelectOpenContext('CustomSelect.Filter');
		const generatedId = useId();
		const inputId = providedId ?? `${generatedId}-filter`;
		const inputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (open && autoFocus) {
				inputRef.current?.focus({preventScroll: true});
			}
		}, [autoFocus, open]);

		return (
			<div className={cn(styles.filterWrapper, wrapperClassName)} data-label-placement='none'>
				<input
					ref={composeRefs(forwardedRef, inputRef)}
					type='search'
					className={cn(fieldSurfaceClassName(), styles.filterInput, className)}
					value={filterQuery}
					placeholder={placeholder}
					aria-label={placeholder}
					autoComplete='off'
					{...rest}
					id={inputId}
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
