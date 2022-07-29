import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { map, keys, path, propEq } from 'ramda'
import styled from 'styled-components'
import { TimesIcon } from 'react-line-awesome'
import Select from 'react-select'

import { selectStyle } from '../globalStyle'
import categories from './Schema'

import Form from './Form.js'
import Preview from './Preview.js'

const Aside = styled.div`
display: flex;
flex-direction: column;
position: relative;
flex: 0 1 auto;
overflow-y: auto;
width: 50%;
`

const Header = styled.div`
height:49px;
display: flex;
border-bottom: 1px solid #403d4f;
padding: 0 0.25rem 0 1rem;
flex: 0 0 auto;
align-items: center;
background: #33313f;
justify-content: space-between;
box-sizing:border-box;
font-size: 0.9rem;
color: #f9f9fa;
`

const Close = styled.div`
width: 3rem;
height: 2rem;
margin: 0 0.25rem 0 0.25rem;
border-radius: 0.5rem;
background: #2d2b37;
display: flex;
align-items: center;
justify-content: center;
color: #8a879a;
transition: color 0.2s ease;
cursor: pointer;
:hover {
    color: #e1e0e5;
}
`

const CategoriesOuter = styled.div`
display: flex;
align-items: center;
justify-content: center;
background: #33313f;
width: 100%;
min-height: 49px;
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

const Content = styled.div`
display: flex;
position: relative;
flex: 1 1 auto;
overflow-y: auto;
`

const AddItemsActual = () => {

    const dispatch = useDispatch()
    const category = useSelector(path(['addItems', 'category']))
    const [counter, setCounter] = useState(0)
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

    return (
        <Aside>
            <Header>
                <span>Add items</span>
                <Close onClick={() => dispatch({ type: 'ASIDE_CLOSE', name: 'addItems' })}>
                    <TimesIcon />
                </Close>
            </Header>
            <CategoriesOuter>
                Category:
                <SelectOuter>
                    <Select
                        onChange={onChange}
                        styles={selectStyle()}
                        options={categoryOptions}
                        value={categoryOptions.find(propEq('value', category))}
                        isSearchable={false}
                    />
                </SelectOuter>
            </CategoriesOuter>
            <Content>
                {category !== '' && <Form key={category + counter} />}
                <Preview />
            </Content>
        </Aside>
    )
}

export default AddItemsActual