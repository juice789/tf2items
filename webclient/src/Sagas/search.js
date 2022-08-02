import { debounce, put } from 'redux-saga/effects'

function* processInput({ value }) {
    yield put({
        type: 'SEARCH_INPUT_ACTUAL',
        value
    })
}

export function* searchSaga() {
    yield debounce(500, 'SEARCH_INPUT', processInput)
}