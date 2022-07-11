const { runSaga } = require('redux-saga')
const { saveSchema } = require('./saveSchema.js')
const options = require('./options.json')
const api = require('./api.js')(options)

runSaga({
    context: { api }
}, saveSchema)