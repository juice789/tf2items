import React from 'react'
import styled from 'styled-components'
import { itemNameFromSku } from '@juice789/tf2items'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
flex-grow: 1;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 0.5rem;
`

export const Name = ({ sku }) => {
    return (
        <CustomCell>
            {itemNameFromSku(sku)}
        </CustomCell>
    )
}