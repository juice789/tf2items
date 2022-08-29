const { blanketify } = require('../blanket.js')
const { sortBy, prop } = require('ramda')

const sortBySku = sortBy(prop('sku'))

describe('blanketify', () => {

    it('should return a single result', () => {
        const skus = ['518;1', '518;11']
        const sku = '518;1;strange'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '518;1',
                originalSku: '518;1;strange'
            }
        ]))
    })

    it('should return a single result 2', () => {
        const skus = ['30066;5;u-57']
        const sku = '30066;5;strange;u-57;kt-3'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '30066;5;u-57',
                originalSku: '30066;5;strange;u-57;kt-3'
            }
        ]))
    })

    it('should return multiple results', () => {
        const skus = ['210;11', '210;11;kt-3', '210;11;festive']
        const sku = '210;11;kt-3;festive'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '210;11',
                originalSku: '210;11;kt-3;festive'
            },
            {
                sku: '210;11;kt-3',
                originalSku: '210;11;kt-3;festive'
            },
            {
                sku: '210;11;festive',
                originalSku: '210;11;kt-3;festive'
            }
        ]))
    })

    it('blanket unusual example', () => {
        const skus = ['177;5']
        const sku = '177;5;u-79'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '177;5',
                originalSku: '177;5;u-79'
            }
        ]))
    })

    it('blanket unusual, + exact effect too', () => {
        const skus = ['177;5', '177;5;u-79']
        const sku = '177;5;u-79'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '177;5',
                originalSku: '177;5;u-79'
            },
            {
                sku: '177;5;u-79',
                originalSku: '177;5;u-79'
            }
        ]))
    })

    it('blanket war paints', () => {
        const skus = ['9536;15', '17235;15;pk-235', '9536;15;w-1']
        const sku = '17235;15;pk-235;w-1'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '9536;15',
                originalSku: '17235;15;pk-235;w-1'
            },
            {
                sku: '17235;15;pk-235',
                originalSku: '17235;15;pk-235;w-1'
            },
            {
                sku: '9536;15;w-1',
                originalSku: '17235;15;pk-235;w-1'
            }
        ]))
    })

    it('blanket unusual war paints', () => {
        const skus = ['9536;5', '9536;5;u-701', '9536;5;strange;u-701', '17251;5;u-701;pk-251;w-1', '17252;5;strange;u-702;pk-252;w-3', '17252;5;u-702;pk-252;w-3']
        const sku = '17251;5;strange;u-701;pk-251;w-1'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '9536;5',
                originalSku: '17251;5;strange;u-701;pk-251;w-1'
            },
            {
                sku: '9536;5;u-701',
                originalSku: '17251;5;strange;u-701;pk-251;w-1'
            },
            {
                sku: '9536;5;strange;u-701',
                originalSku: '17251;5;strange;u-701;pk-251;w-1'
            },
            {
                sku: '17251;5;u-701;pk-251;w-1',
                originalSku: '17251;5;strange;u-701;pk-251;w-1'
            }
        ]))
    })

    it('blanket unusual weapons', () => {
        const skus = ['211;5', '211;5;u-704']
        const sku = '15008;5;u-704;pk-5;w-1'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '211;5',
                originalSku: '15008;5;u-704;pk-5;w-1'
            },
            {
                sku: '211;5;u-704',
                originalSku: '15008;5;u-704;pk-5;w-1'
            }
        ]))
    })

    it('blanket unusual weapons 2', () => {
        const skus = ['211;5', '211;5;u-702', '211;5;strange;u-702']
        const sku = '211;5;strange;u-702;pk-284;w-2'
        expect(sortBySku(blanketify(null, skus, sku))).toEqual(sortBySku([
            {
                sku: '211;5',
                originalSku: '211;5;strange;u-702;pk-284;w-2'
            },
            {
                sku: '211;5;u-702',
                originalSku: '211;5;strange;u-702;pk-284;w-2'
            },
            {
                sku: '211;5;strange;u-702',
                originalSku: '211;5;strange;u-702;pk-284;w-2'
            }
        ]))
    })

    it('blanket kit', () => {
        const skus = ['6527;6;uncraftable;kt-1']
        const sku = '6527;6;uncraftable;kt-1;td-35'
        expect(sortBySku(blanketify(['target'], skus, sku))).toEqual(sortBySku([
            {
                sku: '6527;6;uncraftable;kt-1',
                originalSku: '6527;6;uncraftable;kt-1;td-35'
            }
        ]))
    })

    it('not in sku list at all', () => {
        const skus = ['5021;6']
        const sku = '6527;6;uncraftable;kt-1;td-35'
        expect(sortBySku(blanketify(['target'], skus, sku))).toEqual(sortBySku([]))
    })

})