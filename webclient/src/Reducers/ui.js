export const openedAside = (state = null, action) => {
    switch (action.type) {
        case 'RESET_STATE':
        case 'NEW_STATE':
            return null
        case 'ASIDE_TOGGLE':
            return state === action.name ? null : action.name
        case 'ASIDE_CLOSE':
            return null
        default:
            return state
    }
}

const defaultSearch = { value: '', flag: false }

export function search(state = defaultSearch, action) {
    switch (action.type) {
        case 'RESET_STATE':
        case 'NEW_STATE':
            return defaultSearch
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

const defaultSort = { sortType: 'SORT_DEFAULT', sortMode: null }

export function sort(state = { sortType: 'SORT_DEFAULT', sortMode: null }, action) {
    switch (action.type) {
        case 'RESET_STATE':
        case 'NEW_STATE':
            return defaultSort
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