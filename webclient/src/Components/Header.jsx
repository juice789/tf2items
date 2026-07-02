import { useState, useEffect, useRef, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { FaSearch, FaPlus, FaTimes, FaCog, FaSyncAlt, FaEllipsisH, FaSquareFull, FaPalette } from 'react-icons/fa'
import { useMediaQuery } from '@react-hook/media-query'
import { useMenuToggle } from './hooks'
import { ThemeContext } from './Context'

import Pages from './Pages'
import Sort from './Sort'
import { ChangeCounter } from './styles'

const Header = styled.div`
display: flex;
align-items: center;
height: 3rem;
min-height: 3rem;
background: ${({ theme }) => theme.background2};
border-bottom: 1px solid ${({ theme }) => theme.background4};
justify-content: flex-end;
padding: 0 0.5rem;
gap: 0.5rem;
`

const Button = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: 1.1rem;
border-radius: 0.5rem;
cursor: pointer;
background: ${({ $active, theme }) => $active ? theme.background3 : theme.background1};
color: ${({ $active, $isOpen, theme }) => $isOpen ? theme.fontColor : $active ? theme.fontColor : theme.fontColorDim};
position: relative;
&:hover{
    color: ${({ theme }) => theme.fontColor};
}
@media (min-width:850px){
    display:${({ $onlyResponsive }) => $onlyResponsive ? 'none' : 'flex'}
}
`

const IconWrapper = styled.div`
min-width: 3rem;
height: 2rem;
min-height: 2rem;
display: flex;
align-items: center;
justify-content: center;
`

const Input = styled.input`
background: ${({ theme }) => theme.background1};
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
background: ${({ theme }) => theme.background2};
width:20rem;
padding:0.5rem;
border-radius:0.5rem;
box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 10%) 0px 4px 8px, rgb(0 0 0 / 10%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
gap: 0.5rem;
> * {
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

const getChangeCount = ({ items }) => Object
    .entries(items)
    .filter(([, item]) => Object.keys(item).filter(key => key.startsWith('__')).length)
    .length

const Outer = ({ children }) => {
    const isResponsive = useMediaQuery(`(max-width: 850px)`)
    const { ref, isOpen, toggleOpen, onClick } = useMenuToggle()
    return <Header>
        {isResponsive
            ? <Button ref={ref} onClick={onClick}>
                <IconWrapper><FaEllipsisH /></IconWrapper>
                {isOpen && <Menu onClick={() => toggleOpen(false)}>{children}</Menu>}
            </Button>
            : children
        }
    </Header>
}

const HeaderActual = () => {
    const dispatch = useDispatch()
    const { theme, saveTheme } = useContext(ThemeContext)
    const searchRef = useRef()
    const [searchOpen, toggleSearch] = useState(false)
    const flag = useSelector(({ search }) => search.flag)
    const searchTerm = useSelector(({ search }) => search.value)
    const openedAside = useSelector(state => state.openedAside)
    const usePages = useSelector(state => state.usePages)
    const isSelectionOpen = useSelector(state => state.isSelectionOpen)

    const changeCounter = useSelector(getChangeCount)
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

    const openSelection = () => { dispatch({ type: 'TOGGLE_SELECTION' }) }
    const toggleTheme = () => saveTheme(theme.name === 'dark' ? 'light' : 'dark')

    return <Outer>
        <>
            <Button onClick={toggleTheme}>
                <IconWrapper><FaPalette /></IconWrapper>
                <Label>Theme</Label>
                <PlaceHolder />
            </Button>
            <Sort />
            {usePages && <Pages />}
            <Button onClick={() => toggleSearch(!searchOpen)} $isOpen={searchOpen}>
                <IconWrapper><FaSearch onClick={e => { searchOpen && e.stopPropagation() }} /></IconWrapper>
                {
                    searchOpen
                        ? <>
                            <Input onClick={e => e.stopPropagation()} ref={searchRef} autoFocus defaultValue={searchTerm} onChange={searchChange} />
                            <IconWrapper><FaTimes onClick={() => toggleSearch(false)} /></IconWrapper>
                        </>
                        : null
                }
            </Button>
            <Button $active={openedAside === 'changes'} onClick={openAside('changes')}>
                <IconWrapper><FaSyncAlt /></IconWrapper>
                {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
                <Label>Changes</Label>
                <PlaceHolder />
            </Button>
            <Button
                $active={openedAside === 'settings'}
                onClick={openAside('settings')}
            >
                <IconWrapper><FaCog /></IconWrapper>
                <Label>Settings</Label>
                <PlaceHolder />
            </Button>
            <Button
                $active={openedAside === 'addItems'}
                onClick={openAside('addItems')}
            >
                <IconWrapper><FaPlus /></IconWrapper>
                <Label>Add Items</Label>
                <PlaceHolder />
            </Button>
            <Button
                $active={isSelectionOpen}
                onClick={openSelection}
                $onlyResponsive={true}
            >
                <IconWrapper><FaSquareFull /></IconWrapper>
                <Label>Select Items</Label>
                <PlaceHolder />
            </Button>
        </>
    </Outer>
}

export default HeaderActual