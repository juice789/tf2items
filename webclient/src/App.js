import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { prop } from 'ramda'
import Header from './Components/Header'

import AddItems from './Components/AddItems'
import ItemList from './Components/ItemList'

const App = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
flex-direction:column;
height: 100%;
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
    <App>
      <Header />
      <Inner>
        {aside}
        <ItemList/>
      </Inner>
    </App>
  )
}

export default ItemsActual