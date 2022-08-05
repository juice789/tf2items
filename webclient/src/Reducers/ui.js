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

export function search(state = { value: '', flag: false }, action) {
    switch (action.type) {
        case 'SEARCH_INPUT_ACTUAL':
            return {
                ...state,
                value: action.value
            }
        case 'SEARCH_CLEAR':
            return {
                value: '',
                flag: false
            }
        case 'PAGE_CHANGE':
            return {
                value: '',
                flag: true
            }
        default:
            return state
    }
}

export function sort(state = { sortType: 'SORT_DEFAULT', sortMode: null }, action) {
    switch (action.type) {
        case 'SORT_DEFAULT':
            return {
                sortType: 'SORT_DEFAULT',
                sortMode: null
            }
        case 'SORT_NAME':
            return {
                sortType: action.type,
                sortMode: (action.type !== state.sortType || !state.sortMode) ? 'ASC' : state.sortMode === 'ASC' ? 'DESC' : 'ASC'
            }
        default:
            return state
    }
}