import styled from 'styled-components'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FaTimesCircle } from 'react-icons/fa'
import { itemNameFromSku } from '@juice789/tf2items'

const Preview = styled.div`
display: flex;
flex-direction: column;
height: 100%;
flex: 1 1 auto;
overflow-y: auto;
align-items: center;
justify-content: space-between;
background: ${({ theme }) => theme.background2};
font-size: 0.9rem;
`

const Header = styled.div`
flex: 0 0 auto;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
height: 3rem;
border-bottom: 1px solid ${({ theme }) => theme.background4};
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
display:${({ $isVisible }) => $isVisible ? 'flex' : 'none'};
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
border-bottom: 1px dotted ${({ theme }) => theme.background4};
`

const ItemOuter = styled.div`
display:flex;
flex-direction:column;
padding: 0.2rem 0.5rem;
`

const Item = styled.div`
display:flex;
display: flex;
color: ${({ theme }) => theme.fontColor};
font-size:0.8rem;
`

const SKU = styled.div`
disaply:flex;
font-size:0.7rem;
color:${({ theme }) => theme.fontColorDim};
`

const Icon = styled.div`
display:flex;
display: flex;
padding: 0.5rem;
font-size:1rem;
cursor:pointer;
> * {
    color:${({ theme }) => theme.mainColor};
    transition: color 0.2s ease;
}
&:hover{
    > * {
        color:${({ theme }) => theme.mainColorFade};
    }    
}
`

const Button = styled.div`
display: flex;
justify-content: center;
height: 2rem;
align-items: center;
padding: 0.2rem 1rem;
cursor: pointer;
background: ${({ theme }) => theme.mainColor};
color: ${({ theme }) => theme.buttonTextColor};
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height: 1rem;
user-select: none;
&:hover{
    background: ${({ theme }) => theme.mainColorFade};
}
`
const PreviewActual = ({ togglePreview }) => {

    const dispatch = useDispatch()
    const previewItems = useSelector(({ preview }) => Object.values(preview), shallowEqual)
    const usePages = useSelector(state => state.usePages)
    const pages = useSelector(state => state.pages)

    const removeItem = (sku) => () => dispatch({ type: 'REMOVE_PREVIEW_ITEM', sku })
    const clearItems = () => {
        dispatch({ type: 'CLEAR_PREVIEW' })
        togglePreview(false)
    }

    const saveItems = () => {
        dispatch({
            type: 'SAVE_ITEMS',
            items: previewItems.reduce((acc, curr) => (acc[curr.sku] = curr, acc), {})
        })
        togglePreview(false)
    }

    const items = previewItems.map(({ sku, page }) => (
        <Row key={sku}>
            <ItemOuter>
                <Item>{itemNameFromSku(sku)}</Item>
                <SKU>{sku}{usePages ? ' | ' + pages[page] : null}</SKU>
            </ItemOuter>
            <Icon onClick={removeItem(sku)}>
                <FaTimesCircle />
            </Icon>
        </Row>
    ))

    return (
        <Preview $itemCount={previewItems.length}>
            <Header>Items to add: ({previewItems.length})</Header>
            <List>
                {items}
            </List>
            <Controls $isVisible={previewItems.length > 0}>
                <Button onClick={saveItems}>Save</Button>
                <Button onClick={clearItems}>Reset</Button>
            </Controls>
        </Preview>
    )
}

export default PreviewActual