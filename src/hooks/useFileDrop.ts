import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type DragEvent,
} from 'react';

export type UseFileDropHandlers = {
	onDragEnter: (event: DragEvent) => void;
	onDragOver: (event: DragEvent) => void;
	onDragLeave: (event: DragEvent) => void;
	onDrop: (event: DragEvent) => void;
};

/**
 * Drag-and-drop файлов на хост: счётчик enter/leave, чтобы `over` не мигал
 * на вложенных узлах. Без колбэка обработчики — no-op, `over` всегда `false`.
 *
 * @param onFiles - Вызов с `FileList` при drop; `undefined` выключает DnD.
 * @returns `over` и drag-хендлеры для хоста.
 *
 * @example
 * const {over, ...drop} = useFileDrop(disabled ? undefined : handleFiles);
 * return <div {...drop}>{over ? 'Drop' : children}</div>;
 */
export function useFileDrop(
	onFiles?: (files: FileList) => void,
): UseFileDropHandlers & {over: boolean} {
	const [over, setOver] = useState(false);
	const dragCount = useRef(0);
	const onFilesRef = useRef(onFiles);

	useEffect(() => {
		onFilesRef.current = onFiles;
		if (!onFiles) dragCount.current = 0;
	});

	const onDragEnter = useCallback((event: DragEvent) => {
		if (!onFilesRef.current) return;
		event.preventDefault();
		dragCount.current += 1;
		if (event.dataTransfer.items.length > 0) setOver(true);
	}, []);

	const onDragOver = useCallback((event: DragEvent) => {
		if (!onFilesRef.current) return;
		event.preventDefault();
	}, []);

	const onDragLeave = useCallback((event: DragEvent) => {
		if (!onFilesRef.current) return;
		event.preventDefault();
		dragCount.current -= 1;
		if (dragCount.current <= 0) {
			dragCount.current = 0;
			setOver(false);
		}
	}, []);

	const onDrop = useCallback((event: DragEvent) => {
		const emit = onFilesRef.current;
		if (!emit) return;
		event.preventDefault();
		dragCount.current = 0;
		setOver(false);
		const files = event.dataTransfer.files;
		if (files.length) emit(files);
	}, []);

	return {
		over: onFiles ? over : false,
		onDragEnter,
		onDragOver,
		onDragLeave,
		onDrop,
	};
}
