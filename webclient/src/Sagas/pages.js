import { takeEvery, put, select } from 'redux-saga/effects'

import {
    map, prop, reduce, max, keys, without,
} from 'ramda'

function* addPage({ id, display, value, selectedPage }) {
    try {
        const pages = yield select(prop('pages'))

        if (typeof value !== 'string') {
            throw 'malformed input'
        }

        if (display === 'Edit' && !Object.keys(pages).includes(selectedPage)) {
            throw 'trying to update non existent page'
        }

        yield put({
            type: 'PAGE_ADDED',
            selectedPage: display === 'Edit' ? selectedPage : (reduce(max, 0, map(parseInt, keys(pages))) + 1).toString(),
            value,
            id
        })

    } catch (err) {
        console.log('error adding page', err)
    }
}

function* deletePage({ id, selectedPage }) {
    try {

        const pages = yield select(prop('pages'))

        if (!Object.keys(pages).includes(selectedPage)) {
            throw { message: 'Error: trying to delete non-existent page' }
        }

        const fallback = without([selectedPage], keys(pages))[1]

        return yield put({
            type: 'PAGE_DELETED',
            selectedPage,
            fallback,
            id
        })

    } catch (err) {
        console.log('error removing page', err)
    }
}

export function* pagesSaga() {
    yield takeEvery('PAGE_ADD', addPage)
    yield takeEvery('PAGE_EDIT', addPage)
    yield takeEvery('PAGE_DELETE', deletePage)
}