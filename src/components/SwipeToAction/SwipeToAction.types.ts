import React from 'react';

/**
 * Действие, раскрываемое свайпом (только touch).
 */
export interface SwipeAction {
	id: string;
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
	/** Цвет фона кнопки; по умолчанию `--altum-color-brand` */
	bg?: string;
	/**
	 * Full-swipe за порог запускает это действие (как destructive swipe в iOS).
	 * Можно задать любому действию стороны; если несколько — берётся первое с флагом.
	 */
	swipeToTrigger?: boolean;
}

/**
 * Свойства `SwipeToAction` — touch-обёртка без собственного chrome строки.
 */
export interface SwipeToActionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: React.ReactNode;
	/** Действия слева (свайп вправо). */
	leftActions?: SwipeAction[];
	/** Действия справа (свайп влево). */
	rightActions?: SwipeAction[];
	/** Закрывать раскрытые действия по клику снаружи. @default true */
	closeOnOutsideClick?: boolean;
	/**
	 * Смещение (px) для full-swipe trigger.
	 * Если ни у одного действия нет `swipeToTrigger` — порог не используется.
	 * @default 200
	 */
	swipeToTriggerThreshold?: number;
	/** Ширина одной кнопки действия, px. @default 76 */
	actionWidth?: number;
}

export interface TouchState {
	x: number;
	y: number;
	currentX: number;
}
