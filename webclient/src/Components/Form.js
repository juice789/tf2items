import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
    prop, map, values, keys, compose, evolve, assoc, omit, objOf, mergeRight, any, hasPath, props, pick, path, has, apply, pickBy, complement, includes, propEq, allPass, when, toPairs, concat
} from 'ramda'
import { CheckIcon, TimesIcon, ChevronCircleDownIcon } from 'react-line-awesome'
import Select, { createFilter } from 'react-select'
import { areEqual, FixedSizeList as List } from 'react-window'
import Toggle from '@juice789/react-toggle'
import { selectStyle, toggleStyle } from '../globalStyle'
import { safeItems as items } from '@juice789/tf2items'
import categories, { skuFromForm } from './Schema'
import multiEffectList from './Schema/multiEffect'
import { SaveButton } from './Blocks'

const Group = styled.div`
display:flex;
flex-direction:column;
border-bottom: 1px solid #403d4f;
padding: 1rem 1rem 0.5rem 1rem;
font-size: 0.9rem;
color: #8a879a;
`

const Row = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 0.5rem;
height: 2rem;
`

const Label = styled.label`
align-self: center;
width:50%;
margin: 0;
`

const SelectOuter = styled.div`
width:100%;
`

const InputOuter = styled.div`
display:flex;
align-items:center;
justify-content:center;
width:50%;
`

const FilterIcon = styled.div`
display:flex;
color:#6e66a6;
transition: transform 0.2s ease;
font-size:1rem;
`

const FilterHeader = styled.div`
min-height:2.5rem;
display:flex;
align-items:center;
justify-content:space-between;
cursor:pointer;
`

const FilterContent = styled.div`
display:flex;
flex-direction:column;
padding-top:0.5rem;
visibility:${({ hidden }) => hidden ? 'hidden' : 'visible'};
> ${Row} > ${Label}{
    padding-left: 0.5rem;
}`

const Filters = styled.div`
display: ${({ isDisabled }) => isDisabled ? 'none' : 'flex'};
flex-direction: column;
max-height: ${({ isOpen }) => isOpen ? '50rem' : '2.5rem'};
transition: max-height 0.2s ease;
border: 1px solid #403d4f;
padding: 0 0.5rem;
border-radius: 0.5rem;
flex: 0 0 auto;
overflow: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
margin-bottom:0.5rem;
box-sizing: content-box;
> ${FilterHeader} > ${FilterIcon}{
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
}
`

const Input = styled.input`
border: 1px solid #3a3747;
outline: none;
width: 100%;
background-color: #3a3747;
color: #f9f9fa;
height: 35px;
border-radius: 0.2rem;
padding-left: 0.6rem;
font-weight:300 !important;
&:hover{
    border-color: #6e66a6;
}
`

const getItems = compose(
    values,
    map(({ defindex, item_name, propername }) => [defindex, (propername ? 'The ' : '') + item_name])
)

const makeFilters = (filterName, filterValue) => compose(
    includes(filterValue),
    when(complement(Array.isArray), Array.of),
    prop(filterName)
)

const getFilters = compose(
    map(apply(makeFilters)),
    toPairs,
    pickBy(Boolean)
)

const FormActual = () => {

    const dispatch = useDispatch()
    const [isFilterOpen, toggleFilter] = useState(false)
    const formState = useSelector(prop('addItems'), shallowEqual)
    const usePages = useSelector(prop('usePages'))
    const pages = useSelector(prop('pages'))

    const hiddenControlNames = useSelector(compose(
        keys,
        pickBy(propEq(true, 'hidden')),
        path(['addItems', 'rules'])
    ))

    const category = categories[formState.category]

    const filteredItems = pickBy(
        when(
            () => !category.targetFn,
            allPass(getFilters(formState.filters))
        ),
        category.itemFn(items)
    )

    const filteredTargets = category.controls.target
        ? category.targetFn
            ? pickBy(
                allPass(getFilters(formState.filters)),
                category.targetFn(items)
            )
            : items
        : false

    const controls = evolve({
        defindex: assoc('options', getItems(filteredItems)),
        target: assoc('options', getItems(filteredTargets || [])),
    })(category.controls)

    const propChange = (name) => (e) => dispatch({
        type: has(name, map(prop('name'), controls)) ? 'NEWITEM_PROP_CHANGE' : 'NEWITEM_FILTER_CHANGE',
        key: name,
        val: e?.value || e?.target?.value || ''
    })

    const MenuListOption = React.memo(({ index, style, data }) => <div style={style}>{data[index]}</div>, areEqual)

    const MenuList = ({ children }) => (
        <List
            itemCount={children.length}
            itemSize={35}
            height={200}
            itemData={children}
        >
            {MenuListOption}
        </List>
    )

    const getControl = (name, type, { options, isOn, isClearable, isSearchable, remap }) => {
        switch (type) {
            case 'input':
                return <Input type={'number'} onChange={propChange(name)} />
            case 'toggle':
                return (
                    <Toggle disabled={hiddenControlNames[name]} key={name} styles={toggleStyle} isOn={isOn} onChange={propChange(name)} remap={remap}>
                        <Toggle.Left><CheckIcon /></Toggle.Left>
                        <Toggle.Right><TimesIcon /></Toggle.Right>
                    </Toggle>
                )
            default:
                return (
                    <SelectOuter>
                        <Select
                            onChange={propChange(name)}
                            options={map(([value, label]) => ({ value, label }), options)}
                            styles={selectStyle()}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            components={type === 'virtual' ? { MenuList } : {}}
                            filterOption={createFilter({ ignoreAccents: false })}
                        />
                    </SelectOuter>
                )
        }
    }

    const getRow = ({ name, label, type, ...rest }) => (
        <Row key={name} hidden={includes(name, hiddenControlNames)}>
            <Label>{label}:</Label>
            <InputOuter>
                {getControl(name, type, rest)}
            </InputOuter>
        </Row>
    )

    const createItem = skuFromForm(
        omit(
            concat(['defindex'], hiddenControlNames),
            mergeRight(formState.controls, formState.defaults)
        )
    )

    const save = () => dispatch({
        type: 'PREVIEW_ITEMS',
        page: usePages ? formState.props.page : '0',
        items: [createItem({ defindex: formState.controls.defindex })]
    })

    const saveAll = () => dispatch({
        type: 'PREVIEW_ITEMS',
        page: usePages ? formState.props.page : '0',
        items: map(
            compose(createItem, objOf('defindex')),
            keys(filteredItems)
        )
    })

    const saveMultiEffect = () => {
        return dispatch({
            type: 'PREVIEW_ITEMS',
            page: usePages ? formState.props.page : '0',
            items: map(
                compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('effect')),
                keys(multiEffectList[formState.props.multiEffect])
            )
        })
    }

    const saveAllTargets = () => dispatch({
        type: 'PREVIEW_ITEMS',
        page: usePages ? formState.props.page : '0',
        items: map(
            compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('target')),
            keys(filteredTargets)
        )
    })

    const isSaveDisabled = (validationType) => (hasPath(['validation', validationType], formState) && any(complement(Boolean), props(formState.validation[validationType], formState.controls))) || (usePages && !formState.props.page)

    return (
        <>
            <Group>
                {usePages && getRow({ name: 'page', label: 'Page', options: toPairs(pages) })}
                {map(
                    getRow,
                    values(
                        omit(['defindex', 'target', 'craftNumber', 'crateSeries'], controls)
                    )
                )}
                <Filters
                    isDisabled={values(category.filters).length === 0}
                    isOpen={isFilterOpen}>
                    <FilterHeader onClick={() => toggleFilter(!isFilterOpen)}>
                        Filters:
                        <FilterIcon><ChevronCircleDownIcon /></FilterIcon>
                    </FilterHeader>
                    <FilterContent>
                        {map(getRow, values(category.filters))}
                    </FilterContent>
                </Filters>
                {map(getRow, values(pick(['defindex', 'target', 'craftNumber', 'crateSeries'], controls)))}
            </Group>
            <Group>
                <Row>
                    <SaveButton
                        disabled={isSaveDisabled('single')}
                        onClick={save}
                        full={true}>
                        Save
                    </SaveButton>
                </Row>
            </Group>
            <Group>
                <Row>
                    <Label>Save all filtered items:</Label>
                    <SaveButton
                        disabled={isSaveDisabled('multi')}
                        onClick={category.targetFn ? saveAllTargets : saveAll}>
                        Save all ({keys(category.targetFn ? filteredTargets : filteredItems).length})
                    </SaveButton>
                </Row>
            </Group>
            {
                categories[formState.category].multiEffect && formState.controls.quality === '5' &&
                <Group>
                    <Row>Save multiple effects for the selected item:</Row>
                    {getRow(categories[formState.category].multiEffect)}
                    <Row>
                        <SaveButton
                            disabled={isSaveDisabled('effect')}
                            onClick={saveMultiEffect}>
                            Save effects{formState.props.multiEffect ? ' (' + keys(multiEffectList[formState.props.multiEffect]).length + ')' : ''}
                        </SaveButton>
                    </Row>
                </Group>
            }
        </>
    )
}

export default FormActual