# Layout-компоненты altum

Гайд: **что выбрать** и **зачем**, для панели `Layout`, flex-примитивов (`Stack`, `Inline`, `Split`, `ControlRow`, `LayoutItem`) и точечного зазора `Gap`.

Стили — CSS Modules + токены `--altum-g-space-*` (8pt).

```tsx
import {
  Layout,
  Stack,
  Inline,
  Split,
  ControlRow,
  LayoutItem,
  Box,
  Grid,
  Container,
  Page,
  Gap,
} from 'altum';
```

Связанные: **TextField** — см. [COMPONENTS.md](./COMPONENTS.md).

---

## Быстрый выбор

| Задача | Компонент |
|--------|-----------|
| Панель: шапка + скролл корня + футер (Modal / Sheet / страница) | **Layout** + Header / Content / Footer |
| Блоки друг под другом (форма, секции) | **Stack** |
| Чипы / теги / мелкие кнопки в ряд с переносом | **Inline** |
| Слева заголовок, справа действия | **Split** |
| Поля + Chip + Button в одной строке фильтров | **ControlRow** |
| Одному ребёнку — `flex: 1` или «не сжимать» | **LayoutItem** (`ControlRow.Item`) |
| Колонки сетки | **Grid** |
| Один дополнительный шаг между двумя соседями | **Gap** |
| Оболочка input (label / prefix / clear) | **TextField** |

---

## Общие токены

| Тип | Значения | Назначение |
|-----|----------|------------|
| `LayoutGap` | `none` \| `xs` \| `sm` \| `md` \| `lg` \| `xl` | Промежуток → `--altum-g-space-*` |
| `LayoutAlign` | `start` \| `center` \| `end` \| `baseline` \| `stretch` | Поперечная ось |
| `LayoutJustify` | `start` \| `center` \| `end` \| `between` \| `around` \| `evenly` | Главная ось (у **Split** фиксирован `space-between`) |

Не задавайте `gap` в px — только шкала токенов.

---

## Layout (панель)

Корневая **колонка** для Modal, Sheet, Sidebar, страницы: **скролл на `Layout`**, шапка/футер опционально липкие.

### Состав

| Часть | Роль | Ключевые пропсы |
|-------|------|-----------------|
| `Layout` | Корень-scrollport (`overflow-y: auto`, flex-колонка) | `as`, `padding` (отступ корня), `gap` (между секциями). Оба: `sm` 12px, `md` 16px, `lg` 24px |
| `Layout.Header` | Шапка | `sticky`, `as="header"` |
| `Layout.Content` | Середина (без собственного overflow) | `as` |
| `Layout.Footer` | Низ с действиями | `sticky`, `align` (`start` \| `center` \| `end` \| `space-between`), `as="footer"` |

`sticky` — элемент остаётся у края при скролле **`Layout`**. Без `sticky` Header/Footer уезжают вместе с контентом.

### Когда использовать

- диалог / sheet / sidebar с заголовком и кнопками внизу;
- страница-оболочка с фиксированной шапкой и скроллом тела.

### Когда не использовать

- только вертикальный ритм полей → **Stack**;
- toolbar «слева / справа» без панели → **Split**;
- сетка колонок → **Grid**.

### Пример (sticky chrome)

```tsx
<Layout>
  <Layout.Header sticky>
    <Split>
      <h2>Настройки</h2>
      <Button variant="ghost" data-icon-only aria-label="Закрыть" prefix={<IconCross />} />
    </Split>
  </Layout.Header>
  <Layout.Content>
    <Stack gap="md">
      {/* поля */}
    </Stack>
  </Layout.Content>
  <Layout.Footer sticky>
    <Split>
      <Button variant="secondary">Отмена</Button>
      <Button variant="primary">Сохранить</Button>
    </Split>
  </Layout.Footer>
</Layout>
```

### Состав объекта

На `Layout` висят только `Layout.Header`, `Layout.Content` и `Layout.Footer`.

`Inline`, `Split`, `ControlRow` и `LayoutItem` — отдельные компоненты, их импортируют по имени.

Также экспортируются: `LayoutRoot`, `LayoutHeader`, `LayoutContent`, `LayoutFooter`.

---

## Stack

Вертикальный flex-стек с токенным `gap`. Всегда `width: 100%` родителя — ширину ограничивает родитель.

| Проп | По умолчанию | Смысл |
|------|--------------|--------|
| `gap` | `md` | Вертикальный ритм |
| `align` | `stretch` | Поперечная ось |
| `justify` | `start` | Главная ось |
| `as` | `div` | `div` \| `section` \| `ul` \| `ol` \| `nav` |

**Использовать:** поля формы друг под другом; секции с одинаковым вертикальным шагом; колонка в `Layout.Content`.

**Не использовать:** одна линия → Inline / ControlRow / Split; колонки → Grid.

```tsx
<Stack gap="md" align="stretch">
  <TextField label="Имя" width="full" />
  <TextField label="Эл. почта" width="full" />
  <Button variant="primary">Сохранить</Button>
</Stack>
```

---

## Inline

Горизонтальный **кластер с переносом** (чипы, теги, бейджи, мелкие кнопки). Всегда `width: 100%` родителя.

| Проп | По умолчанию |
|------|--------------|
| `gap` | `sm` |
| `align` | `center` |
| `justify` | `start` |
| `wrap` | `true` |

**Использовать:** группы чипов/тегов; label + badge + icon; естественный wrap на узкой ширине.

**Не использовать:** заголовок слева / действия справа → **Split**; ряд полей формы → **ControlRow**; вертикальный список → **Stack**.

```tsx
<Inline gap="sm">
  <Chip>Дизайн</Chip>
  <Chip>Разработка</Chip>
  <Chip>QA</Chip>
</Inline>
```

---

## Split

Горизонтальный ряд с **`justify-content: space-between`** (края контейнера). Всегда `width: 100%` родителя.

| Проп | По умолчанию | Примечание |
|------|--------------|------------|
| `gap` | `md` | Между левой и правой группами при сжатии |
| `align` | `center` | |
| `justify` | — | Нет: всегда space-between |

Обычно **два** ребёнка (левая и правая группы); внутри часто **Inline**.

| **Использовать:** заголовок страницы (title + действия); строка списка (имя + меню); футер «Отмена \| Сохранить» по краям.

**Не использовать:** группа кнопок без «разъезда» к краям → **Inline**; ряд полей → **ControlRow**.

```tsx
<Split>
  <Inline gap="sm" align="center">
    <Text as="h1">Проекты</Text>
    <Badge>12</Badge>
  </Inline>
  <Inline gap="sm">
    <Button variant="secondary">Экспорт</Button>
    <Button variant="primary">Создать</Button>
  </Inline>
</Split>
```

---

## ControlRow

Ряд **смешанных контролов** формы и фильтров (TextField + Chip + Button + Select). Всегда `width: 100%` родителя. По умолчанию `role="group"`.

| Проп | По умолчанию | Смысл |
|------|--------------|--------|
| `gap` | `sm` | Между контролами |
| `align` | `center` | `center` — Chip/Button; `end` — рядом с floating-label; `baseline` — по тексту |
| `justify` | `start` | |
| `wrap` | `true` | |

Ячейка с ростом: **`ControlRow.Item`** (= `LayoutItem`).

**Использовать:** панель фильтров; Select + «Сброс»; несколько контролов в линию с общим выравниванием по высоте контрола.

**Не использовать:** только чипы → **Inline**; заголовок/действия по краям → **Split**; вертикальная форма → **Stack**.

```tsx
<ControlRow align="end" gap="sm">
  <ControlRow.Item grow>
    <TextField label="Поиск" width="full" />
  </ControlRow.Item>
  <Button variant="secondary">Сброс</Button>
</ControlRow>
```

---

## LayoutItem

Flex-ячейка внутри Stack / Inline / Split / ControlRow.

| Проп | По умолчанию | Смысл |
|------|--------------|--------|
| `grow` | `false` | `flex: 1` — занять оставшееся место |
| `shrink` | `true` | `false` — кнопка/чип не сжимаются |

Алиас: `ControlRow.Item`.

**Использовать:** поле поиска растягивается, кнопка — по контенту; иконка/чип с `shrink={false}`.

**Не нужен:** для обычных детей, которым не нужны `grow` / `shrink`.

```tsx
<ControlRow>
  <LayoutItem grow>
    <SearchField label="Поиск" width="full" />
  </LayoutItem>
  <LayoutItem shrink={false}>
    <Button>Найти</Button>
  </LayoutItem>
</ControlRow>
```

---

## Gap

Пустой зазор фиксированного размера. Общий ритм группы по-прежнему задаёт `gap` у **Stack** / **Inline**. **Gap** — один дополнительный шаг между двумя соседями или зазор вне flex-примитива. Линия — **Separator**.

| Проп | По умолчанию | Смысл |
|------|--------------|--------|
| `size` | `md` | Токен `none`…`xl` (как `gap` у Stack), число (px) или CSS-строка |
| `orientation` | `horizontal` | `horizontal` — высота между блоками; `vertical` — ширина в ряду |

**Использовать:** отделить подвал формы от полей сильнее, чем общий `gap`; вставить шаг в разметке, которая не обёрнута в Stack / Inline.

**Не использовать:** одинаковый ритм у всех детей → `gap` у **Stack** / **Inline**; линия между секциями → **Separator**.

```tsx
<Stack gap="md">
  <TextField label="Имя" width="full" />
  <TextField label="Эл. почта" width="full" />
  <Gap size="lg" />
  <Button variant="primary">Сохранить</Button>
</Stack>
```

```tsx
<Inline gap="none">
  <Text>Профиль</Text>
  <Gap orientation="vertical" size="md" />
  <Text>Настройки</Text>
</Inline>
```

---

## Типичные композиции

### Тулбар страницы

```tsx
<Stack gap="lg">
  <Split>
    <Text as="h1">Команда</Text>
    <Button variant="primary">Пригласить</Button>
  </Split>
  <ControlRow>
    <ControlRow.Item grow>
      <SearchField label="Поиск" width="full" />
    </ControlRow.Item>
    <Inline gap="sm">
      <Chip mode="toggle">Все</Chip>
      <Chip>Активные</Chip>
    </Inline>
  </ControlRow>
</Stack>
```

---

## Частые ошибки

| Ошибка | Как правильно |
|--------|----------------|
| `Inline` для «заголовок \| действия» | **Split** |
| `Stack` для чипов в ряд | **Inline** |
| `div` + `display:flex` + px `gap` | **Stack** / **Inline** с токенами |
| Оборачивать всё в `LayoutItem` | Только где нужны `grow` / `shrink` |
| Путать `Layout` и `TextField` | `Layout` — панель UI; `TextField` — оболочка поля ввода |
