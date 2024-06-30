import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { map, path, propEq, propOr, keys, length, compose } from 'ramda'
import styled from 'styled-components'
import { TimesIcon, ListIcon } from 'react-line-awesome'
import Select from 'react-select'

import { selectStyle } from '../globalStyle'
import categories from './Schema'

import Form from './Form.js'
import Preview from './Preview.js'

import { Aside, AsideInner, Header, HeaderButton, ChangeCounter } from './Blocks'

const CategoriesOuter = styled.div`
display: flex;
align-items: center;
justify-content: center;
background: #33313f;
width: 100%;
min-height: 3rem;
padding: 0 0.25rem 0 1rem;
border-bottom: 1px solid #33313f;
font-size: 0.9rem;
color: #f9f9fa;
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
display: ${({ isHidden }) => isHidden ? 'none' : 'flex'};
flex-direction:column;
`

const AddItemsActual = () => {

    const dispatch = useDispatch()
    const category = useSelector(path(['addItems', 'category']))
    const [counter, setCounter] = useState(0)
    const [previewOpen, togglePreview] = useState(false)
    const onChange = ({ value }) => {
        setCounter(counter + 1)
        dispatch({
            type: 'CATEGORY_CHANGE',
            category: value,
            controls: keys(categories[value].controls),
            filters: keys(categories[value].filters),
            rules: categories[value].rules || {},
            defaults: categories[value].defaults || {},
            validation: categories[value].validation || {}
        })
    }

    useEffect(() => {
        onChange({ value: 'Weapon' })
    }, [])

    const categoryOptions = map(
        (name) => ({ value: name, label: name }),
        keys(categories)
    )

    const changeCounter = useSelector(compose(
        length,
        keys,
        propOr({}, 'preview')
    ))

    return (
        <Aside>
            <Header>
                <span>Add items</span>
                <Controls>
                    <HeaderButton active={previewOpen} onClick={() => togglePreview(!previewOpen)}>
                        <ListIcon />
                        {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
                    </HeaderButton>
                    <HeaderButton onClick={() => dispatch({ type: 'ASIDE_CLOSE', name: 'addItems' })}>
                        <TimesIcon />
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
                            styles={selectStyle()}
                            options={categoryOptions}
                            value={categoryOptions.find(propEq(category, 'value'))}
                            isSearchable={false}
                        />
                    </SelectOuter>
                </CategoriesOuter>
            }
            <AsideInner>
                {previewOpen && <Preview togglePreview={togglePreview} />}
                {category !== '' && <FormOuter isHidden={previewOpen}><Form key={category + counter} /></FormOuter>}
            </AsideInner>
        </Aside>
    )
}

export default AddItemsActual