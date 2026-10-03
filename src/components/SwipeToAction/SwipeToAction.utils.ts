import type {SwipeAction} from './SwipeToAction.types';
import {rubberBand} from '../../core/utils/math';

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

	if (diffX > 0 && !hasLeftActions) {
		return {
			cappedX: 0,
			activeSide: null,
		};
	}
	if (diffX < 0 && !hasRightActions) {
		return {
			cappedX: 0,
			activeSide: null,
		};
	}

	if (hasLeftTrigger && diffX > swipeToTriggerThreshold) {
		activeSide = 'left';
		cappedX = rubberBand(diffX, swipeToTriggerThreshold, 0.18);
	} else if (hasRightTrigger && diffX < -swipeToTriggerThreshold) {
		activeSide = 'right';
		cappedX = rubberBand(diffX, swipeToTriggerThreshold, 0.18);
	} else if (diffX > leftOpenWidth) {
		cappedX = rubberBand(diffX, leftOpenWidth, 0.28);
	} else if (diffX < -rightOpenWidth) {
		cappedX = rubberBand(diffX, rightOpenWidth, 0.28);
	}

	return {
		cappedX,
		activeSide,
	};
};
