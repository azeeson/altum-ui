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
  colorPrimary: '#4e6480',
  colorSecondary: '#A8A8B3',
  appBg: '#141416',
  appContentBg: '#1f1e24',
  appPreviewBg: '#141416',
  appBorderColor: '#2a2a32',
  appBorderRadius: 8,
  textColor: '#f8fafc',
  textInverseColor: '#141416',
  textMutedColor: '#A8A8B3',
  barTextColor: '#A8A8B3',
  barSelectedColor: '#4e6480',
  barHoverColor: '#5d7694',
  barBg: '#1f1e24',
  inputBg: '#2a2a32',
  inputBorder: '#2e2e36',
  inputTextColor: '#f1f5f9',
  inputBorderRadius: 8,
});

export function getDocsTheme(mode) {
  return mode === 'dark' ? altumDarkDocs : altumLightDocs;
}
