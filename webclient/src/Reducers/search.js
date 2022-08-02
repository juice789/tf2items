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