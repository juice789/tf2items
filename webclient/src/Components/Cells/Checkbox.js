import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { propOr, compose, equals, has } from 'ramda'
import { CheckSquareIcon, SquareIcon } from 'react-line-awesome'
import { Cell } from './styles'

const CustomCell = styled(Cell)`
width: 2rem;
min-width: 2rem;
max-width: 2rem;
cursor: pointer;
user-select: none;
:hover > * {
    color: #6e66a6;
}
`

const Control = styled.div`
display: flex;
width: 100%;
height: 100%;
color: ${({ checked }) => checked ? '#6e66a6' : '#8a879a'};
justify-content: center;
align-items: center;
transition: color 0.2s ease;
}
`

export const Checkbox = React.memo(({ sku }) => {

    const dispatch = useDispatch()

    const isOpen = useSelector(compose(equals('settings'), propOr([], 'openedAside')))

    const checked = useSelector(compose(
        has(sku),
        propOr({}, 'selectedItems')
    ))

    const selectThis = () => dispatch({ type: 'ITEM_SELECTED', sku })

    return (
        <CustomCell isHidden={!isOpen} onClick={selectThis}>
            <Control checked={checked}>
                {checked ? <CheckSquareIcon /> : <SquareIcon />}
            </Control>
        </CustomCell>
    )
})