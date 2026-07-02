import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Header from './Components/Header'

import Notifications from '@juice789/redux-saga-notifications/themed'

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
`

const Inner = styled.div`
display: flex;
flex: 1 1 auto;
overflow-y:auto;
position:relative;
overflow-x:hidden;
@media (max-width: ${({ theme }) => theme.mobileBreakPoint}) {
    > *:first-child { 
        display: ${({ $hasAside }) => $hasAside ? 'flex' : 'none'}; 
    }
    > *:last-child {
        display: ${({ $hasAside }) => $hasAside ? 'none' : 'flex'}; 
    }
}
`

const asides = {
  'addItems': AddItems,
  'settings': Settings,
  'changes': Changes
}

const ItemsActual = () => {
  const openedAside = useSelector(state => state.openedAside)
  const aside = openedAside
    ? React.createElement(asides[openedAside], { key: openedAside })
    : null
  return <>
    <App>
      <Header />
      <Inner $hasAside={!!openedAside}>
        {aside}
        <ItemList />
      </Inner>
    </App>
    <Notifications />
  </>
}

export default ItemsActual