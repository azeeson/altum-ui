export const FOCUSABLE_SELECTOR =
	[
		'button:not([disabled])',
		'[href]',
		'input:not([disabled]):not([type="hidden"])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])',
	].join(', ');

export const FOCUSABLE_WITH_ROLES_SELECTOR =
	`${FOCUSABLE_SELECTOR}, [role="option"], [role="menuitem"], [role="gridcell"]`;

function isFocusableElement(element: HTMLElement): boolean {
	if (element.closest('[inert]')) return false;
	if (element.getAttribute('aria-hidden') === 'true') return false;
	if (element.getAttribute('aria-disabled') === 'true') return false;
	if (element.hasAttribute('disabled')) return false;
	return true;
}

export function queryFocusableElements(
	container: ParentNode,
	selector: string = FOCUSABLE_SELECTOR,
): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(selector))
		.filter(isFocusableElement);
}

interface TabCycleOptions {
	/** Зациклить Tab между первым и последним элементом */
	wrap?: boolean;
	/** Tab с последнего элемента (без Shift) */
	onTabForwardFromLast?: () => void;
}

export function handleTabCycle(
	event: KeyboardEvent,
	focusableElements: HTMLElement[],
	options: TabCycleOptions = {},
): boolean {
	if (event.key !== 'Tab' || focusableElements.length === 0) {
		return false;
	}

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];
	const {wrap = false, onTabForwardFromLast} = options;

	if (event.shiftKey && document.activeElement === firstElement) {
		if (wrap) {
			lastElement.focus();
			event.preventDefault();
			return true;
		}
		return false;
	}

	if (!event.shiftKey && document.activeElement === lastElement) {
		if (wrap) {
			firstElement.focus();
			event.preventDefault();
			return true;
		}

		if (onTabForwardFromLast) {
			onTabForwardFromLast();
			event.preventDefault();
			return true;
		}
	}

	return false;
}

export function handleFocusableListNavigation(
	event: KeyboardEvent,
	focusableElements: HTMLElement[],
): boolean {
	if (focusableElements.length === 0) {
		return false;
	}

	const index = focusableElements.indexOf(document.activeElement as HTMLElement);

	if (event.key === 'ArrowDown') {
		event.preventDefault();
		const nextIndex = index === -1 ? 0 : (index + 1) % focusableElements.length;
		focusableElements[nextIndex].focus();
		return true;
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault();
		const prevIndex =
			index === -1
				? focusableElements.length - 1
				: (index - 1 + focusableElements.length) % focusableElements.length;
		focusableElements[prevIndex].focus();
		return true;
	}

	if (event.key === 'Home') {
		event.preventDefault();
		focusableElements[0].focus();
		return true;
	}

	if (event.key === 'End') {
		event.preventDefault();
		focusableElements[focusableElements.length - 1].focus();
		return true;
	}

	return false;
}
