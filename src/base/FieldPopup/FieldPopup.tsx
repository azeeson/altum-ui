import React, {useCallback, useEffect, useState} from 'react';
import {Dropdown} from '../../components/Dropdown/Dropdown';
import type {DropdownAlign} from '../../components/Dropdown/Dropdown';
import {renderChildren} from '../../utils/renderChildren';
import {getFormControlState} from '../../utils/formControl';
import styles from './FieldPopup.module.css';

export const fieldPopupClassName = styles.field;

interface FieldPopupDropdownProps {
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	mobileChrome?: {
		mobileTitle?: React.ReactNode;
		mobileLeftControls?: React.ReactNode;
		mobileRightControls?: React.ReactNode;
	};
	trigger: React.ReactElement;
	contentPadding?: 'md';
	align?: DropdownAlign;
	children: React.ReactNode;
}

/**
 * Открытие попапа маскированного поля: `open` только если поле интерактивно.
 * `digitsFromValue` синхронизирует локальные цифры маски с внешним `value`.
 */
export function useMaskedPopupField({
	disabled = false,
	readOnly = false,
	digitsFromValue,
}: {
	disabled?: boolean;
	readOnly?: boolean;
	digitsFromValue?: string;
}) {
	const [open, setOpen] = useState(false);
	const [digits, setDigits] = useState(digitsFromValue ?? '');
	const {isInteractive} = getFormControlState({
		disabled,
		readOnly
	});
	const close = useCallback(() => setOpen(false), []);
	const openPopup = useCallback(() => {
		if (isInteractive) setOpen(true);
	}, [isInteractive]);

	useEffect(() => {
		if (digitsFromValue !== undefined) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- синхронизация локального ввода с value
			setDigits(digitsFromValue);
		}
	}, [digitsFromValue]);

	return {
		open,
		setOpen,
		close,
		openPopup,
		isInteractive,
		digits,
		setDigits,
	};
}

/**
 * Якорь панели — рамка `FieldBase` (`data-field-chrome`), не input внутри слота.
 * Иначе dropdown встаёт от края текста, а не от края поля.
 */
function bindFieldChromeRef(
	ref: React.RefCallback<HTMLElement>,
): React.RefCallback<HTMLElement> {
	return (node) => {
		if (!node) {
			ref(null);
			return;
		}
		const chrome = node.closest('[data-field-chrome]');
		ref(chrome instanceof HTMLElement ? chrome : node);
	};
}

/**
 * Dropdown-оболочка combobox-поля (desktop dropdown / mobile sheet).
 */
export const FieldPopupDropdown: React.FC<FieldPopupDropdownProps> = ({
	open,
	onOpen,
	onClose,
	mobileChrome,
	trigger,
	contentPadding,
	align,
	children,
}) => (
	<Dropdown
		open={open}
		onOpenChange={(next) => {
			if (next) onOpen();
			else onClose();
		}}
		triggerMode='combobox'
		popupRole='dialog'
		boxProps={contentPadding ? {padding: contentPadding} : undefined}
		widthMode='content'
		align={align}
		panelScroll='content'
		className={styles.field}
		mobileTitle={mobileChrome?.mobileTitle}
		mobileLeftControls={mobileChrome?.mobileLeftControls}
		mobileRightControls={mobileChrome?.mobileRightControls}
		renderTrigger={(props, ref) => renderChildren({
			children: trigger,
			props,
			contentRef: bindFieldChromeRef(ref),
		})}
	>
		{children}
	</Dropdown>
);
