import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { jest } from '@jest/globals'
import { fetchAppDataInventory } from '../../fetchAppDataInventory.js'

const require = createRequire(import.meta.url)
const { expectSaga } = require('redux-saga-test-plan')
const matchers = require('redux-saga-test-plan/matchers')

const __dirname = dirname(fileURLToPath(import.meta.url))
const assetClasses = JSON.parse(readFileSync(join(__dirname, './assetClasses.json'), 'utf-8'))
const inventory = JSON.parse(readFileSync(join(__dirname, './inventory.json'), 'utf-8'))
const expected = JSON.parse(readFileSync(join(__dirname, './expected.json'), 'utf-8'))
const queryString = JSON.parse(readFileSync(join(__dirname, './queryString.json'), 'utf-8'))

describe('fetchAppDataInventory', () => {

    const api = {
        getAssetClassInfo: jest.fn().mockReturnValue(assetClasses)
    }

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
