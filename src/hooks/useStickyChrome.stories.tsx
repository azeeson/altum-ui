import type {Meta} from '@storybook/react';
import React, {useRef} from 'react';
import {useStickyChrome} from './useStickyChrome';
import {componentParameters, story, Story} from '../storybook/meta';

const lines = Array.from({length: 12}, (_, index) => `Строка ${index + 1}`);
const taskLines = Array.from({length: 24}, (_, index) => `Задача ${index + 1}`);

const taskListCss = `
.altumTaskShell {
	height: 280px;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--altum-color-border);
	border-radius: var(--altum-g-radius);
	background: var(--altum-color-surface);
	overflow: hidden;
}
.altumTaskScroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	scrollbar-gutter: stable;
}
.altumTaskBar {
	position: sticky;
	top: 0;
	z-index: 1;
	padding: 12px 16px;
	background: transparent;
}
.altumTaskShell[data-workspace-scrolled] .altumTaskBar {
	background: color-mix(in srgb, var(--altum-color-bg) 72%, transparent);
	backdrop-filter: blur(8px);
}
.altumTaskTitle {
	margin: 0;
	font-size: 1.25rem;
	transform: scale(calc(1 - 0.12 * var(--demo-chrome-progress, 0)));
	transform-origin: left center;
}
@media (prefers-reduced-motion: reduce) {
	.altumTaskTitle {
		transform: none;
	}
}
.altumTaskRow {
	padding: 8px 16px;
}
.altumTaskForm {
	padding: 12px 16px;
	padding-right: calc(16px + var(--demo-scrollbar-size, 0px));
	border-top: 1px solid var(--altum-color-border);
}
`;

const shell: React.CSSProperties = {
	height: 200,
	overflow: 'auto',
	border: '1px solid var(--altum-color-border)',
	borderRadius: 'var(--altum-g-radius)',
	background: 'var(--altum-color-surface)',
};

const bar = (scrolled: boolean): React.CSSProperties => ({
	position: 'sticky',
	padding: '12px 16px',
	background: scrolled
		? 'var(--altum-color-bg)'
		: 'transparent',
});

function StartEdge() {
	const barRef = useRef<HTMLDivElement>(null);
	const scrolled = useStickyChrome(barRef, {offset: 0});
	return (
		<div style={shell}>
			<div
				ref={barRef}
				style={{
					...bar(scrolled),
					top: 0,
				}}
			>
				{scrolled ? 'Шапка уехала' : 'Шапка у верха'}
			</div>
			{lines.map((line) => (
				<div key={line} style={{padding: '8px 16px'}}>
					{line}
				</div>
			))}
		</div>
	);
}

function EndEdge() {
	const barRef = useRef<HTMLDivElement>(null);
	const scrolled = useStickyChrome(barRef, {
		edge: 'end',
		offset: 1,
	});
	return (
		<div style={shell}>
			{lines.map((line) => (
				<div key={line} style={{padding: '8px 16px'}}>
					{line}
				</div>
			))}
			<div
				ref={barRef}
				style={{
					...bar(scrolled),
					bottom: 0,
				}}
			>
				{scrolled ? 'До низа ещё есть ход' : 'Подвал у низа'}
			</div>
		</div>
	);
}

function TaskListShell() {
	const shellRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const barRef = useRef<HTMLDivElement>(null);
	useStickyChrome(barRef, {
		scrollRef,
		offset: 4,
		attribute: 'data-workspace-scrolled',
		host: shellRef,
		progress: {
			cssVar: '--demo-chrome-progress',
			rangePx: 120,
			easing: 'smoothstep',
		},
		scrollbarSize: {
			cssVar: '--demo-scrollbar-size',
			target: shellRef,
		},
	});
	return (
		<>
			<style>
				{taskListCss}
			</style>
			<div
				ref={shellRef}
				className='altumTaskShell'
				data-testid='chrome-shell'
			>
				<div
					ref={scrollRef}
					className='altumTaskScroll'
					data-testid='chrome-scroll'
				>
					<div
						ref={barRef}
						className='altumTaskBar'
					>
						<h2 className='altumTaskTitle'>
							Задачи
						</h2>
					</div>
					{taskLines.map((line) => (
						<div
							key={line}
							className='altumTaskRow'
						>
							{line}
						</div>
					))}
				</div>
				<div className='altumTaskForm'>
					Новая задача
				</div>
			</div>
		</>
	);
}

export default {
	title: 'altum/Hooks/useStickyChrome',
	parameters: componentParameters(
		'Липкий chrome: флаг и data-scrolled, прогресс 0…1 и ширина полосы в CSS-переменных. '
		+ 'Scrollport — предок с overflow, свой ref или окно.',
	),
} satisfies Meta;

export const Start: Story<typeof StartEdge> = {
	name: 'Край start',
	render: () => <StartEdge />,
	parameters: story('После сдвига от верха фон шапки включается.'),
};

export const End: Story<typeof EndEdge> = {
	name: 'Край end',
	render: () => <EndEdge />,
	parameters: story('Пока список не докручен до низа, подвал держит фон.'),
};

export const TaskList: Story<typeof TaskListShell> = {
	name: 'Оболочка списка',
	render: () => <TaskListShell />,
	parameters: story(
		'Атрибут на оболочке, масштаб заголовка от прогресса за 120px, правый отступ формы по ширине полосы.',
	),
};
