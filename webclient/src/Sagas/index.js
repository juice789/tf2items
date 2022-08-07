import { all } from 'redux-saga/effects'
import { searchSaga } from './search'
import { pagesSaga } from './pages'
import { exportImportSaga } from './exportImport'
import { saga as notificationsSaga } from '@juice789/redux-saga-notifications'

function* rootSaga() {
    yield all([
        searchSaga(),
        pagesSaga(),
        notificationsSaga(),
        exportImportSaga()
    ])
}

export default rootSaga