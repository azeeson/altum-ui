/** id вкладки для связи `tab` и `tabpanel`. */
export function tabTriggerDomId(tabsId: string, value: string): string {
	return `${tabsId}-tab-${value}`;
}

/** id панели вкладки. */
export function tabPanelDomId(tabsId: string, value: string): string {
	return `${tabsId}-tabpanel-${value}`;
}
