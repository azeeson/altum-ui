/**
 * Placeholder текстового поля с floating / outside label.
 * При `inline` всегда пробел — лейбл занимает место placeholder.
 */
export function fieldPlaceholder(options: {
	placement?: 'inline' | 'outside' | 'none';
	focused?: boolean;
	empty?: boolean;
	placeholder?: string;
	label?: string;
	keepPlaceholder?: boolean;
}): string {
	const {
		placement = 'inline',
		focused = false,
		empty = true,
		placeholder,
		label,
		keepPlaceholder = false,
	} = options;
	if (placement === 'inline') return ' ';
	const visible = placeholder && placeholder.trim() !== '' ? placeholder : (label ?? '');
	if ((focused && !keepPlaceholder) || !empty) return '';
	return visible;
}
