import { useState, useLayoutEffect, useSyncExternalStore, useCallback, useMemo, useContext } from 'react'
import { ThemeProvider, ThemeContext } from 'styled-components'

import { createStore } from './reducer'
import { defaultTheme, selectStyle as defaultSelectStyle, toggleStyle as defaultToggleStyle } from './theme'
import ItemSelectorView from './ItemSelector'

const noop = () => { }

const createComponent = (store) => {
    const ItemSelector = () => {
        const { state, config } = useSyncExternalStore(store.subscribe, store.getSnapshot)
        // useContext instead of useTheme - useTheme throws when there is no ThemeProvider
        const hostTheme = useContext(ThemeContext)
        const theme = useMemo(
            () => ({ ...defaultTheme, ...hostTheme, ...config.theme }),
            [hostTheme, config.theme]
        )
        if (!state.isOpen) return null
        return <ThemeProvider theme={theme}>
            <ItemSelectorView state={state} dispatch={store.dispatch} config={config} />
        </ThemeProvider>
    }
    return ItemSelector
}

/**
 * @param {object} options
 * @param {Object<string, string>} [options.pages] - page row is shown when it has at least one page, e.g. { 0: 'Page 1', 1: 'Page 2' }
 * @param {function} [options.selectStyle] - (theme, options) => react-select styles
 * @param {object} [options.toggleStyle] - @juice789/react-toggle styles
 * @param {object} [options.theme] - partial theme, overrides the styled-components theme and the defaults
 * @param {function} [options.onSave] - (items, { clear, close }) => void, items: { [sku]: { sku, page } }
 * @param {function} [options.onClose] - ({ clear }) => void, called when the X button is pressed
 */
export const useItemSelector = ({
    pages,
    selectStyle = defaultSelectStyle,
    toggleStyle = defaultToggleStyle,
    theme,
    onSave = noop,
    onClose = noop
} = {}) => {
    const config = { pages, selectStyle, toggleStyle, theme, onSave, onClose }
    const [store] = useState(() => createStore(config))
    const [ItemSelector] = useState(() => createComponent(store))

    useLayoutEffect(() => {
        store.setConfig({ pages, selectStyle, toggleStyle, theme, onSave, onClose })
    }, [store, pages, selectStyle, toggleStyle, theme, onSave, onClose])

    const isOpen = useSyncExternalStore(store.subscribe, () => store.getSnapshot().state.isOpen)
    const items = useSyncExternalStore(store.subscribe, () => store.getSnapshot().state.preview)

    const open = useCallback(() => store.dispatch({ type: 'OPEN' }), [store])
    const close = useCallback(() => store.dispatch({ type: 'CLOSE' }), [store])
    const clear = useCallback(() => store.dispatch({ type: 'CLEAR_PREVIEW' }), [store])

    return { ItemSelector, items, isOpen, open, close, clear }
}
