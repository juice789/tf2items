import React, { useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, path, compose, map, toPairs, groupBy, length, values, propOr, concat, __ } from 'ramda'
import { PlusIcon, TimesIcon, AngleDownIcon, SaveIcon, EditIcon, TrashIcon } from 'react-line-awesome'
import { useEventListener } from './utils'

const Pages = styled.div`
background: #2d2b37;
height:2rem;
font-size:0.9rem;
border-radius:0.5rem;
display:flex;
align-items:center;
padding: 0 0.5rem;
justify-content:space-between;
border: 1px solid #2d2b37;
user-select:none;
position:relative;
:hover {
    border-color: #6e66a6;
}
> i {
    color: #6e66a6;
    font-weight:bold;
    padding-left:0.5rem;
}
`

const Dropdown = styled.div`
display:flex;
flex-direction:column;
background: #2d2b37;
position:absolute;
top:2.25rem;
left: 0rem;
min-width:100%;
border-radius: 0.5rem;
overflow:hidden;
z-index:11;
padding:2px 0;
border: 1px solid #2d2b37;
font-size:0.8rem;
`

const SmallButton = styled.div`
display:flex;
width:1.5rem;
height:1.5rem;
align-items:center;
justify-content:center;
background: #2d2b37;
border-radius:0.25rem;
color: #8a879a;
cursor:pointer;
margin-left:0.25rem;
:hover {
    color: #e1e0e5;
}
`

const PagesAdd = styled.div`
height: 3rem;
padding: 0.5rem;
width:100%;
display:flex;
align-items:center;
justify-content:flex-end;
background: #33313f;
`

const PageOption = styled.div`
height: 2.5rem;
padding: 0.5rem;
min-width:100%;
width:max-content;
max-width:15rem;
display:flex;
align-items:center;
justify-content:space-between;
color: #e1e0e5;
background: ${({ isActive }) => isActive ? '#6e66a6' : 'inherit'};
:hover {
    background: #6e66a6;
}
`

const PageInput = styled.input`
border: 1px solid #2d2b37;
outline: none;
background-color: #2d2b37;
color: #f9f9fa;
height: 1.5rem;
border-radius: 0.25rem;
padding-left: 0.6rem;
font-weight:100;
max-width: 7rem;
:hover{
    border-color: #6e66a6;
}
`

const OptionControls = styled.div`
display:flex;
margin-left:1rem;
min-width: 3.5rem;
justify-content:flex-end;
`

const PageOptionActual = ([value, label, pages, selectedPage, togglePages]) => {

    const dispatch = useDispatch()

    const editPageRef = useRef()
    const [pageEditing, toggleEditPage] = useState(false)

    const onPageSave = () => {
        dispatch({
            type: 'PAGE_EDIT',
            value: editPageRef.current.value,
        })
    }

    const pageEditClick = (val) => (e) => {
        e.stopPropagation()
        toggleEditPage(val)
        return false
    }

    const pageItemCount = useSelector(compose(
        map(length),
        groupBy(prop('page')),
        values,
        propOr({}, 'items')
    ))

    const selectPage = (page) => (e) => {
        e.stopPropagation()
        dispatch({
            type: 'PAGE_CHANGE',
            page
        })
        togglePages(false)
    }

    return <PageOption key={value} isActive={selectedPage === value}>
        {
            pageEditing === value
                ? <PageInput
                    onKeyPress={({ key }) => key === 'Enter' && onPageSave()}
                    ref={editPageRef}
                    autoFocus
                    defaultValue={pageEditing ? label : ''}
                    placeholder={'Page name'}
                />
                : <span onClick={selectPage(value)}>{label}</span>
        }
        <OptionControls>
            {
                pageEditing === value
                    ? <>
                        <SmallButton><SaveIcon /></SmallButton>
                        <SmallButton onClick={() => toggleEditPage(false)}><TimesIcon /></SmallButton>
                    </>
                    : <>
                        <SmallButton><EditIcon onClick={pageEditClick(value)} /></SmallButton>
                        {
                            Object.keys(pages).length > 1 && (pageItemCount[value] > 0) === false
                                ? <SmallButton ><TrashIcon onClick={() => { }} /></SmallButton>
                                : null
                        }
                    </>
            }
        </OptionControls>
    </PageOption>
}

const DropdownActual = ({ togglePages }) => {

    const dispatch = useDispatch()
    const pagesRef = useRef()
    const newPageRef = useRef()
    const [newPageOpen, toggleNewPage] = useState(false)
    const selectedPage = useSelector(prop('selectedPage'))
    const pages = useSelector(prop('pages'))

    const pageOptions = useSelector(compose(
        map(PageOptionActual),
        map(concat(__, [pages, selectedPage, togglePages])),
        toPairs,
        prop('pages')
    ))

    const onPageSave = () => {
        dispatch({
            type: 'PAGE_NEW',
            value: newPageRef.current.value,
        })
    }

    return <Dropdown ref={pagesRef}>
        {pageOptions}
        <PagesAdd>
            {
                newPageOpen
                    ? <>
                        <PageInput
                            onKeyPress={({ key }) => key === 'Enter' && onPageSave()}
                            ref={newPageRef}
                            autoFocus
                            placeholder={'Page name'}
                        />
                        <OptionControls>
                            <SmallButton><SaveIcon /></SmallButton>
                            <SmallButton onClick={() => toggleNewPage(false)}><TimesIcon /></SmallButton>
                        </OptionControls>
                    </>
                    : <SmallButton onClick={() => toggleNewPage(true)}><PlusIcon /></SmallButton>
            }
        </PagesAdd>
    </Dropdown>
}

const PagesActual = () => {

    const selectedPage = useSelector(prop('selectedPage'))
    const selectedPageName = useSelector(path(['pages', selectedPage]))

    const pagesRef = useRef()
    const [pagesOpen, togglePages] = useState(false)

    const handler = useCallback(
        (e) => {
            if (pagesOpen && !pagesRef.current.contains(e.target)) {
                togglePages(!pagesOpen)
            }
        },
        [pagesOpen]
    )

    useEventListener('mousedown', handler)

    const dropDownClick = (e) => {
        e.stopPropagation()
        if (pagesOpen && (pagesRef.current === e.target || Array.from(pagesRef.current.childNodes).includes(e.target))) {
            togglePages(false)
        } else {
            togglePages(true)
        }
    }

    return <Pages ref={pagesRef} onClick={dropDownClick}>
        <span>{selectedPageName}</span>
        <AngleDownIcon />
        {
            pagesOpen
                ? <DropdownActual togglePages={togglePages} />
                : null
        }

    </Pages>
}

export default PagesActual