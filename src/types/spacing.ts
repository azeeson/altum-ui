/** Шкала отступов layout-компонентов → CSS variables 8pt grid. */
export type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Токен, число (px) или произвольная CSS-строка. */
export type SpacingValue = SpacingToken | number | string;

/** Промежуток в группах чипов / кнопок. */
export type GroupGap = 'sm' | 'md' | 'lg';
