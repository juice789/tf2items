import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, equals, __, path, compose, length, keys, pickBy, startsWith, find, propOr } from 'ramda'
import { SearchIcon, PlusIcon, TimesIcon, CogIcon, SyncAltIcon, EllipsisHIcon, SquareFullIcon } from 'react-line-awesome'
import { useMediaQuery } from '@react-hook/media-query'
import { useEventListener } from './utils'

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
cursor: pointer;
margin-left: 0.5rem;
background: ${({ active }) => active ? '#3a3747' : '#2d2b37'};
color: ${({ active, isOpen }) => isOpen ? '#e1e0e5' : active ? '#e1e0e5' : '#8a879a'};
position:relative;
&:hover{
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
@media (min-width:850px){
    display:${({ onlyResponsive }) => onlyResponsive ? 'none' : 'flex'}
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
min-width:8rem;
`

const Menu = styled.div`
display:flex;
flex-direction:column;
position:absolute;
top:2.5rem;
right:0.25rem;
z-index:1000;
background:#33313f;
width:20rem;
padding:0.5rem 0.5rem 0.25rem 0.5rem;
border-radius:0.5rem;
box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 10%) 0px 4px 8px, rgb(0 0 0 / 10%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
> * {
    margin:0 0 0.5rem 0;
    flex-grow:1;
}
`

const Label = styled.span`
display:none;
align-items:center;
justify-content:flex-start;
font-size:0.9rem;
line-height:0;
flex-grow:1;
justify-content:center;
@media (max-width:850px){
    display:flex
}
`

const PlaceHolder = styled.div`
display:none;
min-width:3rem;
@media (max-width:850px){
    display:flex;
}
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

    const menuRef = useRef()
    const [dropdownOpen, toggleDropdown] = useState(false)

    const handler = useCallback(
        (e) => {
            if (dropdownOpen && !menuRef.current?.contains(e.target)) {
                toggleDropdown(!dropdownOpen)
            }
        },
        [dropdownOpen]
    )

    const flag = useSelector(path(['search', 'flag']))
    const openedAside = useSelector(prop('openedAside'))
    const usePages = useSelector(prop('usePages'))
    const changeCounter = useSelector(getChangeCount)
    const isAsideOpen = equals(__, openedAside)
    const openAside = (name) => () => {
        dispatch({ type: 'ASIDE_TOGGLE', name })
        toggleDropdown(false)
    }
    const isResponsive = useMediaQuery('(max-width: 850px)')
    const searchTerm = useSelector(path(['search', 'value']))
    const isSelectionOpen = useSelector(prop('isSelectionOpen'))
    useEventListener('mousedown', handler)

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

    const dropDownClick = (e) => {
        if (menuRef.current === e.target || Array.from(menuRef.current.childNodes).includes(e.target)) {
            toggleDropdown(!dropdownOpen)
        }
    }

    const openSelection = () => {
        dispatch({ type: 'TOGGLE_SELECTION' })
    }

    const headerContents = <>
        <Sort />
        {usePages && <Pages />}
        <Button onClick={() => toggleSearch(!searchOpen)} isOpen={searchOpen}>
            <SearchIcon onClick={e => { searchOpen && e.stopPropagation() }} />
            {
                searchOpen
                    ? <>
                        <Input onClick={e => e.stopPropagation()} ref={searchRef} autoFocus defaultValue={searchTerm} onChange={searchChange} />
                        <TimesIcon onClick={() => toggleSearch(false)} />
                    </>
                    : null
            }
        </Button>
        <Button active={isAsideOpen('changes')} onClick={openAside('changes')}>
            <SyncAltIcon />
            {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
            <Label>Changes</Label>
            <PlaceHolder />
        </Button>
        <Button
            active={isAsideOpen('settings')}
            onClick={openAside('settings')}
        >
            <CogIcon />
            <Label>Settings</Label>
            <PlaceHolder />
        </Button>
        <Button
            active={isAsideOpen('addItems')}
            onClick={openAside('addItems')}
        >
            <PlusIcon />
            <Label>Add Items</Label>
            <PlaceHolder />
        </Button>
        <Button
            active={isSelectionOpen}
            onClick={openSelection}
            onlyResponsive={true}
        >
            <SquareFullIcon />
            <Label>Select Items</Label>
            <PlaceHolder />
        </Button>
    </>

    return (
        <Header>
            {
                isResponsive
                    ?
                    <Button ref={menuRef} onClick={dropDownClick}>
                        <EllipsisHIcon />
                        {
                            dropdownOpen && <Menu>{headerContents}</Menu>
                        }
                    </Button>
                    : headerContents
            }
        </Header >
    )
}

export default HeaderActual