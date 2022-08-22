const { expectSaga } = require('redux-saga-test-plan')
const matchers = require('redux-saga-test-plan/matchers')

const assetClasses = require('./assetClasses.json')
const inventory = require('./inventory.json')
const expected = require('./expected.json')
const queryString = require('./queryString.json')

describe('fetchAppDataInventory', () => {

    const api = {
        getAssetClassInfo: jest.fn().mockReturnValue(assetClasses)
    }

    const { fetchAppDataInventory } = require('../../fetchAppDataInventory.js')

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('add the app_data to inventory', (done) => {

        expectSaga(fetchAppDataInventory, inventory)
            .provide([
                [matchers.getContext('api'), api]
            ])
            .run(false).then(storeState => {
                expect(storeState.returnValue).toEqual(expected)
                expect(api.getAssetClassInfo).toHaveBeenCalledWith(queryString)
                done()
            })

        Promise.resolve().then(() => {
            jest.advanceTimersByTime(1000)
            Promise.resolve()
        })
    })
})