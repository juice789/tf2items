import React, { useState } from 'react'
import styled from 'styled-components'

import { Aside, Header, HeaderButton, SaveButton } from './Blocks'
import { useDispatch, useSelector } from 'react-redux'
import { TimesIcon, ThumbsUpIcon, WindowCloseIcon } from 'react-line-awesome'
import {
    or, converge, equals, compose, chain, concat, map, replace, filter, startsWith, pickBy, prop, head, of, pick, find, mapObjIndexed, values, keys, includes, when, always
} from 'ramda'
import { itemNameFromSku } from '@juice789/tf2items'

const Items = styled.div`
display:flex;
flex-direction:column;
flex: 1 1 auto;
overflow-y: auto;
position: relative;
flex-grow: 0;
`

const Item = styled.div`
display:flex;
border-top: 1px solid #403d4f;
padding: 1rem 1rem 0.5rem 1rem;
flex-direction:column;
:first-of-type{
    border-top:0;
}
`

const Changes = styled.div`
display:flex;
flex-direction:column;
`

const Name = styled.div`
display:flex;
padding-bottom:0.5rem;
`

const Detail = styled.div`
display:flex;
padding-bottom:0.5rem;
`
const Icon = styled.div`
padding: 0 0.5rem;
cursor: pointer;
color: #6e66a6;
transition: color 0.2s ease;
font-size:1rem;
:hover {
    color: #897fd0;
}
`
const Change = styled.div`
display:flex;
cursor:pointer;
color: #b3b2be;
transition: color 0.2s ease;
justify-content:space-between;
flex-grow:1;
:hover {
    color:#f9f9fa;
}
`

const Controls = styled.div`
display:flex;
justify-content:space-around;
padding:1rem;
flex: 0 0 auto;
flex-grow: 1;
align-items: flex-start;
border-top: 1px solid #403d4f;
`

const NoChanges = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction:column;
justify-content:center;
width:100%;
height:100%;
> *:nth-child(1) {
    font-size:3rem;
    color:#897fd0;
}
> *:nth-child(2) {
    font-size:1rem;
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
            <Icon onClick={resetChange} ><WindowCloseIcon /></Icon>
            <Change onClick={() => toggleAlt(!isAlt)}>
                {override ? override : isAlt ? detailTextAlt : detailText}
            </Change>
        </Detail>
    )
}

const getChangedProps = (item, sku) => compose(
    map((propKey) => (<ChangedProp key={sku + propKey} {...item} sku={sku} propKey={propKey} />)),
    when(includes('__toRemove'), always(['__toRemove'])),
    filter(converge(or, [equals('__toRemove'), startsWith('__')])),
    keys
)(item)

const getChangedItems = mapObjIndexed((item, sku) => (
    <Item key={sku}>
        <Name>{itemNameFromSku(sku)}</Name>
        <Changes>{getChangedProps(item, sku)}</Changes>
    </Item>
))


const getChanges = compose(
    values,
    getChangedItems,
    map(
        chain(
            pick,
            compose(
                chain(concat, compose(map(replace('__', '')), head, of)),
                filter(startsWith('__')),
                keys
            )
        )
    ),
    pickBy(compose(find(startsWith('__')), keys)),
    prop('items')
)

const ChangesActual = () => {

    const dispatch = useDispatch()
    const changes = useSelector(getChanges)
    const saveChanges = () => dispatch({ type: 'SAVE_CHANGES' })
    const resetChanges = () => dispatch({ type: 'RESET_CHANGES' })

    return (
        <Aside>
            <Header>
                Changes
                <HeaderButton onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'changes' })}>
                    <TimesIcon />
                </HeaderButton>
            </Header>
            {
                changes.length === 0 ?
                    <NoChanges>
                        <ThumbsUpIcon />
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
    )
}

export default ChangesActual