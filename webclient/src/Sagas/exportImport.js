import { takeEvery, select, put } from 'redux-saga/effects'
import { prop, groupBy, map, compose, values, evolve, indexBy, unnest, mapObjIndexed, assoc, objOf, pick } from 'ramda'

function* exportState() {

    const state = yield select(compose(
        evolve({
            items: compose(
                map(map(prop('sku'))),
                groupBy(prop('page')),
                values,
            )
        }),
        pick(['items', 'pages', 'usePages'])
    ))

    var dataStr = "data:text/jsoncharset=utf-8," + encodeURIComponent(JSON.stringify(state))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "tf2items.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

function* importState({ importedState }) {

    const newState = evolve({
        items: compose(
            indexBy(prop('sku')),
            unnest,
            values,
            mapObjIndexed((v, k, o) => map(compose(assoc('page', k), objOf('sku')), v))
        )
    }, importedState)

    yield put({
        type: 'NEW_STATE',
        ...newState
    })
}

export function* exportImportSaga() {
    yield takeEvery('EXPORT_STATE', exportState)
    yield takeEvery('IMPORT_STATE', importState)
}

