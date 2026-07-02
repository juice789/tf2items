import { useState } from 'react'
import styled from 'styled-components'

import { Aside, Header, HeaderButton, SaveButton } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaThumbsUp, FaWindowClose } from 'react-icons/fa'
import { itemNameFromSku } from '@juice789/tf2items'

const Items = styled.div`
display: flex;
flex-direction: column;
flex: 1 1 auto;
overflow-y: auto;
position: relative;
flex-grow: 0;
`

const Item = styled.div`
display: flex;
border-top: 1px solid ${({ theme }) => theme.background4};
padding: 1rem 1rem 0.5rem 1rem;
flex-direction: column;
:first-of-type{
    border-top: 0;
}
`

const Changes = styled.div`
display: flex;
flex-direction: column;
`

const Name = styled.div`
display: flex;
padding-bottom: 0.5rem;
`

const Detail = styled.div`
display: flex;
align-items: center;
padding-bottom: 0.5rem;
`
const Icon = styled.div`
padding: 0 0.5rem;
cursor: pointer;
color: ${({ theme }) => theme.mainColor};
transition: color 0.2s ease;
font-size: 1rem;
&:hover {
    color: ${({ theme }) => theme.mainColorFade};
}
`
const Change = styled.div`
display: flex;
cursor: pointer;
color: ${({ theme }) => theme.fontColor};
transition: color 0.2s ease;
justify-content: space-between;
flex-grow: 1;
&:hover {
    color:${({ theme }) => theme.fontColorHighlight};
}
`

const Controls = styled.div`
display: flex;
justify-content: space-around;
padding: 1rem;
flex: 0 0 auto;
flex-grow: 1;
align-items: flex-start;
border-top: 1px solid ${({ theme }) => theme.background4};
`

const NoChanges = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
justify-content: center;
width: 100%;
height: 100%;
gap: 1rem;
> *:nth-child(1) {
    font-size: 3rem;
    color:${({ theme }) => theme.mainColorFade};
}
> *:nth-child(2) {
    font-size: 1rem;
}
`

const Value = styled.div`
`

const ChangedProp = ({ sku, propKey, ...item }) => {
    var _propKey = propKey.replace('__', '')
    const dispatch = useDispatch()
    const [isAlt, toggleAlt] = useState(true)
    const resetChange = () => dispatch({ type: 'RESET_CHANGE', sku, p: _propKey })
    const old = item[_propKey], modified = item['__' + _propKey]
    const override = _propKey === 'toRemove' ? <Value>Removing item</Value> : null
    const detailText = <Value>{`${_propKey}: ${old} -> ${modified}`}</Value>
    const detailTextAlt = <Value>{`${_propKey}: ${modified}`}</Value>
    return (
        <Detail>
            <Icon onClick={resetChange} ><FaWindowClose /></Icon>
            <Change onClick={() => toggleAlt(!isAlt)}>
                {override ? override : isAlt ? detailTextAlt : detailText}
            </Change>
        </Detail>
    )
}

const getChangedProps = (item, sku) => {
    const changedProps = '__toRemove' in item ? ['__toRemove'] : Object
        .keys(item)
        .filter(key => key.startsWith('__'))
    return changedProps.map(propKey => <ChangedProp key={sku + propKey} {...item} sku={sku} propKey={propKey} />)
}

const getChangedItems = (changedItemProps) => changedItemProps
    .map(([sku, item]) => <Item key={sku}>
        <Name>{itemNameFromSku(sku)}</Name>
        <Changes>{getChangedProps(item, sku)}</Changes>
    </Item>)

const getChangedItemProps = ({ items }) => Object
    .entries(items)
    .map(([sku, item]) => {
        const modifications = Object
            .keys(item)
            .filter(key => key.startsWith('__'))
            .reduce((all, curr) => ({
                ...all,
                [curr]: item[curr],
                [curr.replace('__', '')]: item[curr.replace('__', '')]
            }), {})
        if (Object.keys(modifications).length > 0) return [sku, modifications]
    })
    .filter(Boolean)

const ChangesActual = () => {
    const dispatch = useDispatch()
    const changedItemProps = useSelector(getChangedItemProps)
    const saveChanges = () => dispatch({ type: 'SAVE_CHANGES' })
    const resetChanges = () => dispatch({ type: 'RESET_CHANGES' })
    const changes = getChangedItems(changedItemProps)
    return <Aside>
        <Header>
            Changes
            <HeaderButton onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'changes' })}>
                <FaTimes />
            </HeaderButton>
        </Header>
        {
            changes.length === 0 ?
                <NoChanges>
                    <FaThumbsUp />
                    <span>No changes</span>
                </NoChanges> :
                <>
                    <Items>
                        {changes}
                    </Items>
                    <Controls>
                        <SaveButton onClick={saveChanges}>Save</SaveButton>
                        <SaveButton onClick={resetChanges}>Reset</SaveButton>
                    </Controls>
                </>
        }
    </Aside>
}

export default ChangesActual