import type {SwipeAction} from './SwipeToAction.types';

export const getTouchCoordinates = (e: globalThis.TouchEvent): {
	clientX: number;
	clientY: number;
} | null => {
	if (!e.touches || e.touches.length === 0) return null;
	return {
		clientX: e.touches[0].clientX,
		clientY: e.touches[0].clientY,
	};
};

export function findSwipeTriggerIndex(actions: SwipeAction[]): number {
	return actions.findIndex((action) => action.swipeToTrigger);
}

export function getSwipeTriggerAction(actions: SwipeAction[]): SwipeAction | undefined {
	const index = findSwipeTriggerIndex(actions);
	return index >= 0 ? actions[index] : undefined;
}

interface CalculateXParams {
	diffX: number;
	leftOpenWidth: number;
	rightOpenWidth: number;
	swipeToTriggerThreshold: number;
	hasLeftTrigger: boolean;
	hasRightTrigger: boolean;
	hasLeftActions: boolean;
	hasRightActions: boolean;
}

export const calculateCappedX = ({
	diffX,
	leftOpenWidth,
	rightOpenWidth,
	swipeToTriggerThreshold,
	hasLeftTrigger,
	hasRightTrigger,
	hasLeftActions,
	hasRightActions,
}: CalculateXParams): {
	cappedX: number;
	activeSide: 'left' | 'right' | null;
} => {
	let cappedX = diffX;
	let activeSide: 'left' | 'right' | null = null;

	if (diffX > 0 && !hasLeftActions) return {
		cappedX: 0,
		activeSide: null
	};
	if (diffX < 0 && !hasRightActions) return {
		cappedX: 0,
		activeSide: null
	};

	if (hasLeftTrigger && diffX > swipeToTriggerThreshold) {
		activeSide = 'left';
		cappedX = swipeToTriggerThreshold + (diffX - swipeToTriggerThreshold) * 0.18;
	} else if (hasRightTrigger && diffX < -swipeToTriggerThreshold) {
		activeSide = 'right';
		cappedX = -swipeToTriggerThreshold + (diffX + swipeToTriggerThreshold) * 0.18;
	} else if (diffX > leftOpenWidth) {
		cappedX = leftOpenWidth + (diffX - leftOpenWidth) * 0.28;
	} else if (diffX < -rightOpenWidth) {
		cappedX = -rightOpenWidth + (diffX + rightOpenWidth) * 0.28;
	}

	return {
		cappedX,
		activeSide
	};
};

interface SwipeActionContainers {
	left: HTMLElement | null;
	right: HTMLElement | null;
}

export function getSwipeActionContainers(
	containerEl: HTMLElement,
	leftClass: string,
	rightClass: string,
): SwipeActionContainers {
	return {
		left: containerEl.querySelector(`.${leftClass}`) as HTMLElement | null,
		right: containerEl.querySelector(`.${rightClass}`) as HTMLElement | null,
	};
}

/** Синхронизирует ширину/видимость action-панелей со смещением контента. */
export function syncSwipeActionContainers(
	containers: SwipeActionContainers,
	cappedX: number,
	options?: {transition?: string},
): void {
	const {left, right} = containers;
	const transition = options?.transition;

	if (left) {
		if (transition !== undefined) left.style.transition = transition;
		left.style.width = cappedX > 0 ? `${Math.abs(cappedX)}px` : '0px';
		left.style.visibility = cappedX > 0 ? 'visible' : 'hidden';
	}

	if (right) {
		if (transition !== undefined) right.style.transition = transition;
		right.style.width = cappedX < 0 ? `${Math.abs(cappedX)}px` : '0px';
		right.style.visibility = cappedX < 0 ? 'visible' : 'hidden';
	}
}
