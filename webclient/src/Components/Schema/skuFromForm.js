const {
    curry, includes, when, compose, __, prop, chain, assoc, has, nth, split, mergeRight
} = require('ramda')

const {
    safeItems,
    skuFromItem
} = require('@juice789/tf2items')

const ktRemap = {
    '6527': '1',
    '6523': '2',
    '6526': '3',
    '20002': '2',
    '20003': '3'
}

const odRemap = {
    '20002': '6523',
    '20003': '6526'
}

const skuFromForm = curry((obj, overrides) => compose(
    skuFromItem,
    when(
        compose(includes('>'), prop('defindex')),//strangifier
        compose(
            chain(assoc('defindex'), compose(nth(0), split('>'), prop('defindex'))),
            chain(assoc('target'), compose(nth(1), split('>'), prop('defindex')))
        )
    ),
    when(
        compose(includes('<'), prop('defindex')),//chemistry set
        compose(
            chain(assoc('oq'), compose(prop('oq'), prop(__, safeItems), prop('defindex'))),
            chain(assoc('defindex'), compose(nth(0), split('<'), prop('defindex'))),
            chain(assoc('target'), compose(nth(2), split('<'), prop('defindex'))),
            chain(assoc('output'), compose(nth(1), split('<'), prop('defindex')))
        )
    ),
    when(
        compose(includes('/'), prop('defindex')),//crates
        compose(
            chain(assoc('defindex'), compose(nth(0), split('/'), prop('defindex'))),
            chain(assoc('series'), compose(nth(1), split('/'), prop('defindex')))
        )
    ),
    when(
        compose(has('target'), prop(__, safeItems), prop('defindex')),
        chain(assoc('target'), compose(prop('target'), prop(__, safeItems), prop('defindex')))
    ),
    when(
        compose(has('texture'), prop(__, safeItems), prop('defindex')),
        chain(assoc('texture'), compose(prop('texture'), prop(__, safeItems), prop('defindex')))
    ),
    when(
        compose(prop(__, odRemap), prop('defindex')),
        chain(assoc('output'), compose(prop(__, odRemap), prop('defindex'))),
    ),
    when(
        compose(prop(__, ktRemap), prop('defindex')),
        chain(assoc('killstreakTier'), compose(prop(__, ktRemap), prop('defindex'))),
    )
)(mergeRight(obj, overrides)))

export default skuFromForm