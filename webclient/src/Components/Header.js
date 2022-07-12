import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, equals, __ } from 'ramda'

import { PlusIcon } from 'react-line-awesome'

const Group = styled.div`
display:flex;
height:100%;
padding:0 0.25rem 0 0.25rem;
align-items:center;
justify-content:center;
`

const Header = styled.div`
display: flex;
align-items: center;
height: 3rem;
min-height: 3rem;
> a, a:hover {
    text-decoration: none;    
}
background: #33313f;
justify-content:space-between;
padding: 0 0.25rem 0 0.25rem;
`

const Inner = styled.div`
display:flex;
height:100%;
align-items:center;
flex-grow:1;
justify-content:flex-end;
`
const NavButton = styled.div`
display: flex;
align-items: center;
font-size: 1.1rem;
border-radius: 0.5rem;
width: 3rem;
min-width:3rem;
height:2rem;
min-height:2rem;
justify-content:center;
cursor:pointer;
display:flex;
position:relative;
margin:0 0.25rem 0 0.25rem;
background: ${({ active }) => active ? '#3a3747' : '#2d2b37'};
color: ${({ active }) => active ? '#e1e0e5' : '#8a879a'};
:hover{
    color: #e1e0e5;
}
`

const HeaderActual = () => {

    const dispatch = useDispatch()

    const openedAside = useSelector(prop('openedAside'))
    const isAsideOpen = equals(__, openedAside)
    const openAside = (name) => () => dispatch({ type: 'ASIDE_TOGGLE', name })

    return (
        <Header>
            <Inner>
                {
                    <Group>
                        <NavButton active={isAsideOpen('items')} onClick={openAside('items')}>
                            <PlusIcon />
                        </NavButton>
                    </Group>
                }
            </Inner>
        </Header>
    )
}

export default HeaderActual