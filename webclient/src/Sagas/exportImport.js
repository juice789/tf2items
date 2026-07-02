import { takeEvery, select, put } from 'redux-saga/effects'

function* exportState() {
    const state = yield select((state) => ({
        items: Object.fromEntries(
            Object
                .entries(Object.groupBy(Object.values(state.items), item => item.page))
                .map(([page, pageItems]) => [
                    page,
                    pageItems.map(item => item.sku)
                ])
        ),
        pages: state.pages,
        usePages: state.usePages
    }))

    var dataStr = "data:text/jsoncharset=utf-8," + encodeURIComponent(JSON.stringify(state))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "tf2items.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

function* importState({ importedState }) {
    const newState = {
        ...importedState,
        items: Object
            .entries(importedState.items)
            .reduce((acc, [page, skus]) => ({
                ...acc,
                ...skus.reduce((acc, sku) => (acc[sku] = { page, sku }, acc), {})
            }), {})
    }
    yield put({
        type: 'NEW_STATE',
        ...newState
    })
}

export function* exportImportSaga() {
    yield takeEvery('EXPORT_STATE', exportState)
    yield takeEvery('IMPORT_STATE', importState)
}

