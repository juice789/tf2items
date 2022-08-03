import { takeEvery, put, select } from 'redux-saga/effects'

import { map, prop, reduce, max, keys, without } from 'ramda'

function* addPage({ label }) {
    const pages = yield select(prop('pages'))
    yield put({
        type: 'PAGE_ADDED',
        value: (reduce(max, 0, map(parseInt, keys(pages))) + 1).toString(),
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

    const pages = yield select(prop('pages'))
    const fallback = without([value], keys(pages))[0]

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