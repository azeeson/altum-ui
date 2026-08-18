import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export interface StorybookEntry {
	id: string;
	title: string;
	name: string;
	type: 'story' | 'docs';
	importPath: string;
}

export function loadStoryEntries(indexPath = resolve(process.cwd(), 'dist-storybook/index.json')): StorybookEntry[] {
	const raw = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
		entries: Record<string, {
			id: string;
			title: string;
			name: string;
			type: 'story' | 'docs';
			importPath: string;
		}>;
	};

	return Object.values(raw.entries)
		.filter((entry) => entry.type === 'story')
		.sort((a, b) => a.id.localeCompare(b.id));
}

export function getVisualStoryIds(options?: {
	includeExamples?: boolean;
}): string[] {
	const includeExamples = options?.includeExamples ?? false;

	return loadStoryEntries()
		.filter((entry) => includeExamples || !entry.id.includes('examples-'))
		.filter((entry) => !entry.id.includes('test-visualopenstates'))
		.map((entry) => entry.id);
}
