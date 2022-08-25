const { skuFromItem, itemFromSku, itemNameFromSku } = require('../sku.js')

describe('skuFromItem', () => {
    it('defindex', () => {
        const item = { defindex: '5021' }
        expect(skuFromItem(item)).toEqual('5021')
    })
    it('defindex, quality', () => {
        const item = { defindex: '5021', quality: '6' }
        expect(skuFromItem(item)).toEqual('5021;6')
    })
    it('craftable', () => {
        const item = {
            defindex: '5021',
            quality: '6',
            uncraftable: false
        }
        expect(skuFromItem(item)).toEqual('5021;6')
    })
    it('uncraftable', () => {
        const item = {
            defindex: '5021',
            quality: '6',
            uncraftable: '1'
        }
        expect(skuFromItem(item)).toEqual('5021;6;uncraftable')
    })
    it('elevated strange', () => {
        const item = {
            defindex: '1013',
            quality: '1',
            elevated: true
        }
        expect(skuFromItem(item)).toEqual('1013;1;strange')
    })
    it('particle effect', () => {
        const item = {
            defindex: '30054',
            quality: '5',
            effect: '7'
        }
        expect(skuFromItem(item)).toEqual('30054;5;u-7')
    })
    it('particle effect, elevated', () => {
        const item = {
            defindex: '518',
            quality: '5',
            elevated: true,
            effect: '13'
        }
        expect(skuFromItem(item)).toEqual('518;5;strange;u-13')
    })
    it('killstreak tier', () => {
        const item = {
            defindex: '35',
            quality: '3',
            killstreakTier: '1'
        }
        expect(skuFromItem(item)).toEqual('35;3;kt-1')
    })
    it('invalid killstreak tier', () => {
        const item = {
            defindex: '939',
            quality: '13',
            killstreakTier: '0'
        }
        expect(skuFromItem(item)).toEqual('939;13')
    })
    it('festivized', () => {
        const item = {
            defindex: '35',
            quality: '14',
            festivized: true
        }
        expect(skuFromItem(item)).toEqual('35;14;festive')
    })
    it('target', () => {
        const item = {
            defindex: '5661',
            quality: '6',
            target: '588'
        }
        expect(skuFromItem(item)).toEqual('5661;6;td-588')
    })
    it('output, output quality', () => {
        const item = {
            defindex: '20002',
            quality: '6',
            killstreakTier: '2',
            target: '40',
            output: '6523',
            oq: '6'
        }
        expect(skuFromItem(item)).toEqual('20002;6;kt-2;td-40;od-6523;oq-6')
    })
    it('texture, wear', () => {
        const item = {
            defindex: '15000',
            quality: '15',
            texture: '14',
            wear: '1'
        }
        expect(skuFromItem(item)).toEqual('15000;15;pk-14;w-1')
    })
    it('australium', () => {
        const item = {
            defindex: '211',
            quality: '11',
            killstreakTier: '3',
            australium: '1',
            festivized: '1'
        }
        expect(skuFromItem(item)).toEqual('211;11;kt-3;festive;australium')
    })
    it('series', () => {
        const item = {
            defindex: '5022',
            quality: '6',
            series: '31'
        }
        expect(skuFromItem(item)).toEqual('5022;6;c-31')
    })
    it('craft', () => {
        const item = {
            defindex: '739',
            quality: '6',
            craft: '13'
        }
        expect(skuFromItem(item)).toEqual('739;6;no-13')
    })
})

describe('itemFromSku, itemNameFromSku', () => {
    it('5021;6', () => {
        const sku = '5021;6'
        expect(itemFromSku(sku)).toEqual({
            defindex: '5021',
            quality: '6',
            sku
        })
        expect(itemNameFromSku(sku)).toEqual('Mann Co. Supply Crate Key')
    })
    it('305;5;strange;u-702;kt-3;festive;pk-213;w-1', () => {
        const sku = '305;5;strange;u-702;kt-3;festive;pk-213;w-1'
        expect(itemFromSku(sku)).toEqual({
            defindex: '305',
            quality: '5',
            elevated: true,
            effect: '702',
            killstreakTier: '3',
            festivized: true,
            texture: '213',
            wear: '1',
            sku
        })
        expect(itemNameFromSku(sku)).toEqual("Strange Unusual Isotope Festivized Professional Killstreak Miami Element Crusader's Crossbow (Factory New)")
    })
    it('20000;6;td-451;od-6522;oq-6', () => {
        const sku = '20000;6;td-451;od-6522;oq-6'
        expect(itemFromSku(sku)).toEqual({
            defindex: '20000',
            quality: '6',
            target: '451',
            output: '6522',
            oq: '6',
            sku
        })
        expect(itemNameFromSku(sku)).toEqual('Bonk Boy Strangifier Chemistry Set')
    })
    it('207;11;kt-1;festive;australium', () => {
        const sku = '207;11;kt-1;festive;australium'
        expect(itemFromSku(sku)).toEqual({
            defindex: '207',
            quality: '11',
            festivized: true,
            killstreakTier: '1',
            australium: true,
            sku
        })
        expect(itemNameFromSku(sku)).toEqual('Strange Festivized Killstreak Australium Stickybomb Launcher')
    })
    it('5045;6;c-21', () => {
        const sku = '5045;6;c-21'
        expect(itemFromSku(sku)).toEqual({
            defindex: '5045',
            quality: '6',
            series: '21',
            sku
        })
        expect(itemNameFromSku(sku)).toEqual('Mann Co. Supply Crate #21')
    })
    it('30667;6;no-42', () => {
        const sku = '30667;6;no-42'
        expect(itemFromSku(sku)).toEqual({
            defindex: '30667',
            quality: '6',
            craft: '42',
            sku
        })
        expect(itemNameFromSku(sku)).toEqual('#42 Batsaber')
    })
})