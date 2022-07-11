import React from 'react'
import styled from 'styled-components'
import Header from './Header'

const Items = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
flex-direction:column;
`

const ItemsActual = () => (
    <Items>
        <Header />
    </Items>
)

export default ItemsActual