import { all } from 'redux-saga/effects'
import { searchSaga } from './search'
import { pagesSaga } from './pages'

function* rootSaga() {
    yield all([
        searchSaga(),
        pagesSaga()
    ])
}

export default rootSaga