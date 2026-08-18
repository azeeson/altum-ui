import React, {createContext, useContext} from 'react';
import type {TableContentProps, TableContextValue} from './Table.types';

export type {TableContextValue} from './Table.types';

export const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext(component: string): TableContextValue {
	const context = useContext(TableContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Table.Root.`);
	}
	return context;
}

function visitTableTree(
	node: React.ReactNode,
	visit: (element: React.ReactElement) => void,
): void {
	React.Children.forEach(node, (child) => {
		if (!React.isValidElement(child)) return;
		if (child.type === React.Fragment) {
			visitTableTree((child.props as {children?: React.ReactNode}).children, visit);
			return;
		}
		visit(child);
		const nested = (child.props as {children?: React.ReactNode}).children;
		if (nested != null) visitTableTree(nested, visit);
	});
}

function getElementDisplayName(element: React.ReactElement): string | undefined {
	return (element.type as {displayName?: string}).displayName;
}

export function getTableState(children: React.ReactNode): Pick<TableContextValue, 'loading' | 'isEmpty'> {
	let loading = false;
	let data: unknown[] | undefined;
	visitTableTree(children, (element) => {
		const displayName = getElementDisplayName(element);
		const props = element.props as TableContentProps<object> & {loading?: boolean};
		if (displayName === 'Table.Loading' && props.loading) {
			loading = true;
		}
		if (displayName === 'Table.Content' || (Array.isArray(props.data) && Array.isArray(props.columns))) {
			data = props.data;
		}
	});
	return {
		loading,
		isEmpty: Array.isArray(data) && data.length === 0,
	};
}
