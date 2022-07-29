import React, { memo } from 'react'
import styled from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List, areEqual } from 'react-window'

import { prop, compose, propEq, map, values, filter } from 'ramda'
import { shallowEqual, useSelector } from 'react-redux'

import { Checkbox, Name, SKU, Links } from './Cells'

const ItemList = styled.div`
display: flex;
flex: 1 1 auto;
position: relative;
flex-direction: column;
overflow: hidden;
border-left: 1px solid #403d4f;
`

const Th = styled.div`
top: 0;
left: 0;
width: 100%;
display: flex;
height: 49px;
background: #33313f;
position: sticky !important;
border-bottom: 1px solid #403d4f;
z-index: 2;
`

const Label = styled.div`
font-size: 0.9rem;
height: 49px;
border-right: 1px solid #3a3747;
display: flex;
align-items:center;
padding-left: 0.5rem;
padding-right: 0.5rem;
width: ${prop('w')}rem;
min-width: ${prop('w')}rem;
max-width: ${({ grow, w }) => grow ? 'unset' : w + 'rem'};
flex-grow: ${({ grow }) => grow ? 1 : 0};
`

const Rows = styled.div`
position: relative;
`

const Row = styled.div`
display: flex;
flex-direction: column;
min-width: 20rem;
:hover {
    background: #403d4f;
}
`
const RowInner = styled.div`
display: flex;
`

const StickyRow = memo(() => {
    return <Th>
        <Label grow={true} w={16.5}>Item name</Label>
        <Label w={4}>SKU</Label>
        <Label w={4}>Links</Label>
    </Th>
})

const RowActual = memo(({ data: items, index, style }) => {
    const sku = items[index]
    return (
        <Row key={sku} style={style}>
            <RowInner>
                <Checkbox sku={sku} />
                <Name sku={sku} />
                <SKU sku={sku} />
                <Links sku={sku} />
            </RowInner>
        </Row>
    )
}, areEqual)


const innerElementType = ({ children, ...rest }) => (
    <div {...rest}>
        <StickyRow />
        <Rows>
            {children}
        </Rows>
    </div>
)

const AutoSizerActual = ({ itemCount, itemSize, items }) => (
    <AutoSizer>
        {({ height, width }) => (
            <List
                innerElementType={innerElementType}
                height={height}
                itemCount={itemCount}
                itemSize={itemSize}
                width={width}
                itemData={items}
            >
                {RowActual}
            </List>
        )}</AutoSizer>
)

const ItemListActual = memo(() => {

    const selectedPage = useSelector(prop('selectedPage'))

    const items = useSelector(compose(
        map(prop('sku')),
        filter(propEq('page', selectedPage)),
        values,
        prop('items')
    ), shallowEqual)

    return (
        <ItemList>
            {
                items.length > 0
                    ? <AutoSizerActual
                        itemCount={items.length}
                        itemSize={35}
                        items={items}
                    />
                    : null
            }
        </ItemList>
    )
})

export default ItemListActual