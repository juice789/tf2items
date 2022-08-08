import React from 'react'
import styled from 'styled-components'

import backpackLogo from './Images/backpack.svg'
import manncoLogo from './Images/mannco.png'
import marketplaceLogo from './Images/marketplace.png'
import steamLogo from './Images/steam.svg'

import {
    itemFromSku,
    toBpQuality,
    toBpName,
    toBpPriceIndex,
    qualityNames,
    particleEffects,
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
width: 10rem;
min-width: 10rem;
max-width: 10rem;
> a {
    color:#8a879a;
    text-decoration: none;
    :hover{
        color: #6e66a6;
    }
    > img {
        width: auto;
        height:1.5rem;
        opacity: 0.8;
        :hover{
            opacity:1;
        }
    }
}
@media (max-width:1400px){
width: 8.5rem;
min-width: 8rem;
max-width: 8rem;
> a > img {
        height:1.25rem;
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
        series,
        craft,
        effect
    } = itemFromSku(sku)

    const bpUrl = [
        toBpQuality(sku),
        toBpName(sku),
        'Tradable',
        uncraftable === true ? 'Non-Craftable' : 'Craftable',
        toBpPriceIndex(sku)
    ].filter(Boolean).join('/').replace('%', '%25').replace('%250A', '%0A')

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

    const marketplaceSku = [
        defindex,
        quality,
        effect && 'u' + effect,
        wear && 'w' + wear,
        texture && 'pk' + texture,
        elevated && 'strange',
        uncraftable && 'uncraftable',
        australium && 'australium',
        killstreakTier && 'kt-' + killstreakTier,
        festivized && 'festive',
        target && 'td-' + target,
        output && 'od-' + output,
        oq && 'oq-' + oq,
        craft && 'n' + craft,
        series && 'c' + series
    ].filter(Boolean).join(';')

    const manncoUrl = [
        440,
        uncraftable && 'uncraftable',
        oq && oq !== '6' && qualityNames[oq],
        effect && particleEffects[effect],
        elevated && 'strange',
        ['6', '15'].includes(quality) === false && qualityNames[quality],
        festivized && 'festivized',
        killstreakTier && killstreakTiers[killstreakTier],
        texture && textures[texture],
        target && items[target].item_name,
        output && items[output].item_name,
        items[defindex].item_name.replace('\\n', ' '),
        wear && wears[wear],
        chemSeries[defindex] && 'series-' + chemSeries[defindex],
        series && 'series-' + series
    ].filter(Boolean).join('-').replaceAll(/[^0-9a-zA-Z -]/g, '').replaceAll(' ', '-').toLowerCase()

    return (
        <CustomCell>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://mannco.store/item/' + manncoUrl}>
                <img src={manncoLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://marketplace.tf/items/tf2/' + marketplaceSku}>
                <img src={marketplaceLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://steamcommunity.com/market/listings/440/' + scmUrl}>
                <img src={steamLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={'https://backpack.tf/stats/' + bpUrl}>
                <img src={backpackLogo} />
            </a>
        </CustomCell>
    )
}