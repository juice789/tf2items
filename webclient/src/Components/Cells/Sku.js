import React from 'react'
import styled from 'styled-components'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
width: 10rem;
max-width: 10rem;
min-width: 10rem;
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