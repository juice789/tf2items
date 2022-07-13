import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { prop } from 'ramda'
import Header from './Header'

import AddItems from './AddItems'

const Items = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
flex-direction:column;
`

const Inner = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
position:relative;
overflow-x:hidden;
`

const asides = {
    'addItems': AddItems
}

const ItemsActual = () => {

    const openedAside = useSelector(prop('openedAside'))
    const aside = openedAside
        ? React.createElement(asides[openedAside], { key: openedAside })
        : null

    return (
        <Items>
            <Header />
            <Inner>
                {aside}
            </Inner>
        </Items>
    )
}

export default ItemsActual