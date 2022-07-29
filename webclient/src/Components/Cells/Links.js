import React from 'react'
import styled from 'styled-components'

import {
    itemFromSku,
    toBpQuality,
    toBpName,
    toBpPriceIndex,
    qualityNames,
    killstreakTiers,
    wears,
    safeItems as items,
    textures
} from '@juice789/tf2items'

import { Cell } from './styles'

const CustomCell = styled(Cell)`
flex-grow: 1;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 0.5rem;
width:5rem;
min-width:5rem;
max-width:5rem;
> a {
    color:#8a879a;
    text-decoration: none;
    :hover{
        color: #6e66a6;
    }
}
`

export const Links = ({ sku }) => {

    const {
        defindex,
        quality,
        uncraftable,
        killstreakTier,
        target,
        output,
        oq,
        elevated,
        festivized,
        texture,
        wear,
        australium,
        series
    } = itemFromSku(sku)

    const bpUrl = [
        toBpQuality(sku),
        toBpName(sku),
        'Tradable',
        uncraftable === true ? 'Non-Craftable' : 'Craftable',
        toBpPriceIndex(sku)
    ].filter(Boolean).join('/').replace('%', '%25')

    const chemSeries = {
        20000: 1,
        20005: 2
    }

    const scmUrl = [
        oq && oq !== '6' && qualityNames[oq],
        elevated && 'Strange',
        !['6', '15'].includes(quality) && qualityNames[quality],
        festivized && 'Festivized',
        killstreakTier && killstreakTiers[killstreakTier],
        australium && 'Australium',
        texture && textures[texture],
        target && items[target].item_name,
        output && items[output].item_name,
        items[defindex].item_name,
        wear && '(' + wears[wear] + ')',
        chemSeries[defindex] && 'Series%20%23' + chemSeries[defindex],
        series && !items[defindex].seriesHidden && 'Series%20%23' + series
    ].filter(Boolean).join(' ')

    return (
        <CustomCell>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://backpack.tf/stats/' + bpUrl}>bp</a>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://steamcommunity.com/market/listings/440/' + scmUrl}>scm</a>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://marketplace.tf/items/tf2/' + sku.replace('-', '')}>mp</a>
        </CustomCell>
    )
}