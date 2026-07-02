import { takeEvery, put, select } from 'redux-saga/effects'

function* addPage({ label }) {
    const pages = yield select(state => state.pages)
    yield put({
        type: 'PAGE_ADDED',
        value: (Math.max(...Object.keys(pages).map(page => parseInt(page))) + 1).toString(),
        label
    })
}

function* editPage({ value, label }) {
    yield put({
        type: 'PAGE_ADDED',
        value,
        label
    })
}

function* deletePage({ value }) {
    const pages = yield select(state => state.pages)
    const fallback = Object.keys(pages).filter(page => page !== value)[0]
    return yield put({
        type: 'PAGE_DELETED',
        value,
        fallback
    })
}

export function* pagesSaga() {
    yield takeEvery('PAGE_ADD', addPage)
    yield takeEvery('PAGE_EDIT', editPage)
    yield takeEvery('PAGE_DELETE', deletePage)
}