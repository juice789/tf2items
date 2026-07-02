import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { FaPlus, FaTimes, FaAngleDown, FaSave, FaEdit, FaTrash } from 'react-icons/fa'
import { useMenuToggle } from './hooks'
import { MenuBox, MenuDropdown, MenuOption, MenuLabel, MenuIcon } from './styles'

const Pages = styled(MenuBox)`
> span {
    min-width:max-content;
}
`

const Dropdown = styled(MenuDropdown)`
flex: 1 1 auto;
padding: 2px 0;
`

const DropdownInner = styled.div`
display: flex;
flex: 0 0 auto;
overflow-y: auto;
max-height: 15rem;
flex-direction: column;
`

const Button = styled.div`
display: flex;
width: 2rem;
height: 1.5rem;
align-items: center;
justify-content: center;
background: ${({ theme }) => theme.background1};
border-radius: 0.25rem;
color: ${({ theme }) => theme.fontColorDim};
cursor: pointer;
&:hover {
    color: ${({ theme }) => theme.fontColor};
}
`

const NewPage = styled.div`
height: 3rem;
min-height: 3rem;
width: 100%;
display: flex;
align-items: center;
justify-content: flex-end;
padding: 0 0.5rem;
background: ${({ theme }) => theme.background2};
gap: 0.5rem;
`

const Option = styled(MenuOption)`
min-height: 2.5rem;
max-width: 20rem;
padding: 0.5rem;
gap: 0.5rem;
`

const Input = styled.input`
border: 1px solid ${({ theme }) => theme.background1};
outline: none;
background-color: ${({ theme }) => theme.background1};
color: ${({ theme }) => theme.fontColorHighlight};
height: 1.5rem;
border-radius: 0.25rem;
font-weight: 100;
flex-grow: 1;
&:hover {
    border-color: ${({ theme }) => theme.mainColor};
}
`

const Controls = styled.div`
display: flex;
justify-content: flex-end;
gap: 0.5rem;
`

const Label = MenuLabel

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
    return <Option $isActive={selectedPage === value}>
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
                        <Button onClick={onSave} ><FaSave /></Button>
                        <Button onClick={() => toggleEdit(false)}><FaTimes /></Button>
                    </>
                    : <>
                        <Button onClick={() => toggleEdit(true)} ><FaEdit /></Button>
                        {
                            Object.keys(pages).length > 1 && (pageItemCount[value] > 0) === false
                            && <Button onClick={onDelete} ><FaTrash /></Button>
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
    const allProps = useSelector(state => {
        const pageItemCount = Object.fromEntries(
            Object
                .entries(Object.groupBy(Object.values(state.items), item => item.page))
                .map(([page, pageItems]) => [page, pageItems.length])
        )
        return Object
            .entries(state.pages)
            .map(([value, label]) => ({
                value,
                label,
                pages: state.pages,
                selectedPage: state.selectedPage,
                toggleDropdown,
                pageItemCount
            }))
    })
    const onSave = () => {
        dispatch({
            type: 'PAGE_ADD',
            label: ref.current.value,
        })
        toggleNewPage(false)
    }
    return <Dropdown>
        <DropdownInner>
            {allProps.map(props => <OptionActual {...props} key={props.value} />)}
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
                            <Button onClick={onSave}><FaSave /></Button>
                            <Button onClick={() => toggleNewPage(false)}><FaTimes /></Button>
                        </Controls>
                    </>
                    : <Controls>
                        <Button onClick={() => toggleNewPage(true)}><FaPlus /></Button>
                    </Controls>
            }
        </NewPage>
    </Dropdown>
}

const PagesActual = () => {
    const selectedPageName = useSelector(({ selectedPage, pages }) => pages[selectedPage])
    const { ref, isOpen, toggleOpen } = useMenuToggle()
    const onClick = (e) => {
        if (ref.current === e.target || Array.from(ref.current.childNodes).includes(e.target)) {
            toggleOpen(!isOpen)
        }
    }
    return (
        <Pages ref={ref} onClick={onClick}>
            <span>{selectedPageName}</span>
            <MenuIcon><FaAngleDown /></MenuIcon>
            {
                isOpen && <DropdownActual toggleDropdown={toggleOpen} />
            }
        </Pages>
    )
}

export default PagesActual