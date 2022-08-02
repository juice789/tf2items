import { has, assoc, assocPath, evolve, fromPairs, map, compose, concat, __, of, when, ifElse, prop, includes, omit, mergeRight, indexBy } from 'ramda'

const defaultState = {
    category: '',
    controls: {},
    filters: {},
    rules: {},
    props: {},
    defaults: {},
    validation: {}
}

export function addItems(state = defaultState, action) {
    switch (action.type) {
        case 'ASIDE_TOGGLE':
            return defaultState
        case 'CATEGORY_CHANGE':
            return {
                ...state,
                category: action.category,
                controls: fromPairs(map(compose(concat(__, [null]), of), action.controls)),
                filters: fromPairs(map(compose(concat(__, [null]), of), action.filters)),
                rules: action.rules,
                props: {},
                defaults: action.defaults,
                validation: action.validation
            }
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
        default:
            return state
    }
}

export const preview = (state = {}, action) => {
    switch (action.type) {
        case 'PREVIEW_ITEMS':
            return mergeRight(
                indexBy(
                    prop('sku'),
                    map((sku) => ({ sku, page: '0' }), action.items)
                ), state)
        case 'REMOVE_PREVIEW_ITEM':
            return omit([action.sku], state)
        case 'CLEAR_PREVIEW':
        case 'SAVE_ITEMS':
            return {}
        default:
            return state
    }
}

const defaultItems = {
    '5021;6': {
        page: '0',
        sku: '5021;6'
    },
    '5002;6': {
        page: '0',
        sku: '5002;6'
    },
    '5001;6': {
        page: '0',
        sku: '5001;6'
    },
    '5000;6': {
        page: '0',
        sku: '5000;6'
    },
    '725;6': {
        page: '0',
        sku: '725;6'
    },
    '162;6': {
        page: '0',
        sku: '162;6'
    },
    '143;6': {
        page: '0',
        sku: '143;6'
    }
}

export const items = (state = defaultItems, action) => {
    switch (action.type) {
        case 'SAVE_ITEMS':
            return mergeRight(state, action.items)
        default:
            return state
    }
}