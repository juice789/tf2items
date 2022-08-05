import React, { useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { prop, values, mapObjIndexed } from 'ramda'
import { SortAlphaDownIcon, SortAlphaDownAltIcon, AngleDownIcon } from 'react-line-awesome'
import { useEventListener } from './utils'

const Sort = styled.div`
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
> i:last-of-type {
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
right: 0rem;
min-width:100%;
border-radius: 0.5rem;
overflow:hidden;
z-index:11;
padding:2px 0;
border: 1px solid #2d2b37;
font-size:0.8rem;
`

const Option = styled.div`
height: 2.5rem;
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


const Label = styled.div`
display: flex;
height: 100%;
min-width:5rem;
align-items: center;
padding-left: 0.5rem;
flex-grow: 1;
`

const OptionActual = ({ type, label, toggleDropdown, selected }) => {

    const dispatch = useDispatch()

    const selectSort = () => {
        dispatch({
            type
        })
        toggleDropdown(false)
    }

    return <Option isActive={selected === type}>
        <Label onClick={selectSort}>{label}</Label>
    </Option>
}

const sorts = {
    SORT_DEFAULT: 'Default',
    SORT_NAME: 'Name'
}

const DropdownActual = ({ toggleDropdown }) => {

    const { sortType } = useSelector(prop('sort'))

    const options = values(mapObjIndexed(
        (v, k) => <OptionActual key={k} type={k} label={v} toggleDropdown={toggleDropdown} selected={sortType} />,
        sorts
    ))

    return <Dropdown>
        {options}
    </Dropdown>
}


const SortActual = () => {

    const { sortType, sortMode } = useSelector(prop('sort'))

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

    const icon =
        sortType === 'SORT_DEFAULT'
            ? 'Sort:'
            : sortMode === 'ASC' ? <SortAlphaDownIcon /> : <SortAlphaDownAltIcon />

    return (
        <Sort ref={ref} onClick={dropDownClick}>
            {icon}&nbsp;<span>{sorts[sortType]}</span>
            <AngleDownIcon />
            {
                dropdownOpen && <DropdownActual toggleDropdown={toggleDropdown} />
            }
        </Sort>
    )
}

export default SortActual