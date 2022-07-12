import React from 'react'
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
border-right: 1px solid #403d4f;
border-top: 1px solid #403d4f;
width: 35rem;
`

const HeaderBlock = styled.div`
height:49px;
display: flex;
border-bottom: 1px solid #403d4f;
padding-left: 1rem;
padding-right: 0.5rem;
cursor: default;
width: 100%;
flex: 0 0 auto;
align-items: center;
background: #33313f;
justify-content: space-between;
box-sizing:border-box;
`

const Close = styled.div`
width: 3rem;
height: 2rem;
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

export const Header = ({ data, children }) => {
    const dispatch = useDispatch()
    return <HeaderBlock>
        {children}
        <Close onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: data.name })}>
            <TimesIcon />
        </Close>
    </HeaderBlock>
}

export const Content = styled.div`
display: flex;
position: relative;
flex: 1 1 auto;
overflow-y: auto;
`

export const FormInput = styled.input`
border: 1px solid #3a3747;
outline: none;
width: 100%;
background-color: #3a3747;
color: #f9f9fa;
height: 35px;
border-radius: 0.2rem;
padding-left: 0.6rem;
font-weight:300 !important;
:hover{
    border-color: #6e66a6;
}
`

export const Button = styled.div`
display: flex;
justify-content: center;
height:2rem;
align-items:center;
padding: 0.2rem 1rem;
cursor: pointer;
background: ${({ danger }) => danger ? '#b74838' : '#6e66a6'};
color: #f9f9fa;
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height:1rem;
:hover{
    background: ${({ danger }) => danger ? '#762114' : '#897fd0'};
}
`

const CategoriesOuter = styled.div`
display:flex;
background: #33313f;
width:100%;
`

const Title = styled.div`
height:3rem;
padding:1rem;
display:flex;
align-items:center;
width:5rem;
font-size:0.9rem;
`

const SelectOuter = styled.div`
flex-grow:1;
display:flex;
align-items:center;
padding: 0 0.5rem;
> * {
    width:100%;
    font-size:0.9rem;
}
`

const CustomContent = styled(Content)`
@media(max-width:600px){
    flex-direction:column;
}
`

const AsideActual = () => {

    const dispatch = useDispatch()
    const category = useSelector(path(['addItems', 'category']))

    const onClick = (name) => () => {
        dispatch({
            type: 'CATEGORY_CHANGE',
            category: name,
            controls: keys(categories[name].controls),
            filters: keys(categories[name].filters),
            rules: categories[name].rules,
            defaults: categories[name].defaults,
            validation: categories[name].validation
        })
    }

    const categoryOptions = map((name) => ({ value: name, label: name }), keys(categories))

    return (
        <Aside>
            <Header data={{ name: 'items' }}>Add items</Header>
            <CategoriesOuter>
                <Title>Category</Title>
                <SelectOuter>
                    <Select
                        onChange={({ value }) => onClick(value)()}
                        styles={selectStyle()}
                        options={categoryOptions}
                        value={categoryOptions.find(propEq('value', category))}
                    />
                </SelectOuter>
            </CategoriesOuter>
            <CustomContent>
                <Form key={category} />
                <Preview />
            </CustomContent>
        </Aside>
    )
}

export default AsideActual