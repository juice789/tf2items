import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { useTheme } from 'styled-components'
import { FaTimes, FaList } from 'react-icons/fa'
import Select from 'react-select'

import { selectStyle } from '../globalStyle'
import { Aside, AsideInner, Header, HeaderButton, ChangeCounter } from './styles'
import categories from './Schema'
import Form from './Form'
import Preview from './Preview'

const CategoriesOuter = styled.div`
display: flex;
align-items: center;
justify-content: center;
background: ${({ theme }) => theme.background2};
width: 100%;
min-height: 3rem;
padding: 0 0.25rem 0 1rem;
border-bottom: 1px solid ${({ theme }) => theme.background2};
font-size: 0.9rem;
color: ${({ theme }) => theme.fontColorHighlight};
`

const SelectOuter = styled.div`
flex-grow: 1;
display: flex;
align-items: center;
margin: 0 0.25rem 0 1rem;
> * {
    width: 100%;
    font-size: 0.9rem;
}
`

const Controls = styled.div`
display:flex;
`

const FormOuter = styled.div`
display: ${({ $isHidden }) => $isHidden ? 'none' : 'flex'};
flex-direction:column;
`

const AddItemsActual = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [counter, setCounter] = useState(0)
    const [previewOpen, togglePreview] = useState(false)
    const category = useSelector(({ addItems }) => addItems.category)
    const changeCounter = useSelector(({ preview }) => Object.keys(preview).length)
    const onChange = ({ value }) => {
        setCounter(counter + 1)
        dispatch({
            type: 'CATEGORY_CHANGE',
            category: value,
            controls: Object.keys(categories[value].controls || {}),
            filters: Object.keys(categories[value].filters || {}),
            rules: categories[value].rules || {},
            defaults: categories[value].defaults || {},
            validation: categories[value].validation || {}
        })
    }
    useEffect(() => {
        onChange({ value: 'Weapon' })
    }, [])
    const categoryOptions = Object
        .keys(categories)
        .map((name) => ({ value: name, label: name }))
    return <Aside>
        <Header>
            <span>Add items</span>
            <Controls>
                <HeaderButton $active={previewOpen} onClick={() => togglePreview(!previewOpen)}>
                    <FaList />
                    {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
                </HeaderButton>
                <HeaderButton onClick={() => dispatch({ type: 'ASIDE_CLOSE', name: 'addItems' })}>
                    <FaTimes />
                </HeaderButton>
            </Controls>
        </Header>
        {
            previewOpen === false
            && <CategoriesOuter>
                Category:
                <SelectOuter>
                    <Select
                        onChange={onChange}
                        styles={selectStyle(theme)}
                        options={categoryOptions}
                        value={categoryOptions.find(({ value }) => value === category)}
                        isSearchable={false}
                    />
                </SelectOuter>
            </CategoriesOuter>
        }
        <AsideInner>
            {previewOpen && <Preview togglePreview={togglePreview} />}
            {category !== '' && <FormOuter $isHidden={previewOpen}><Form key={category + counter} /></FormOuter>}
        </AsideInner>
    </Aside>
}

export default AddItemsActual