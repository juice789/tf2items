import React from 'react'
import styled from 'styled-components'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
width: 4rem;
max-width: 4rem;
min-width: 4rem;
display: flex;
align-items: center;
justify-content: center;
`

export const SKU = ({ sku }) => {
    return (
        <CustomCell>
            {sku}
        </CustomCell>
    )
}