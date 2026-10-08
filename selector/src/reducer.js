import categories from './Schema'

const categoryState = (category) => ({
    category,
    controls: Object.fromEntries(Object.keys(categories[category].controls || {}).map((c) => [c, null])),
    filters: Object.fromEntries(Object.keys(categories[category].filters || {}).map((f) => [f, null])),
    rules: categories[category].rules || {},
    props: {},
    defaults: categories[category].defaults || {},
    validation: categories[category].validation || {}
})

export const initialState = {
    isOpen: true,
    previewOpen: false,
    formKey: 0, // remounts the (uncontrolled) form, even if the same category is picked again
    form: categoryState('Weapon'),
    preview: {}
}

const form = (state, action) => {
    switch (action.type) {
        case 'NEWITEM_FILTER_CHANGE': {
            const section = action.key in state.filters ? 'filters' : 'props'
            return {
                ...state,
                [section]: {
                    ...state[section],
                    [action.key]: action.val
                }
            }
        }
        case 'NEWITEM_PROP_CHANGE': {
            const { multiEffect: _multiEffect, ...restProps } = state.props
            return {
                ...state,
                controls: { ...state.controls, [action.key]: action.val },
                props: action.key === 'quality' ? restProps : state.props,
                rules: Object.fromEntries(
                    Object
                        .entries(state.rules)
                        .map(([ruleKey, rule]) => {
                            if (!(action.key in rule)) return [ruleKey, rule]
                            const matches = rule[action.key].includes(action.val)
                            return [ruleKey, { ...rule, hidden: rule.reverse ? matches : !matches }]
                        })
                )
            }
        }
        default:
            return state
    }
}

const preview = (state, action) => {
    switch (action.type) {
        case 'PREVIEW_ITEMS': {
            const items = action.items.reduce((acc, sku) => (acc[sku] = ({ sku, page: action.page }), acc), {})
            return {
                ...items,
                ...state
            }
        }
        case 'REMOVE_PREVIEW_ITEM': {
            const { [action.sku]: _oldItem, ...rest } = state
            return rest
        }
        default:
            return state
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'OPEN':
            return { ...state, isOpen: true }
        case 'CLOSE':
            return { ...state, isOpen: false }
        case 'TOGGLE_PREVIEW':
            return { ...state, previewOpen: !state.previewOpen }
        case 'CLEAR_PREVIEW':
            return { ...state, preview: {}, previewOpen: false }
        case 'CATEGORY_CHANGE':
            return { ...state, form: categoryState(action.category), formKey: state.formKey + 1 }
        default:
            return {
                ...state,
                form: form(state.form, action),
                preview: preview(state.preview, action)
            }
    }
}

// minimal per-instance store, so the component returned by the hook can stay referentially stable
export const createStore = (config) => {
    let snapshot = { state: initialState, config }
    const listeners = new Set()
    const emit = () => listeners.forEach(listener => listener())
    return {
        getSnapshot: () => snapshot,
        subscribe: (listener) => {
            listeners.add(listener)
            return () => listeners.delete(listener)
        },
        dispatch: (action) => {
            snapshot = { ...snapshot, state: reducer(snapshot.state, action) }
            emit()
        },
        setConfig: (config) => {
            snapshot = { ...snapshot, config }
            emit()
        }
    }
}
