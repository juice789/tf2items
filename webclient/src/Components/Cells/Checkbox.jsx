import { memo } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheckSquare, FaSquare } from 'react-icons/fa'
import { Cell } from './styles'
import { useMediaQuery } from '@react-hook/media-query'

const CustomCell = styled(Cell)`
width: 2rem;
min-width: 2rem;
max-width: 2rem;
cursor: pointer;
user-select: none;
&:hover > * {
    color: ${({ theme }) => theme.mainColor};
}
`

const Control = styled.div`
display: flex;
width: 100%;
height: 100%;
color: ${({ $checked, theme }) => $checked ? theme.mainColor : theme.mainColorFade};
justify-content: center;
align-items: center;
transition: color 0.2s ease;
`

export const Checkbox = memo(({ sku }) => {
    const dispatch = useDispatch()
    const settingsOpen = useSelector(({ openedAside }) => openedAside === 'settings')
    const selectionOpen = useSelector(state => state.isSelectionOpen)
    const isResponsive = useMediaQuery('(max-width: 850px)')
    const checked = useSelector(({ selectedItems }) => sku in selectedItems)
    const selectThis = () => dispatch({ type: 'ITEM_SELECTED', sku })
    return <CustomCell $isHidden={settingsOpen === false && (isResponsive ? selectionOpen === false : true)} onClick={selectThis}>
        <Control $checked={checked}>
            {checked ? <FaCheckSquare /> : <FaSquare />}
        </Control>
    </CustomCell>
})