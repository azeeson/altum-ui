# Иконки в altum

Компоненты принимают иконку как `ReactNode` — свой SVG или элемент из набора библиотеки.

```tsx
import {ButtonIcon} from 'altum';
import {IconSearch} from 'altum/icons';

<ButtonIcon aria-label="Поиск" icon={<IconSearch />} />
```

Набор **не** входит в главный barrel — только `altum/icons`. Просмотр: Storybook → **Icons**.

### Контракт для кастомных SVG

| Правило | Значение |
|---------|----------|
| Размер | `width` / `height` или проп `size` (16–24 px для кнопок) |
| Цвет | `fill="currentColor"` |
| Доступность | На `ButtonIcon` всегда `aria-label` |

Продуктовые иконки лучше держать в приложении — так не раздувается бандл, если набор `altum/icons` не нужен целиком.
