const { marketHashNameFromSku } = require('../skuLinks.js')

const tests = {
    '491;6': 'Lucky No. 42',
    '5021;6': 'Mann Co. Supply Crate Key',
    '725;6;uncraftable': 'Tour of Duty Ticket',
    '215;11': 'Strange Degreaser',
    '5861;6;c-104': 'Creepy Crawly Case',
    '6527;6;uncraftable;kt-1;td-998': 'Killstreak Vaccinator Kit',
    '17412;15;pk-412;w-3': 'Secretly Serviced War Paint (Field-Tested)',
    '963;11': 'Strange Silver Botkiller Flame Thrower Mk.II',
    '37;3': 'Vintage Übersaw',
    '8937;6': 'Enchantment: Eternaween',
    '31372;6': 'The Shrapnel Shell',
    '351;15;pk-144;w-3': 'Civic Duty Mk.II Detonator (Field-Tested)'
}

it('fromListingV1', () => {
    for (let sku in tests) {
        expect(marketHashNameFromSku(sku)).toEqual(tests[sku])
    }
})