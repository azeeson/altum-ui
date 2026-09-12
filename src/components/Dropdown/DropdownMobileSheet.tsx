import React from 'react';
import {Sheet} from '../Sheet/Sheet';
import type {DropdownMobileSheetProps} from './Dropdown.types';

export type {DropdownMobileSheetProps} from './Dropdown.types';

/**
 * Mobile Sheet-панель для Dropdown (отдельный модуль для lazy-load из select entry).
 */
export const DropdownMobileSheet: React.FC<DropdownMobileSheetProps> = ({
	sheetRef,
	open,
	onOpenChange,
	zIndex,
	mobileTitle,
	mobileLeftControls,
	mobileRightControls,
	children,
}) => (
	<Sheet
		ref={sheetRef}
		open={open}
		onOpenChange={onOpenChange}
		mode='sheet'
		direction='end'
		backdrop={false}
		dismiss='all'
		zIndex={zIndex}
	>
		{(mobileTitle != null
			|| mobileLeftControls != null
			|| mobileRightControls != null) && (
			<Sheet.Header
				leftControls={mobileLeftControls}
				rightControls={mobileRightControls}
			>
				{mobileTitle == null
					? null
					: (typeof mobileTitle === 'string' || typeof mobileTitle === 'number'
						? (
							<Sheet.Title>
								{mobileTitle}
							</Sheet.Title>
						)
						: mobileTitle)}
			</Sheet.Header>
		)}
		<Sheet.Body padding={false}>
			{children}
		</Sheet.Body>
	</Sheet>
);

DropdownMobileSheet.displayName = 'Dropdown.MobileSheet';
