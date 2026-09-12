import type {ReactNode} from 'react';
import {Dropdown} from '../Dropdown/Dropdown';
import type {DropdownAlign, DropdownPopupRole} from '../Dropdown/Dropdown';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconDots3} from '../../icons/icons/IconDots3';
import {cn} from '../../utils/cn';
import type {ControlSize} from '../../types';
import srOnly from '../../styles/srOnly.module.css';
import styles from './Overflow.module.css';

type OverflowMoreProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	size: ControlSize;
	align?: DropdownAlign;
	mobileTitle?: ReactNode;
	ariaLabel: string;
	hidden?: boolean;
	panelClassName?: string;
	popupRole?: DropdownPopupRole;
	triggerClassName?: string;
	children: ReactNode;
};

/** Общий ⋯: `Dropdown` + `ButtonIcon` ghost. */
export function OverflowMore({
	open,
	onOpenChange,
	size,
	align = 'right',
	mobileTitle,
	ariaLabel,
	hidden,
	panelClassName,
	popupRole = 'listbox',
	triggerClassName,
	children,
}: OverflowMoreProps) {
	return (
		<Dropdown
			open={open}
			onOpenChange={onOpenChange}
			popupRole={popupRole}
			align={align}
			widthMode='content'
			mobileTitle={mobileTitle}
			panelClassName={panelClassName}
			renderTrigger={(props, ref) => (
				<ButtonIcon
					{...props}
					ref={ref}
					type='button'
					variant='ghost'
					size={size}
					icon={<IconDots3 />}
					aria-label={ariaLabel}
					className={cn(
						styles.more,
						triggerClassName,
						hidden && srOnly.srOnly,
						hidden && styles.srFocus,
						props.className,
					)}
				/>
			)}
		>
			{children}
		</Dropdown>
	);
}
