const defaultPages = {
    '0': 'Example items'
}

export const pages = (state = defaultPages, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export function selectedPage(state = '0', action) {
    switch (action.type) {
        case 'PAGE_CHANGE':
            return action.page
        case 'PAGE_ADDED':
            return action.selectedPage
        case 'PAGE_DELETED':
            return action.fallback
        default:
            return state
    }
}