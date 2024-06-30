import {
    has, dissoc, assoc, indexBy, prop, map, omit, chain, pick, compose, filter, complement, startsWith, keys, replace, assocPath, mergeDeepRight, dissocPath, converge, evolve, ifElse, fromPairs, concat, __, when, mergeRight, includes, pickBy
} from 'ramda'

import { renameKeysWith } from 'ramda-adjunct'

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
        case 'RESET_STATE':
        case 'NEW_STATE':
            return defaultState
        case 'CATEGORY_CHANGE':
            return {
                ...state,
                category: action.category,
                controls: fromPairs(map(compose(concat(__, [null]), Array.of), action.controls)),
                filters: fromPairs(map(compose(concat(__, [null]), Array.of), action.filters)),
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
        case 'RESET_STATE':
        case 'NEW_STATE':
            return {}
        case 'PREVIEW_ITEMS':
            return mergeRight(
                indexBy(
                    prop('sku'),
                    map((sku) => ({ sku, page: action.page }), action.items)
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

const resetChanges = map(chain(
    pick,
    compose(
        filter(complement(startsWith('__'))),
        keys
    )
))

const applyChanges = compose(
    map(renameKeysWith(replace('__', ''))),
    map(chain(pick, compose(filter(startsWith('__')), keys))),
    map(omit(['__toRemove']))
)

export const items = (state = defaultItems, action) => {
    switch (action.type) {
        case 'RESET_STATE':
            return defaultItems
        case 'NEW_STATE':
            return action.items
        case 'SAVE_ITEMS':
        case 'MASS_PROP_CHANGE':
            return mergeDeepRight(state, action.items)
        case 'RESET_CHANGE':
            return dissocPath([action.sku, '__' + action.p], state)
        case 'RESET_CHANGES':
            return resetChanges(state)
        case 'USE_PAGES':
            return action.value === false ? map(assoc('page', '0'), state) : state
        case 'SAVE_CHANGES':
            const removeList = keys(pickBy(has('__toRemove'), state))
            return compose(
                converge(mergeDeepRight, [resetChanges, applyChanges]),
                omit(removeList)
            )(state)
        default:
            return state
    }
}

export function selectedItems(state = [], action) {
    switch (action.type) {
        case 'RESET_STATE':
        case 'NEW_STATE':
        case 'TOGGLE_SELECTION':
            return []
        case 'ITEM_SELECTED':
            return has(action.sku, state) ? dissoc(action.sku, state) : assoc(action.sku, true, state)
        case 'DESELECT_ALL':
        case 'RESET_CHANGES':
        case 'SAVE_CHANGES':
            return {}
        case 'SET_SELECTION':
            return action.items
        default:
            return state
    }
}