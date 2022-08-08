import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { prop } from 'ramda'

import Header from './Components/Header'

import Notifications from '@juice789/redux-saga-notifications'

import AddItems from './Components/AddItems'
import ItemList from './Components/ItemList'
import Settings from './Components/Settings'
import Changes from './Components/Changes'

const App = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
flex-direction:column;
height: 100%;
min-width:1000px;
`

const Inner = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
position:relative;
overflow-x:hidden;
`

const asides = {
  'addItems': AddItems,
  'settings': Settings,
  'changes': Changes
}

const ItemsActual = () => {

  const openedAside = useSelector(prop('openedAside'))
  const aside = openedAside
    ? React.createElement(asides[openedAside], { key: openedAside })
    : null

  const itemList = <ItemList />
  return (
    <>
      <App>
        <Header />
        <Inner>
          {aside}
          {itemList}
        </Inner>
      </App>
      <Notifications />
    </>
  )
}

export default ItemsActual