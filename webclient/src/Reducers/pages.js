import { assoc, dissoc } from 'ramda'

const defaultPages = {
    '0': 'Page 0'
}

export const pages = (state = defaultPages, action) => {
    switch (action.type) {
        case 'PAGE_ADDED':
            return assoc(
                action.value,
                action.label,
                state
            )
        case 'PAGE_DELETED':
            return dissoc(action.value, state)
        default:
            return state
    }
}

export function selectedPage(state = '0', action) {
    switch (action.type) {
        case 'PAGE_CHANGE':
        case 'PAGE_ADDED':
            return action.value
        case 'PAGE_DELETED':
            return action.fallback
        default:
            return state
    }
}