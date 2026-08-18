import type {SelectRootProps, SelectTriggerProps, SelectPanelProps, SelectChipsProps, SelectChipProps} from './Select.types';
export type {
	SelectOption,
	SelectRootProps,
	SelectTriggerProps,
	SelectPanelProps,
	SelectChipsProps,
	SelectChipProps,
} from './Select.types';

 
import React from 'react';
import {CustomSelect, type CustomSelectFilterProps, type CustomSelectListProps, type CustomSelectRenderTargetContext, useCustomSelectContext} from '../CustomSelect/CustomSelect';
import {getListboxOptionText} from '../../utils/listboxOptions';
import {Chip} from '../Chip/Chip';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {cn} from '../../utils/cn';
import styles from './Select.module.css';

interface SelectTriggerInjectedProps {
	selectContext?: CustomSelectRenderTargetContext;
}

const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(function SelectRoot(
	{children, selectionMode = 'single', ...props},
	ref,
) {
	const childArray = React.Children.toArray(children);
	const trigger = childArray.find(
		(child): child is React.ReactElement<SelectTriggerProps> =>
			React.isValidElement(child) && child.type === SelectTrigger,
	);
	const panelChildren = childArray.filter((child) => child !== trigger);

	if (!trigger) {
		throw new Error('Select.Root требует дочерний Select.Trigger');
	}

	return (
		<CustomSelect.Root
			ref={ref}
			{...props}
			selectionMode={selectionMode}
			renderTarget={(context) => React.cloneElement(
				trigger as React.ReactElement<SelectTriggerProps & SelectTriggerInjectedProps>,
				{selectContext: context},
			)}
		>
			{panelChildren}
		</CustomSelect.Root>
	);
});

SelectRoot.displayName = 'Select.Root';

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps & SelectTriggerInjectedProps>(
	function SelectTrigger({
		selectContext,
		label,
		size = 'md',
		width = 'full',
		labelPlacement = 'inline',
		prefix,
		error,
		helperText,
		disabled,
		readOnly,
		onClear,
		clearLabel,
		placeholder,
		children,
		className = '',
		wrapperClassName = '',
		loading = false,
		separator = ' / ',
		popupRole = 'listbox',
		postfix: _postfix,
		id: providedId,
		...wrapperProps
	}, ref) {
		if (!selectContext) {
			throw new Error('Select.Trigger должен использоваться внутри Select.Root');
		}

		const {
			selectedOptions,
			open,
			disabled: rootDisabled,
			readOnly: rootReadOnly,
			clearValue,
			triggerAttrs,
			triggerRef,
			listboxId,
			selectionMode,
		} = selectContext;
		const selectedOption = selectedOptions[0];
		const hasValue = selectedOptions.length > 0;
		const hasChips = React.Children.toArray(children).some(
			(child) => React.isValidElement<SelectChipsProps>(child) && child.type === SelectChips,
		);
		const hasOnlyEmptyChips = hasChips
			&& selectedOptions.length === 0
			&& React.Children.toArray(children).every(
				(child) => React.isValidElement<SelectChipsProps>(child)
					&& child.type === SelectChips
					&& !child.props.children,
			);

		const valueText = selectionMode === 'path'
			? (selectedOptions.length > 0
				? selectedOptions.map((option) => getListboxOptionText(option)).join(separator)
				: null)
			: (selectedOption
				? (typeof selectedOption.label === 'string'
					? selectedOption.label
					: getListboxOptionText(selectedOption))
				: null);

		const handleClear = onClear
			? () => {
				clearValue();
				onClear();
			}
			: undefined;

		return (
			<CustomSelect.Shell
				{...wrapperProps}
				ref={ref}
				wrapperProps={wrapperProps}
				triggerRef={triggerRef as React.Ref<HTMLDivElement>}
				triggerAttrs={triggerAttrs}
				id={providedId ?? listboxId.replace(/-listbox$/, '-trigger')}
				label={label}
				size={size}
				width={width}
				labelPlacement={labelPlacement}
				prefix={prefix}
				error={error}
				helperText={helperText}
				disabled={rootDisabled || !!disabled}
				readOnly={rootReadOnly || !!readOnly}
				open={open}
				isInteractive={!rootDisabled && !rootReadOnly && !disabled && !readOnly}
				hasValue={hasValue}
				onClear={handleClear}
				clearLabel={clearLabel}
				className={cn(wrapperClassName, className)}
				popupRole={popupRole}
				triggerProps={{
					'aria-busy': loading || undefined,
					'aria-controls': open ? listboxId : undefined,
					'aria-haspopup': popupRole,
				}}
				triggerAs={hasChips ? 'div' : 'button'}
			>
				{(hasOnlyEmptyChips ? undefined : children) ?? valueText ?? (
					<CustomSelect.Placeholder>
						{placeholder ?? label}
					</CustomSelect.Placeholder>
				)}
			</CustomSelect.Shell>
		);
	},
);

SelectTrigger.displayName = 'Select.Trigger';

const SelectPanel = React.forwardRef<HTMLDivElement, SelectPanelProps>(
	function SelectPanel({className = '', ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={className}
				{...rest}
			/>
		);
	},
);
SelectPanel.displayName = 'Select.Panel';

const SelectFilter = React.forwardRef<
	React.ElementRef<typeof CustomSelect.Filter>,
	CustomSelectFilterProps
>(function SelectFilter(props, ref) {
	return <CustomSelect.Filter {...props} ref={ref} />;
});
SelectFilter.displayName = 'Select.Filter';

const SelectList = React.forwardRef<React.ElementRef<typeof CustomSelect.List>, CustomSelectListProps>(
	function SelectList(props, ref) {
		return <CustomSelect.List {...props} ref={ref} />;
	},
);
SelectList.displayName = 'Select.List';

const SelectChips = React.forwardRef<HTMLSpanElement, SelectChipsProps>(
	function SelectChips({children, className = '', ...rest}, ref) {
		const {selectedOptions} = useCustomSelectContext('Select.Chips');
		if (!children && selectedOptions.length === 0) return null;

		return (
			<span
				ref={ref}
				className={cn(styles.chipsRow, className)}
				{...rest}
			>
				{children ?? selectedOptions.map((option) => (
					<SelectChip key={option.value} value={option.value}>
						{getListboxOptionText(option)}
					</SelectChip>
				))}
			</span>
		);
	},
);
SelectChips.displayName = 'Select.Chips';

const SelectChip = React.forwardRef<HTMLButtonElement | HTMLSpanElement, SelectChipProps>(
	function SelectChip({value, children}, ref) {
		const {t} = useLocale();
		const {readOnly, removeOption} = useCustomSelectContext('Select.Chip');
		const label = typeof children === 'string' ? children : value;
		return (
			<Chip
				ref={ref}
				variant='secondary'
				className={styles.chip}
				removeLabel={t('select.removeItem', {label})}
				onRemove={readOnly ? undefined : () => removeOption(value)}
			>
				{children}
			</Chip>
		);
	},
);
SelectChip.displayName = 'Select.Chip';

/**
 * Составной Select. `options` принадлежат `Select.Root`; триггер и попап — явные слоты.
 *
 * @component
 * @example
 * <Select.Root options={options} value={city} onChange={setCity}>
 *   <Select.Trigger label="Город" />
 *   <Select.Panel><Select.Filter /><Select.List /></Select.Panel>
 * </Select.Root>
 */
export const Select = Object.assign(SelectRoot, {
	Root: SelectRoot,
	Trigger: SelectTrigger,
	Panel: SelectPanel,
	Filter: SelectFilter,
	List: SelectList,
	Chips: SelectChips,
	Chip: SelectChip,
});
