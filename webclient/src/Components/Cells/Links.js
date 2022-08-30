import React from 'react'
import styled from 'styled-components'

import backpackLogo from './Images/backpack.svg'
import manncoLogo from './Images/mannco.png'
import marketplaceLogo from './Images/marketplace.png'
import steamLogo from './Images/steam.svg'

import {
    manncoUrl,
    marketplaceUrl,
    scmUrl,
    bpUrl
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

    return (
        <CustomCell>
            <a target={'_blank'} rel="noopener noreferrer" href={manncoUrl(sku)}>
                <img src={manncoLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={marketplaceUrl(sku)}>
                <img src={marketplaceLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={scmUrl(sku)}>
                <img src={steamLogo} />
            </a>
            <a target={'_blank'} rel="noopener noreferrer" href={bpUrl(sku)}>
                <img src={backpackLogo} />
            </a>
        </CustomCell>
    )
}