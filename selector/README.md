# @juice789/tf2items-selector

A React hook that renders a TF2 item selector: pick a category, quality, killstreak tier, effect, filters and so on, stage the resulting SKUs in a preview list and hand them to your app.

The item data comes from [@juice789/tf2items](https://www.npmjs.com/package/@juice789/tf2items).

## Install

Two entry points, pick one:

| Import | Peer dependencies | Theming |
| --- | --- | --- |
| `@juice789/tf2items-selector` | `react`, `react-dom` | `theme` option only |
| `@juice789/tf2items-selector/themed` | `react`, `react-dom`, `styled-components@6` | your `ThemeProvider` + `theme` option |

Everything else (react-select, react-window, react-icons, the item schema...) is bundled.

```sh
npm i @juice789/tf2items-selector
# for /themed, if you don't have it already:
npm i styled-components
```

Both builds include the item schema, so expect around 4.3 MB unminified / 0.5 MB gzipped.

## Usage

```jsx
import { useItemSelector } from '@juice789/tf2items-selector'

const AddItems = () => {
    const { ItemSelector } = useItemSelector({
        onSave: async (items, { clear }) => {
            await saveToServer(Object.keys(items)) // ['513;11', '205;6', ...]
            clear() // skip this to keep the items if saving failed
        },
        onClose: ({ clear }) => {
            clear()
            hidePanel()
        }
    })

    // the selector fills its container, so the container decides the size
    return <div style={{ width: '25rem', height: '100vh' }}>
        <ItemSelector />
    </div>
}
```

## Options

| Option | Type | Description |
| --- | --- | --- |
| `pages` | `{ [id]: string }` | Shows a page picker when it has at least one entry, e.g. `{ 0: 'Page 1', 1: 'Page 2' }`. Each staged item gets the selected page id. Without pages every item gets page `'0'`. |
| `onSave` | `(items, { clear, close }) => void` | Called when Save is pressed in the preview list. `items` is `{ [sku]: { sku, page } }`. Nothing is cleared automatically. |
| `onClose` | `({ clear }) => void` | Called after the X button hides the selector. The staged items are kept unless you call `clear`. |
| `theme` | `object` | Partial theme, see [Theming](#theming). |
| `selectStyle` | `(theme, options) => object` | Returns the react-select `styles` object. Defaults to the exported `selectStyle`. |
| `toggleStyle` | `object` | Styles for the yes/no toggles ([@juice789/react-toggle](https://www.npmjs.com/package/@juice789/react-toggle) format). Defaults to the exported `toggleStyle`. |

## Return value

| Key | Description |
| --- | --- |
| `ItemSelector` | The component. Its identity is stable for the lifetime of the hook, so the form keeps its state across rerenders. |
| `items` | The staged items, `{ [sku]: { sku, page } }`. |
| `isOpen` | `false` after X or `close()`. A closed selector renders nothing. |
| `open()` / `close()` | Show or hide the selector. `close()` does not call `onClose`. |
| `clear()` | Empty the staged items and leave the preview list. |

## Theming

The selector reads these keys:

```js
import { defaultTheme } from '@juice789/tf2items-selector'

// {
//     fontColorHighlight, fontColor, fontColorDim, fontColorDisabled, buttonTextColor,
//     background1, background2, background3, background4,
//     mainColor, mainColorFade, successColor, errorColor, errorColorFade
// }
```

The final theme is merged per key: `{ ...defaultTheme, ...yourThemeProviderTheme, ...themeOption }`. Missing keys fall back to the defaults (a dark theme), so a theme with different key names still works. Map your own names in through the `theme` option:

```jsx
const { ItemSelector } = useItemSelector({
    theme: { mainColor: myTheme.accent, background1: myTheme.surface }
})
```

With `/themed`, a styled-components `ThemeProvider` above the selector is picked up automatically. The default entry has its own copy of styled-components, so it can't see your `ThemeProvider`. Use the `theme` option there.

`selectStyle` and `toggleStyle` are exported too, so you can extend them instead of starting from scratch:

```js
import { selectStyle } from '@juice789/tf2items-selector'

const mySelectStyle = (theme, options) => selectStyle(theme, { ...options, controlHeight: '2rem' })
```

## Notes

- The selector sets its own `box-sizing`, `[hidden]` and number-input styles, and inherits `font-family` from its container.
- The default entry's styled components use the `tf2items-selector-` class prefix, so they don't collide with your app's styled-components classes. In development, styled-components may still log a warning about multiple instances. Switch to `/themed` if you already use styled-components.
- ESM only. Requires React 18 or newer.
