export const openedWidget = (state = 'items', action) => {
    switch (action.type) {
        case 'WIDGET_TOGGLE':
            return state === action.name ? null : action.name
        case 'WIDGET_CLOSE':
            return null
        default:
            return state
    }
}
