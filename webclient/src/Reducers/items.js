import { mergeDeep } from '../utils'

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

const discardChanges = (data) => Object.fromEntries(
    Object
        .entries(data)
        .map(([sku, item]) => [
            sku,
            Object.fromEntries(
                Object
                    .entries(item)
                    .filter(([k]) => !k.startsWith('__'))
            )
        ])
)

const applyChanges = (data) => Object.fromEntries(
    Object
        .entries(data)
        .map(([sku, item]) => [
            sku,
            Object.fromEntries(
                Object
                    .entries(item)
                    .filter(([k]) => k.startsWith('__') && k !== '__toRemove')
                    .map(([k, v]) => [k.replace('__', ''), v])
            )
        ])
)

export const items = (state = defaultItems, action) => {
    switch (action.type) {
        case 'RESET_STATE':
            return defaultItems
        case 'NEW_STATE':
            return action.items
        case 'SAVE_ITEMS':
        case 'MASS_PROP_CHANGE':
            return mergeDeep(state, action.items)
        case 'RESET_CHANGE': {
            const { ['__' + action.p]: _oldProp, ...updatedItem } = state[action.sku]
            return {
                ...state,
                [action.sku]: updatedItem
            }
        }
        case 'RESET_CHANGES':
            return discardChanges(state)
        case 'USE_PAGES':
            return action.value === false
                ? Object.fromEntries(
                    Object.entries(state).map(([sku, item]) => [sku, { ...item, page: '0' }])
                )
                : state
        case 'SAVE_CHANGES': {
            const removeList = Object
                .keys(state)
                .filter(key => '__toRemove' in state[key])
            const remaining = Object.fromEntries(
                Object.entries(state).filter(([sku]) => !removeList.includes(sku))
            )
            return mergeDeep(discardChanges(remaining), applyChanges(remaining))
        }
        default:
            return state
    }
}

export function selectedItems(state = {}, action) {
    switch (action.type) {
        case 'RESET_STATE':
        case 'NEW_STATE':
        case 'TOGGLE_SELECTION':
            return {}
        case 'ITEM_SELECTED':
            if (action.sku in state) {
                const { [action.sku]: _oldItem, ...rest } = state
                return rest
            }
            return {
                ...state,
                [action.sku]: true
            }
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