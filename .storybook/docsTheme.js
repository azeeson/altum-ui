import { create } from '@storybook/theming';

/** Хром docs Storybook — светлая тема, в линии с токенами altum */
export const altumLightDocs = create({
  base: 'light',
  brandTitle: 'altum',
  brandUrl: undefined,
  colorPrimary: '#64748b',
  colorSecondary: '#475569',
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#f8fafc',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',
  barTextColor: '#64748b',
  barSelectedColor: '#64748b',
  barHoverColor: '#475569',
  barBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#0f172a',
  inputBorderRadius: 8,
});

/** Хром docs Storybook — тёмная тема, в линии с токенами altum */
export const altumDarkDocs = create({
  base: 'dark',
  brandTitle: 'altum',
  brandUrl: undefined,
  colorPrimary: '#94a3b8',
  colorSecondary: '#64748b',
  appBg: '#131721',
  appContentBg: '#1e1e24',
  appPreviewBg: '#131721',
  appBorderColor: '#2d2d34',
  appBorderRadius: 8,
  textColor: '#f8fafc',
  textInverseColor: '#131721',
  textMutedColor: '#94a3b8',
  barTextColor: '#94a3b8',
  barSelectedColor: '#94a3b8',
  barHoverColor: '#cbd5e1',
  barBg: '#1e1e24',
  inputBg: '#1e1e24',
  inputBorder: '#2d2d34',
  inputTextColor: '#f1f5f9',
  inputBorderRadius: 8,
});

export function getDocsTheme(mode) {
  return mode === 'dark' ? altumDarkDocs : altumLightDocs;
}
