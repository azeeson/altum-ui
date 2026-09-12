/**
 * Форматирует размер в байтах: `B` / `KB` / `MB`, один знак после запятой.
 *
 * @param size - Размер в байтах.
 * @returns Строка вида `512 B`, `1.5 KB`, `2.0 MB`.
 *
 * @example
 * formatBytes(1536) // "1.5 KB"
 */
export function formatBytes(size: number): string {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
