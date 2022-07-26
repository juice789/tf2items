import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { prop, map, compose, values, indexBy } from 'ramda'
import { TimesCircleIcon } from 'react-line-awesome'
import { itemFromSku } from '@juice789/tf2items'

const Preview = styled.div`
display: flex;
flex-direction: column;
height: 100%;
width: 50%;
flex: 1 1 auto;
overflow-y: auto;
align-items: center;
justify-content: space-between;
background: #33313f;
font-size: 0.9rem;
`

const Header = styled.div`
flex: 0 0 auto;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
height: 49px;
border-bottom: 1px solid #403d4f;
`

const List = styled.div`
display: flex;
flex-direction:column;
flex: 1 1 auto;
overflow-y:auto;
position:relative;
width: 100%;
padding: 0.25rem;
`

const Controls = styled.div`
display:${({ isVisible }) => isVisible ? 'flex' : 'none'};
flex: 0 0 auto;
padding: 1rem;
justify-content:space-around;
width: 100%;
`

const Row = styled.div`
display:flex;
width: 100%;
align-items: center;
justify-content: space-between;
border-bottom: 1px dotted #403d4f;
`

const ItemOuter = styled.div`
display:flex;
flex-direction:column;
padding: 0.2rem 0.5rem;
`

const Item = styled.div`
display:flex;
display: flex;
color: #b3b2be;
font-size:0.8rem;
`

const SKU = styled.div`
disaply:flex;
font-size:0.7rem;
color:#6d6981;
`

const Icon = styled.div`
display:flex;
display: flex;
padding: 0.5rem;
font-size:1rem;
cursor:pointer;
> * {
    color:#6e66a6;
    transition: color 0.2s ease;
}
:hover{
    > * {
        color:#897fd0;
    }    
}
`

const Button = styled.div`
display: flex;
justify-content: center;
height:2rem;
align-items:center;
padding: 0.2rem 1rem;
cursor: pointer;
background: ${({ danger }) => danger ? '#b74838' : '#6e66a6'};
color: #f9f9fa;
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height:1rem;
user-select:none;
:hover{
    background: ${({ danger }) => danger ? '#762114' : '#897fd0'};
}
`
const PreviewActual = () => {

    const dispatch = useDispatch()
    const previewItems = useSelector(compose(values, prop('preview')), shallowEqual)

    const removeItem = (sku) => () => dispatch({ type: 'REMOVE_PREVIEW_ITEM', sku })
    const clearItems = () => dispatch({ type: 'CLEAR_PREVIEW' })

    const saveItems = () => dispatch({
        type: 'SAVE_ITEMS',
        items: indexBy(prop('sku'), previewItems)
    })

    const items = map(({ sku }) => (
        <Row key={sku}>
            <ItemOuter>
                <Item>{itemFromSku(sku).name}</Item>
                <SKU>{sku}</SKU>
            </ItemOuter>
            <Icon onClick={removeItem(sku)}>
                <TimesCircleIcon />
            </Icon>
        </Row>
    ), previewItems)

    return (
        <Preview itemCount={previewItems.length}>
            <Header>Items to add: ({previewItems.length})</Header>
            <List>
                {items}
            </List>
            <Controls isVisible={previewItems.length > 0}>
                <Button onClick={saveItems}>Save</Button>
                <Button onClick={clearItems}>Reset</Button>
            </Controls>
        </Preview>
    )
}

export default PreviewActual