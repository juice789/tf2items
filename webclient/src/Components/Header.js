import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, equals, __, path, compose, length, keys, pickBy, startsWith, find, propOr } from 'ramda'
import { SearchIcon, PlusIcon, TimesIcon, CogIcon, SyncAltIcon } from 'react-line-awesome'

import Pages from './Pages'
import Sort from './Sort'
import { ChangeCounter } from './Blocks'

const Header = styled.div`
display: flex;
align-items: center;
height: 3rem;
min-height: 3rem;
background: #33313f;
border-bottom: 1px solid #403d4f;
justify-content: flex-end;
padding-right:0.5rem;
`

const Button = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: 1.1rem;
border-radius: 0.5rem;
width: ${({ isOpen }) => isOpen ? '15rem' : 'auto'};
cursor: pointer;
margin-left: 0.5rem;
background: ${({ active }) => active ? '#3a3747' : '#2d2b37'};
color: ${({ active, isOpen }) => isOpen ? '#e1e0e5' : active ? '#e1e0e5' : '#8a879a'};
overflow: hidden;
position:relative;
:hover{
    color: #e1e0e5;
}
> i {
    min-width: 3rem;
    height: 2rem;
    min-height: 2rem;    
    display:flex;
    align-items:center;
    justify-content:center;
}
`

const Input = styled.input`
background: #2d2b37;
flex-grow:1;
border: 0;
outline: 0;
font-size:0.9rem;
width:0;
color: inherit;
margin-right:1rem;
`

const getChangeCount = compose(
    length,
    keys,
    pickBy(compose(find(startsWith('__')), keys)),
    propOr({}, 'items')
)

const HeaderActual = () => {

    const dispatch = useDispatch()
    const searchRef = useRef()
    const [searchOpen, toggleSearch] = useState(false)
    const flag = useSelector(path(['search', 'flag']))
    const openedAside = useSelector(prop('openedAside'))
    const usePages = useSelector(prop('usePages'))
    const changeCounter = useSelector(getChangeCount)
    const isAsideOpen = equals(__, openedAside)
    const openAside = (name) => () => dispatch({ type: 'ASIDE_TOGGLE', name })

    const searchChange = () => {
        dispatch({
            type: 'SEARCH_INPUT',
            value: searchRef.current.value
        })
    }

    useEffect(() => {
        if (!searchOpen) {
            dispatch({
                type: 'SEARCH_CLEAR',
                value: ''
            })
        }
    }, [searchOpen])

    useEffect(() => {
        if (flag) {
            toggleSearch(false)
            dispatch({
                type: 'SEARCH_CLEAR',
                value: ''
            })
        }
    }, [flag])


    return (
        <Header>
            <Sort />
            {usePages && <Pages />}
            <Button isOpen={searchOpen}>
                <SearchIcon onClick={() => toggleSearch(true)} />
                {
                    searchOpen
                        ? <>
                            <Input ref={searchRef} autoFocus onChange={searchChange} />
                            <TimesIcon onClick={() => toggleSearch(false)} />
                        </>
                        : null
                }
            </Button>
            <Button active={isAsideOpen('changes')} onClick={openAside('changes')}>
                <SyncAltIcon />
                {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
            </Button>
            <Button
                active={isAsideOpen('settings')}
                onClick={openAside('settings')}
            >
                <CogIcon />
            </Button>
            <Button
                active={isAsideOpen('addItems')}
                onClick={openAside('addItems')}
            >
                <PlusIcon />
            </Button>
        </Header >
    )
}

export default HeaderActual