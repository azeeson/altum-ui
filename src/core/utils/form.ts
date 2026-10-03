/**
 * Единый калькулятор состояния поля ввода (ошибки, блокировки, валидность).
 */
export interface FormControlFlags {
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	loading?: boolean;
}

export function getFormControlState(flags: FormControlFlags) {
	const {
		disabled = false,
		readOnly = false,
		required = false,
		invalid = false,
		loading = false,
	} = flags;
	const isReadOnly = !!readOnly && !disabled;
	const isInteractive = !disabled && !isReadOnly && !loading;

	return {
		disabled: !!disabled,
		isReadOnly,
		isInteractive,
		'data-disabled': disabled ? ('' as const) : undefined,
		'data-readonly': isReadOnly ? ('' as const) : undefined,
		'data-loading': loading ? ('' as const) : undefined,
		'aria-disabled': disabled || undefined,
		'aria-readonly': isReadOnly || undefined,
		'aria-required': required || undefined,
		'aria-invalid': invalid || undefined,
	};
}

/**
 * Форматирует размер в байтах: `B` / `KB` / `MB`, один знак после запятой.
 */
export function formatBytes(size: number): string {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
