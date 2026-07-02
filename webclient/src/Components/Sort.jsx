import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { FaSortAlphaDown, FaSortAlphaDownAlt, FaAngleDown } from 'react-icons/fa'
import { useMenuToggle } from './hooks'
import { MenuBox, MenuDropdown, MenuOption, MenuLabel, MenuIcon } from './styles'

const Sort = styled(MenuBox)``

const ToggleIcon = styled(MenuIcon)`
padding-left: 0.5rem;
`

const Dropdown = styled(MenuDropdown)`
gap: 0.5rem;
`

const Option = styled(MenuOption)`
max-width: 15rem;
`

const Label = styled(MenuLabel)`
padding: 0 0.5rem;
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
    return <Option $isActive={selected === type}>
        <Label onClick={selectSort}>{label}</Label>
    </Option>
}

const sorts = {
    SORT_DEFAULT: 'Default',
    SORT_NAME: 'Name',
    SORT_SKU: 'SKU'
}

const DropdownActual = ({ toggleDropdown }) => {
    const sortType = useSelector(({ sort }) => sort.sortType)
    const options = Object
        .entries(sorts)
        .map(([k, v]) => <OptionActual key={k} type={k} label={v} toggleDropdown={toggleDropdown} selected={sortType} />,)
    return <Dropdown>
        {options}
    </Dropdown>
}

const SortActual = () => {
    const { sortType, sortMode } = useSelector(state => state.sort)
    const { ref, isOpen, toggleOpen, onClick } = useMenuToggle()
    const icon =
        sortType === 'SORT_DEFAULT'
            ? 'Sort:'
            : sortMode === 'ASC' ? <FaSortAlphaDown /> : <FaSortAlphaDownAlt />

    return <Sort ref={ref} onClick={onClick}>
        {icon}&nbsp;{sorts[sortType]}
        <ToggleIcon><FaAngleDown /></ToggleIcon>
        {
            isOpen && <DropdownActual toggleDropdown={toggleOpen} />
        }
    </Sort>
}

export default SortActual