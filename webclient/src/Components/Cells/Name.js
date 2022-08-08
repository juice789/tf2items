import React from 'react'
import styled from 'styled-components'
import { itemNameFromSku } from '@juice789/tf2items'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
flex-grow: 1;
display: flex;
padding: 0 0.5rem;
flex-direction:column;
justify-content:center;
`

const ItemName = styled.span`
font-size:0.8rem;
color:#e1e0e5;
`

const SKU = styled.span`
font-size:0.6rem;
color:#8a879a;
`

export const Name = ({ sku }) => {
    return (
        <CustomCell>
            <ItemName>{itemNameFromSku(sku)} &nbsp;
                <SKU>{sku}</SKU>
            </ItemName>
        </CustomCell>
    )
}