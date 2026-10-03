import type {
	SheetProps,
	SheetHeaderProps,
	SheetBodyProps,
	SheetFooterProps,
} from './Sheet.types';
export type {
	SheetMode,
	SheetDirection,
	SheetFooterAlign,
	SheetProps,
	SheetHeaderProps,
	SheetBodyProps,
	SheetFooterProps,
} from './Sheet.types';

import type {CSSProperties} from 'react';
import {createContext, useContext} from 'react';
import {Box} from '../Box/Box';
import {OverlayCloseControl} from '../Button/overlayCloseControl';
import {Layout} from '../Layout/Layout';
import {Overlay} from '../Overlay/Overlay';
import {toCssSize} from '../../core/utils/cssSize';
import styles from './Sheet.module.css';
import overlayScrim from '../../styles/overlayScrim.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_sheet} from '../../locales/slices/sheet.ru';

const localeFallback = {
	sheet: ru_sheet,
};

const SheetCloseContext = createContext<(() => void) | null>(null);

/**
 * Шапка панели: сетка `leftControls` / заголовок / `rightControls`.
 * Крестик стоит в правой ячейке и не сдвигает заголовок из центра.
 * `plain` — ряд без левой ячейки, раскладка в CSS по `data-variant`.
 *
 * @component
 * @example
 * <Sheet.Header leftControls={<Button>Назад</Button>} showClose>
 *   <Title level={3}>Фильтры</Title>
 * </Sheet.Header>
 */
const SheetHeader = ({
	children,
	className,
	variant = 'chrome',
	leftControls,
	rightControls,
	showClose: showCloseProp,
	rootRef,
	...rest
}: SheetHeaderProps) => {
	const onClose = useContext(SheetCloseContext);
	const showClose = showCloseProp ?? (rightControls == null);
	const closeControl = showClose && onClose != null ? (
		<OverlayCloseControl onClick={onClose} />
	) : null;
	const end = (rightControls || showClose) ? (
		<>
			{rightControls}
			{closeControl}
		</>
	) : null;

	return (
		<Layout.Header
			rootRef={rootRef}
			sticky
			className={cn(styles.headerSlot, className)}
			{...rest}
			data-variant={variant}
		>
			<div className={styles.leftSide}>
				{leftControls}
			</div>
			<div className={styles.centerSide}>
				{children}
			</div>
			<div className={styles.rightSide}>
				{end}
			</div>
		</Layout.Header>
	);
};

/**
 * Тело панели. Скролл живёт на `Layout` внутри `Sheet`.
 * `padding={false}` снимает поле через `data-flush`.
 *
 * @component
 */
const SheetBody = ({
	className,
	padding = true,
	rootRef,
	...rest
}: SheetBodyProps) => {
	return (
		<Layout.Content
			rootRef={rootRef}
			className={className}
			{...rest}
			data-flush={!padding ? '' : undefined}
		/>
	);
};

/**
 * Действия внизу панели.
 *
 * @component
 */
const SheetFooter = ({
	className,
	align = 'end',
	rootRef,
	...rest
}: SheetFooterProps) => {
	return (
		<Layout.Footer
			rootRef={rootRef}
			sticky
			align={align}
			className={className}
			{...rest}
		/>
	);
};

/**
 * Выезжающая панель на `Overlay` (`variant="sheet"`).
 * Поверхность — `Box`, шапка, тело и футер — `Layout`.
 * Заголовок — `Title`. Крестик — в правой ячейке `Sheet.Header`.
 * `mode="auto"` на узком экране становится нижней или верхней шторкой силами CSS.
 *
 * Держите `Sheet` смонтированным: закрытие — `open={false}`.
 * Браузер снимает `open` у dialog и доигрывает CSS. `{open && <Sheet>}` обрывает уход.
 *
 * @component
 * @example
 * <Sheet open={open} onOpenChange={setOpen} mode="sheet" showHandle>
 *   <Sheet.Header showClose>
 *     <Title level={3}>Фильтры</Title>
 *   </Sheet.Header>
 *   <Sheet.Body>…</Sheet.Body>
 *   <Sheet.Footer>
 *     <Button variant="primary">Применить</Button>
 *   </Sheet.Footer>
 * </Sheet>
 */
const SheetRoot = ({
	open,
	onOpenChange,
	children,
	showHandle = false,
	mode = 'auto',
	direction = 'end',
	width = 280,
	height,
	className,
	style,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	rootRef,
	...rest
}: SheetProps) => {
	const {t} = useLocale(localeFallback);
	const side = mode === 'sheet'
		? (direction === 'start' ? 'top' : 'bottom')
		: (direction === 'start' ? 'left' : 'right');
	const close = () => onOpenChange(false);

	return (
		<Overlay
			variant='sheet'
			side={side}
			open={open}
			onOpenChange={onOpenChange}
			hostClassName={overlayScrim.host}
			aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
			aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : t('sheet.ariaLabel'))}
		>
			<Box
				variant='floating'
				rootRef={rootRef}
				className={cn(styles.sheet, className)}
				style={{
					'--altum-sheet-width': toCssSize(width),
					'--altum-sheet-height': height !== undefined ? toCssSize(height) : undefined,
					...style,
				} as CSSProperties}
				{...rest}
				data-mode={mode}
				data-direction={direction}
				data-handle={showHandle ? '' : undefined}
			>
				<SheetCloseContext.Provider value={close}>
					<Layout
						padding='md'
						gap='md'
					>
						{children}
					</Layout>
				</SheetCloseContext.Provider>
			</Box>
		</Overlay>
	);
};

/**
 * Выезжающая панель: `Header` / `Body` / `Footer`.
 */
export const Sheet = Object.assign(SheetRoot, {
	Header: SheetHeader,
	Body: SheetBody,
	Footer: SheetFooter,
});
