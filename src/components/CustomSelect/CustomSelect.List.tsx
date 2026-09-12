import React, {forwardRef, useCallback} from 'react';
import {Listbox, type ListboxHandle} from '../Listbox/Listbox';
import {composeRefs} from '../../utils/composeRefs';
import {useLocale} from '../../locales/localeContext';
import {useCustomSelectFilterContext, useCustomSelectOpenContext, useCustomSelectSelectionContext} from './CustomSelect.context';
import type {CustomSelectListProps} from './CustomSelect.types';

export type {CustomSelectListProps} from './CustomSelect.types';

export const CustomSelectList = forwardRef<ListboxHandle, CustomSelectListProps>(
	function CustomSelectList(
		{
			options: optionsProp,
			groups: groupsProp,
			id,
			noOptionsText: noOptionsTextProp,
			...rest
		},
		forwardedRef,
	) {
		const {t} = useLocale();
		const noOptionsText = noOptionsTextProp ?? t('customSelect.noOptions');
		const {filteredOptions} = useCustomSelectFilterContext('CustomSelect.List');
		const {
			valueArray,
			selectionMode,
			listboxId,
			selectOption,
			registerListboxRef,
			groups: rootGroups,
		} = useCustomSelectSelectionContext('CustomSelect.List');
		const {interactive} = useCustomSelectOpenContext('CustomSelect.List');

		const setRefs = useCallback(
			(handle: ListboxHandle | null) => {
				registerListboxRef(handle);
			},
			[registerListboxRef],
		);

		const options = optionsProp ?? filteredOptions;
		const groups = groupsProp ?? rootGroups;

		return (
			<Listbox
				ref={composeRefs(forwardedRef, setRefs)}
				id={id ?? listboxId}
				{...rest}
				options={options}
				groups={groups}
				value={valueArray}
				multiple={selectionMode === 'multiple'}
				showCheck={rest.showCheck ?? selectionMode === 'multiple'}
				loading={rest.loading ?? false}
				noOptionsText={noOptionsText}
				disabled={!interactive}
				onSelect={selectOption}
			/>
		);
	},
);

CustomSelectList.displayName = 'CustomSelect.List';
