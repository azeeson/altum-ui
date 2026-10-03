import type {PinInputProps} from './PinInput.types';
export type {PinInputProps} from './PinInput.types';
import {useRef, useState, type ChangeEvent, type ClipboardEvent, type FocusEvent, type KeyboardEvent} from 'react';
import styles from './PinInput.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {TextField} from '../TextField/TextField';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {FormMessage} from '../FormMessage/FormMessage';
import {useFallbackId} from '../../hooks/useFallbackId';
import {ruSlice as ru_pinInput} from '../../locales/slices/pinInput.ru';

const localeFallback = {pinInput: ru_pinInput};
const clean = (raw: string, n: number, num: boolean) => (num ? raw.replace(/\D/g, '') : raw.replace(/\s/g, '')).slice(0, n);

/** PIN / OTP на `TextField`; фокус и paste инлайном. @component */
export function PinInput({
	length = 6, size = 'md', value: controlled, defaultValue = '', onChange, onComplete, numeric = true,
	disabled = false, masked = false, autoFocus = false, 'aria-label': ariaLabel, className, style, error,
	label, description, name, width = 'full', rootRef, ...rest
}: PinInputProps) {
	const {t} = useLocale(localeFallback);
	const id = useFallbackId().replace(/:/g, '');
	const ctrl = controlled !== undefined;
	const [local, setLocal] = useState(() => clean(defaultValue, length, numeric));
	const value = clean(ctrl ? controlled! : local, length, numeric);
	const chars = Array.from({length}, (_, i) => value[i] ?? '');
	const refs = useRef<(HTMLInputElement | null)[]>([]);
	const focus = (i: number) => {
		const el = refs.current[Math.max(0, Math.min(length - 1, i))];
		el?.focus();
		el?.select();
	};
	const commit = (next: string) => {
		const v = clean(next, length, numeric);
		if (!ctrl) setLocal(v);
		onChange?.(v);
		if (v.length === length) onComplete?.(v);
	};
	const idx = (n: EventTarget | null) => {
		const el = n instanceof HTMLElement
			? n.closest<HTMLElement>('[data-index][data-field-control]')
			: null;
		const i = el ? Number(el.dataset.index) : NaN;
		return Number.isInteger(i) ? i : null;
	};
	const hasError = Boolean(error);
	const descText = typeof description === 'string' && description.length > 0;
	const errId = typeof error === 'string' ? `${id}-error` : undefined;
	const descId = descText && !hasError ? `${id}-description` : undefined;

	const cells = (
		<div
			className={styles.group}
			role='group'
			id={id}
			aria-label={label ? undefined : (ariaLabel ?? t('pinInput.ariaLabel'))}
			aria-invalid={hasError || undefined}
			aria-describedby={[errId, descId].filter(Boolean).join(' ') || undefined}
			onChange={(e: ChangeEvent<HTMLDivElement>) => {
				const i = idx(e.target);
				if (i == null || !(e.target instanceof HTMLInputElement) || disabled) return;
				const incoming = clean(e.target.value, length, numeric);
				if (!incoming) {
					const n = chars.slice();
					n[i] = '';
					commit(n.join(''));
					return;
				}
				if (incoming.length > 1) {
					commit((value.slice(0, i) + incoming).slice(0, length));
					focus(Math.min(length - 1, i + incoming.length));
					return;
				}
				const n = chars.slice();
				n[i] = incoming;
				commit(n.join(''));
				if (i < length - 1) focus(i + 1);
			}}
			onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
				const i = idx(e.target);
				if (i == null || disabled) return;
				if (e.key === 'Backspace') {
					e.preventDefault();
					if (chars[i]) {
						const n = chars.slice();
						n[i] = '';
						commit(n.join(''));
					} else if (i > 0) {
						const n = chars.slice();
						n[i - 1] = '';
						commit(n.join(''));
						focus(i - 1);
					}
				} else if (e.key === 'Delete' && chars[i]) {
					e.preventDefault();
					const n = chars.slice();
					n[i] = '';
					commit(n.join(''));
				} else if (e.key === 'Home' || e.key === 'End') {
					e.preventDefault();
					focus(e.key === 'Home' ? 0 : length - 1);
				} else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
					e.preventDefault();
					focus(i + (e.key === 'ArrowLeft' ? -1 : 1));
				}
			}}
			onPaste={(e: ClipboardEvent<HTMLDivElement>) => {
				const i = idx(e.target);
				if (i == null) return;
				e.preventDefault();
				const p = clean(e.clipboardData.getData('text'), length, numeric);
				if (!p) return;
				commit((value.slice(0, i) + p).slice(0, length));
				focus(Math.min(length - 1, i + p.length));
			}}
			onFocus={(e: FocusEvent<HTMLDivElement>) => {
				if (e.target instanceof HTMLInputElement && idx(e.target) != null) {
					e.target.select();
				}
			}}
		>
			{chars.map((char, i) => (
				<TextField
					key={i}
					inputRef={(n) => { refs.current[i] = n; }}
					id={i === 0 ? `${id}-0` : undefined}
					wrapperClassName={styles.cell}
					className={styles.cellInput}
					size={size}
					type='text'
					inputMode={numeric ? 'numeric' : 'text'}
					name={i === 0 ? name : undefined}
					data-index={i}
					autoComplete={i === 0 ? 'one-time-code' : 'off'}
					maxLength={1}
					value={char}
					disabled={disabled}
					error={hasError || undefined}
					aria-label={t('pinInput.digit', {index: i + 1})}
					autoFocus={autoFocus && i === 0}
					data-masked={masked ? '' : undefined}
				/>
			))}
		</div>
	);

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			style={style}
			data-width={width === 'full' ? 'full' : undefined}
			data-error={hasError ? '' : undefined}
		>
			{label ? (
				<FieldLabel
					label={label}
					htmlFor={`${id}-0`}
					size={size}
				>
					{cells}
				</FieldLabel>
			) : cells}
			{descText && !hasError ? (
				<FormMessage id={descId}>
					{description}
				</FormMessage>
			) : null}
			{typeof error === 'string' ? (
				<FormMessage variant='error' id={errId}>
					{error}
				</FormMessage>
			) : null}
			{!descText ? description : null}
		</div>
	);
}
