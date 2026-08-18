import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
	// Игнорируем системные папки и папки сборки
	{
		ignores: [
			'dist',
			'dist-storybook',
			'dist-test-types',
			'node_modules',
			'.storybook/**',
			// Cursor skills / agent tooling — не часть библиотеки
			'.cursor/**',
			'agent-transcripts/**',
			'scripts/**',
			// Сгенерированные d.ts после build — не линтить
			'types/**',
		],
	},
	
	js.configs.recommended,
	...tseslint.configs.recommended,
	
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'@stylistic': stylistic,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			// ==========================================
			// 1. ЛУЧШИЕ ПРАКТИКИ (Best Practices)
			// ==========================================
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off', // Не нужен импорт React в React 17+
			'react/prop-types': 'off', // Типы задаются через TypeScript
            "react/jsx-wrap-multilines": ["error", {
                "logical": "parens-new-line",
                "prop": "parens-new-line",
            }],
			'prefer-const': 'error',           // Требовать const, если переменная не меняется
			'no-console': ['warn', { allow: ['warn', 'error'] }], // Запрет console.log
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'error',
			'no-restricted-imports': ['error', {
				patterns: [{
					group: [
						'**/base/*/*',
						'../ButtonBase/*',
						'../DialogBase/*',
						'../FieldBase/*',
						'../ChartBase/*',
						'../ToggleControlBase/*',
						'../MediaRowBase/*',
						'../ListOptionBase/*',
					],
					message: 'Import from the folder barrel (e.g. ../../base/ButtonBase), not a nested file.',
				}],
			}],

			// ==========================================
			// 2. ОТСТУПЫ, КАВЫЧКИ И ИМПОРТЫ
			// ==========================================
			'@stylistic/indent': ['error', 'tab', { SwitchCase: 1 }], // Табы для кода
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }], // Одинарные кавычки
			'@stylistic/object-curly-spacing': ['error', 'never'], // Без пробелов в импортах и объектах {Prop}

			// ==========================================
			// 3. ФОРМАТИРОВАНИЕ REACT / JSX
			// ==========================================
			// jsx-indent deprecated и конфликтует с indent (CircularFixesWarning) — отступы JSX через @stylistic/indent
			'@stylistic/jsx-indent-props': ['error', 'tab'], // Табы для пропсов
			'@stylistic/jsx-quotes': ['error', 'prefer-single'], // Одинарные кавычки в JSX
			
			// Если у компонента больше 1 атрибута — автоматически переносить каждый на новую строку
			'@stylistic/jsx-max-props-per-line': ['error', { maximum: { single: 2, multi: 1 } }],
            
			// Переносить первый атрибут на новую строку, если сам тег разбивается на несколько строк
            '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
			
			// Автоматический перенос текста и выражений внутри многострочных JSX-тегов
			'@stylistic/jsx-one-expression-per-line': ['error', { allow: 'none' }],
			
			// Выравнивание закрывающих скобок тегов
			'@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
			// jsx-closing-tag-location конфликтует с indent / jsx-one-expression-per-line
			// (ESLintCircularFixesWarning) — безопасного autofix нет, правило отключено.
			'@stylistic/jsx-closing-tag-location': 'off',

			// ==========================================
			// 4. МАССИВЫ, ОБЪЕКТЫ И ФУНКЦИИ
			// ==========================================
			// Автоматический перенос элементов массива в столбик, если их 4 и более
			'@stylistic/array-element-newline': ['error', { multiline: true, minItems: 4 }],
			'@stylistic/array-bracket-newline': ['error', { multiline: true }],
			
			// Автоматический перенос свойств объектов на новые строки
			'@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
			'@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }],
			
			// Настройки для переноса параметров функций
			'@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
			'@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/operator-linebreak': ['error', 'before', {
				overrides: {
					'=': 'after',
					'+=': 'after',
					'-=': 'after',
					'*=': 'after',
					'/=': 'after',
					'%=': 'after',
					'**=': 'after',
					'<<=': 'after',
					'>>=': 'after',
					'>>>=': 'after',
					'&=': 'after',
					'|=': 'after',
					'^=': 'after',
					'&&=': 'after',
					'||=': 'after',
					'??=': 'after',
				},
			}],

			// ==========================================
			// 5. ОГРАНИЧЕНИЕ ДЛИНЫ СТРОКИ (max-len)
			// ==========================================
			'@stylistic/max-len': ['error', { 
				code: 120, 
				tabWidth: 4, 
				ignoreComments: true, 
				ignoreUrls: true,
				ignoreStrings: true, // Игнорировать длинный текст (например, алерты)
				// Исключения для строк, которые технически нельзя автоматически перенести (JSX, цепочки || и &&, хуки)
				ignorePattern: '^\\s*<.*|className=.*|id=.*|(\\|\\||&&)|use[A-Z].*\\('
			}],
		},
	}
);
