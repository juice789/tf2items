import styled from 'styled-components'
import { itemNameFromSku } from '@juice789/tf2items'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
flex-grow: 1;
display: flex;
padding: 0 0.5rem;
align-items: center;
font-size: 0.8rem;
line-height: 0.8rem;
`

const ItemName = styled.span`
color: ${({ theme }) => theme.fontColor};
`

const SKU = styled.span`
color: ${({ theme }) => theme.mainColor};
font-size: 0.7rem;
`

export const Name = ({ sku }) => <CustomCell>
    <ItemName>{itemNameFromSku(sku)}&nbsp;<SKU>{sku}</SKU></ItemName>
</CustomCell>