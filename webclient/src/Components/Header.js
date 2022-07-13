import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, equals, __ } from 'ramda'

import { PlusIcon } from 'react-line-awesome'

const Header = styled.div`
display: flex;
align-items: center;
height: 49px;
min-height: 49px;
> a, a:hover {
    text-decoration: none;    
}
background: #33313f;
justify-content:space-between;
border-bottom: 1px solid #403d4f;
`

const Inner = styled.div`
display:flex;
height:100%;
align-items:center;
flex-grow:1;
justify-content:flex-end;
`

const Group = styled.div`
display:flex;
height:100%;
padding: 0 0.25rem 0 0.25rem;
align-items:center;
justify-content:center;
`

const Button = styled.div`
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
margin: 0 0.25rem 0 0.25rem;
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
                        <Button
                            active={isAsideOpen('addItems')}
                            onClick={openAside('addItems')}
                        >
                            <PlusIcon />
                        </Button>
                    </Group>
                }
            </Inner>
        </Header>
    )
}

export default HeaderActual