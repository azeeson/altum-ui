import {useEffect} from 'react';

let lockCount = 0;
let previousOverflow = '';

function lockBodyScroll(): void {
	if (lockCount === 0) {
		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}
	lockCount += 1;
}

function unlockBodyScroll(): void {
	lockCount = Math.max(0, lockCount - 1);
	if (lockCount === 0) {
		document.body.style.overflow = previousOverflow;
	}
}

/**
 * Блокирует scroll `document.body` со счётчиком вложений
 * (несколько Modal / Sheet / ImageCrop одновременно).
 * Снимает lock при `locked === false` и при размонтировании.
 *
 * @param locked - Активна ли блокировка для этого экземпляра.
 *
 * @returns Ничего — lock scroll на document.body.
 *
 * @example
 * useBodyScrollLock(isOpen);
 */
export function useBodyScrollLock(locked: boolean): void {
	useEffect(() => {
		if (!locked) {
			return;
		}

		lockBodyScroll();
		return () => {
			unlockBodyScroll();
		};
	}, [locked]);
}
