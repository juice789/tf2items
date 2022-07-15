import { has, always, assoc, assocPath, evolve, fromPairs, map, compose, concat, __, of, when, ifElse, prop, includes, omit, mergeRight, indexBy } from 'ramda'

const defaultState = {
    category: 'All items',
    controls: {},
    filters: {},
    rules: {},
    props: {},
    defaults: {},
    filterOpen: false,
    validation: {}
}

export function addItems(state = defaultState, action) {
    switch (action.type) {
        case 'ASIDE_TOGGLE':
            return defaultState
        case 'CATEGORY_CHANGE':
            return evolve({
                category: always(action.category),
                controls: () => fromPairs(map(compose(concat(__, [null]), of), action.controls)),
                filters: () => fromPairs(map(compose(concat(__, [null]), of), action.filters)),
                rules: always(action.rules || {}),
                props: {},
                defaults: always(action.defaults || {}),
                filterOpen: always(false),
                validation: always(action.validation || {}),
            }, state)
        case 'NEWITEM_FILTER_CHANGE':
            return assocPath(
                [has(action.key, state.filters) ? 'filters' : 'props', action.key],
                action.val,
                state
            )
        case 'NEWITEM_PROP_CHANGE':
            return evolve({
                controls: assoc(action.key, action.val),
                rules: map(
                    when(
                        has(action.key),
                        ifElse(
                            compose(includes(action.val), prop(action.key)),
                            (rule) => assoc('hidden', rule.reverse ? true : false, rule),
                            (rule) => assoc('hidden', rule.reverse ? false : true, rule)
                        )
                    )
                )
            }, state)
        case 'FILTER_TOGGLE':
            return {
                ...state,
                filterOpen: !state.filterOpen
            }
        default:
            return state
    }
}

export const tmpItems = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_ITEMS':
            return mergeRight(
                indexBy(
                    prop('sku'),
                    map((sku) => ({ sku }), action.items)
                ), state)
        case 'REMOVE_ITEM':
            return omit([action.sku], state)
        case 'CLEAR_ITEMS':
        case 'NEW_ITEMS':
            return {}
        default:
            return state
    }
}