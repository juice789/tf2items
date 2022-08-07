import { takeEvery, select, put } from 'redux-saga/effects'
import { prop, groupBy, map, compose, values, evolve, indexBy, unnest, mapObjIndexed, assoc, objOf } from 'ramda'

function* exportState() {

    const items = yield select(compose(
        map(map(prop('sku'))),
        groupBy(prop('page')),
        values,
        prop('items')
    ))
    const pages = yield select(prop('pages'))

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ items, pages }));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tf2items.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

