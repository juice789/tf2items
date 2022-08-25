const { toSearchParams } = require('../toSearchParams.js')

describe('toSearchParams', () => {
    it('5021;6', () => {
        const sku = '5021;6'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Mann Co. Supply Crate Key',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('202;11;kt-2', () => {
        const sku = '202;11;kt-2'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Minigun',
            quality: '11',
            intent: 'dual',
            australium: -1,
            killstreak_tier: '2',
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('202;11;kt-2;festive', () => {
        const sku = '202;11;kt-2'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Minigun',
            quality: '11',
            intent: 'dual',
            australium: -1,
            killstreak_tier: '2',
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('200;11;australium', () => {
        const sku = '200;11;australium'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Scattergun',
            quality: '11',
            intent: 'dual',
            australium: 1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('5763;6;uncraftable', () => {
        const sku = '5763;6;uncraftable'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Unlocked Creepy Scout Crate',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: -1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('31085;5;u-134', () => {
        const sku = '31085;5;u-134'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Bumble Beenie',
            quality: '5',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: '134',
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('201;5;strange;u-702;pk-248;w-1', () => {
        const sku = '201;5;strange;u-702;pk-248;w-1'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Sniper Rifle',
            quality: '11',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: '702',
            item_type: undefined,
            texture_name: 'Igloo',
            wear_tier: '1',
            elevated: undefined
        })
    })
    it('518;1;strange', () => {
        const sku = '518;1;strange'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Anger',
            quality: '1',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: undefined,
            texture_name: undefined,
            wear_tier: undefined,
            elevated: 11
        })
    })
    it('20003;6;kt-3;td-638;od-6526;oq-6', () => {
        const sku = '20003;6;kt-3;td-638;od-6526;oq-6'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Sharp Dresser',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: '3',
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: 'target',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('6523;6;uncraftable;kt-2;td-527', () => {
        const sku = '6523;6;uncraftable;kt-2;td-527'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Widowmaker',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: '2',
            craftable: -1,
            page_size: 30,
            particle: undefined,
            item_type: 'target',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('9258;5;uncraftable;td-30843', () => {
        const sku = '9258;5;uncraftable;td-30843'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Taunt: The Russian Arms Race',
            quality: '5',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: -1,
            page_size: 30,
            particle: undefined,
            item_type: 'target',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('6522;6;td-30364', () => {
        const sku = '6522;6;td-30364'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Warmth Preserver',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: 'target',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('20006;6;od-630;oq-14', () => {
        const sku = '20006;6;od-630;oq-14'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Stereoscopic Shades',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: 'output',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
    it('20005;6;td-707;od-6522;oq-6', () => {
        const sku = '20005;6;td-707;od-6522;oq-6'
        expect(toSearchParams(sku)).toEqual({
            item_names: 1,
            item: 'Boston Boom-Bringer',
            quality: '6',
            intent: 'dual',
            australium: -1,
            killstreak_tier: 0,
            craftable: 1,
            page_size: 30,
            particle: undefined,
            item_type: 'target',
            texture_name: undefined,
            wear_tier: undefined,
            elevated: undefined
        })
    })
})