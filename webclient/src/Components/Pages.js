import React, { useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, path, compose, map, toPairs, groupBy, length, values, propOr, mergeRight, zipObj } from 'ramda'
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
margin-left:0.5rem;
:hover {
    border-color: #6e66a6;
}
> i {
    color: #6e66a6;
    font-weight:bold;
    padding-left:0.5rem;
}
> span {
    min-width:max-content;
}
`

const Dropdown = styled.div`
display:flex;
flex-direction:column;
background: #2d2b37;
position:absolute;
top:2.25rem;
right: 0rem;
flex:1 1 auto;
min-width:100%;
border-radius: 0.5rem;
overflow:hidden;
z-index:11;
padding:2px 0;
border: 1px solid #2d2b37;
font-size:0.8rem;
box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 10%) 0px 4px 8px, rgb(0 0 0 / 10%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
`

const DropdownInner = styled.div`
display:flex;
flex: 0 0 auto;
overflow-y: auto;
max-height: 15rem;
flex-direction:column;
`

const Button = styled.div`
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

const NewPage = styled.div`
height: 3rem;
min-height:3rem;
width:100%;
display:flex;
align-items:center;
justify-content:flex-end;
background: #33313f;
`

const Option = styled.div`
height: 2.5rem;
min-height:2.5rem;
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

const Input = styled.input`
border: 1px solid #2d2b37;
outline: none;
background-color: #2d2b37;
color: #f9f9fa;
height: 1.5rem;
border-radius: 0.25rem;
padding-left: 0.6rem;
margin-left:0.5rem;
font-weight:100;
flex-grow:1;
:hover{
    border-color: #6e66a6;
}
`

const Controls = styled.div`
display:flex;
margin-left:1rem;
margin-right:0.5rem;
justify-content:flex-end;
`

const Label = styled.div`
display: flex;
height: 100%;
min-width:5rem;
align-items: center;
padding-left: 0.5rem;
flex-grow: 1;
`

const OptionActual = ({ value, label, pages, selectedPage, toggleDropdown, pageItemCount }) => {

    const dispatch = useDispatch()

    const ref = useRef()
    const [editOpen, toggleEdit] = useState(false)

    const onSave = () => {
        dispatch({
            type: 'PAGE_EDIT',
            label: ref.current.value,
            value
        })
        toggleEdit(false)
    }

    const selectPage = () => {
        dispatch({
            type: 'PAGE_CHANGE',
            value
        })
        toggleDropdown(false)
    }

    const onDelete = () => {
        dispatch({
            type: 'PAGE_DELETE',
            value
        })
    }

    return <Option isActive={selectedPage === value}>
        {
            editOpen
                ? <Input
                    onKeyPress={({ key }) => key === 'Enter' && onSave()}
                    ref={ref}
                    autoFocus
                    defaultValue={label}
                    placeholder={'Page name'}
                />
                : <Label onClick={selectPage}>{label}</Label>
        }
        <Controls>
            {
                editOpen
                    ? <>
                        <Button onClick={onSave} ><SaveIcon /></Button>
                        <Button onClick={() => toggleEdit(false)}><TimesIcon /></Button>
                    </>
                    : <>
                        <Button onClick={() => toggleEdit(true)} ><EditIcon /></Button>
                        {
                            Object.keys(pages).length > 1 && (pageItemCount[value] > 0) === false
                            && <Button onClick={onDelete} ><TrashIcon /></Button>
                        }
                    </>
            }
        </Controls>
    </Option>
}

const DropdownActual = ({ toggleDropdown }) => {

    const dispatch = useDispatch()
    const ref = useRef()
    const [newPageOpen, toggleNewPage] = useState(false)
    const selectedPage = useSelector(prop('selectedPage'))
    const pages = useSelector(prop('pages'))

    const pageItemCount = useSelector(compose(
        map(length),
        groupBy(prop('page')),
        values,
        propOr({}, 'items')
    ))

    const options = useSelector(compose(
        map(
            compose(
                props => <OptionActual {...props} key={props.value} />,
                mergeRight({ pages, selectedPage, toggleDropdown, pageItemCount }),
                zipObj(['value', 'label'])
            )),
        toPairs,
        prop('pages')
    ))

    const onSave = () => {
        dispatch({
            type: 'PAGE_ADD',
            label: ref.current.value,
        })
        toggleNewPage(false)
    }

    return <Dropdown>
        <DropdownInner>
            {options}
        </DropdownInner>
        <NewPage>
            {
                newPageOpen
                    ? <>
                        <Input
                            onKeyPress={({ key }) => key === 'Enter' && onSave()}
                            ref={ref}
                            autoFocus
                            placeholder={'Page name'}
                        />
                        <Controls>
                            <Button onClick={onSave}><SaveIcon /></Button>
                            <Button onClick={() => toggleNewPage(false)}><TimesIcon /></Button>
                        </Controls>
                    </>
                    : <Controls>
                        <Button onClick={() => toggleNewPage(true)}><PlusIcon /></Button>
                    </Controls>
            }
        </NewPage>
    </Dropdown>
}

const PagesActual = () => {

    const selectedPage = useSelector(prop('selectedPage'))
    const selectedPageName = useSelector(path(['pages', selectedPage]))

    const ref = useRef()
    const [dropdownOpen, toggleDropdown] = useState(false)

    const handler = useCallback(
        (e) => {
            if (dropdownOpen && !ref.current.contains(e.target)) {
                toggleDropdown(!dropdownOpen)
            }
        },
        [dropdownOpen]
    )

    useEventListener('mousedown', handler)

    const dropDownClick = (e) => {
        if (ref.current === e.target || Array.from(ref.current.childNodes).includes(e.target)) {
            toggleDropdown(!dropdownOpen)
        }
    }

    return (
        <Pages ref={ref} onClick={dropDownClick}>
            <span>{selectedPageName}</span>
            <AngleDownIcon />
            {
                dropdownOpen && <DropdownActual toggleDropdown={toggleDropdown} />
            }
        </Pages>
    )
}

export default PagesActual