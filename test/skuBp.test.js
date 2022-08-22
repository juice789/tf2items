const { toBpQuality, toBpName, toBpPriceIndex, toBpSku } = require('../skuBp.js')

describe('toBpQuality', () => {
    const tests = {
        '5021;6': 'Unique',
        '1013;1': 'Genuine',
        '35;3': 'Vintage',
        '200;11': 'Strange',
        '939;13': 'Haunted',
        '36;14': "Collector's",
        '9258;5;uncraftable;td-438': 'Unusual',
        '190;0': 'Normal',
        '15008;15;pk-5;w-1': 'Decorated Weapon',
        '15008;5;strange;u-701;pk-5;w-1': 'Strange',
        '518;5;strange;u-8': 'Strange Unusual'
    }

    it('should return the backpack.tf quality from sku', () => {
        for (let sku in tests) {
            expect(toBpQuality(sku)).toEqual(tests[sku])
        }
    })
})

describe('toBpPriceIndex', () => {
    const tests = {
        '5021;6': '',
        '31000;5;u-120': '120',
        '6523;6;uncraftable;kt-2;td-656': '2-656',
        '20003;6;kt-3;td-36;od-6526;oq-6': '6526-6-36',
        '20000;6;td-393;od-6522;oq-6': '6522-6-393',
        '20006;6;od-30330;oq-14': '30330-14',
        '9258;5;uncraftable;td-463': '463'
    }
    it('returns the backpack.tf price index', () => {
        for (let sku in tests) {
            expect(toBpPriceIndex(sku)).toEqual(tests[sku])
        }
    })
})