export const openedAside = (state = 'addItems', action) => {
    switch (action.type) {
        case 'ASIDE_TOGGLE':
            return state === action.name ? null : action.name
        case 'ASIDE_CLOSE':
            return null
        default:
            return state
    }
}