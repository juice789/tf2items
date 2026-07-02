import { memo } from 'react'
import styled from 'styled-components'
import { AutoSizer } from 'react-virtualized-auto-sizer'
import { FixedSizeList as List, areEqual } from 'react-window'
import { useMediaQuery } from '@react-hook/media-query'


import { shallowEqual, useSelector } from 'react-redux'
import { itemNameFromSku } from '@juice789/tf2items'

import { Checkbox, Name, Links } from './Cells'

const ItemList = styled.div`
display: flex;
flex: 1 1 auto;
position: relative;
flex-direction: column;
overflow: hidden;
border-left: 1px solid ${({ theme }) => theme.background4};
`

const Th = styled.div`
top: 0;
left: 0;
width: 100%;
display: flex;
height: 3rem;
background: ${({ theme }) => theme.background2};
position: sticky !important;
border-bottom: 1px solid ${({ theme }) => theme.background4};
z-index: 2;
`

const Label = styled.div`
font-size: 0.9rem;
height: 3rem;
border-right: 1px solid ${({ theme }) => theme.background3};
display: flex;
align-items:center;
padding-left: 0.5rem;
padding-right: 0.5rem;
width: ${({ $w }) => $w}rem;
min-width: ${({ $w }) => $w}rem;
max-width: ${({ $grow, $w }) => $grow ? 'unset' : $w + 'rem'};
flex-grow: ${({ $grow }) => $grow ? 1 : 0};
@media (max-width:1400px){
    width: ${({ $w2 }) => $w2}rem;
    min-width: ${({ $w2 }) => $w2}rem;
    max-width: ${({ $grow, $w2 }) => $grow ? 'unset' : $w2 + 'rem'};
    flex-grow: ${({ $grow }) => $grow ? 1 : 0};
}
`

const Rows = styled.div`
position: relative;
`

const Row = styled.div`
display: flex;
flex-direction: column;
min-width: 20rem;
&:hover {
    background: ${({ theme }) => theme.background4};
}
`
const RowInner = styled.div`
display: flex;
`

const StickyRow = memo(() => {
    const settingsOpen = useSelector(({ openedAside }) => openedAside === 'settings')
    const selectionOpen = useSelector(state => state.isSelectionOpen)
    const isResponsive = useMediaQuery('(max-width: 850px)')
    const isHidden = settingsOpen === false && (isResponsive ? selectionOpen === false : true)
    return <Th>
        {isHidden ? null : <Label $w={2} />}
        <Label $w={10} $w2={8}>Links</Label>
        <Label $grow={true}>Item</Label>
    </Th>
})

const RowActual = memo(({ data: items, index, style }) => {
    const sku = items[index]
    return (
        <Row key={sku} style={style}>
            <RowInner>
                <Checkbox sku={sku} />
                <Links sku={sku} />
                <Name sku={sku} />
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
    <AutoSizer renderProp={({ height, width }) => (
        height === undefined || width === undefined
            ? null
            : <List
                innerElementType={innerElementType}
                height={height}
                itemCount={itemCount}
                itemSize={itemSize}
                width={width}
                itemData={items}
            >
                {RowActual}
            </List>
    )} />
)

const ItemListActual = memo(() => {

    const items = useSelector(({ items, search, selectedPage, sort: { sortType, sortMode } }) => {
        const pageItems = Object
            .values(items)
            .filter((item) => item.page === selectedPage)
            .map((item) => ({ ...item, name: itemNameFromSku(item.sku).toLowerCase() }))
            .filter((item) => !search.value || item.name.indexOf(search.value.toLowerCase()) >= 0)

        if (sortType === 'SORT_NAME') pageItems.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        else if (sortType === 'SORT_SKU') pageItems.sort((a, b) => a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0)

        const skus = pageItems.map((item) => item.sku)
        return sortMode === 'DESC' ? skus.reverse() : skus
    }, shallowEqual)

    return (
        <ItemList>
            {
                items.length > 0
                    ? <AutoSizerActual
                        itemCount={items.length}
                        itemSize={45}
                        items={items}
                    />
                    : null
            }
        </ItemList>
    )
})

export default ItemListActual