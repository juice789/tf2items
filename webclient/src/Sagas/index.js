import { all } from 'redux-saga/effects'
import { searchSaga } from './search'
import { pagesSaga } from './pages'
import { exportImportSaga } from './exportImport'
import { notificationSaga } from '@juice789/redux-saga-notifications'

function* rootSaga() {
    yield all([
        searchSaga(),
        pagesSaga(),
        notificationSaga(),
        exportImportSaga()
    ])
}

export default rootSaga