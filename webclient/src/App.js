import styled from 'styled-components'

import Items from './Components/Items'

const App = styled.div`
display:flex;
flex-direction: column;
height: 100%;
`

function AppActual() {
  return (
    <App>
      <Items />
    </App>
  )
}

export default AppActual