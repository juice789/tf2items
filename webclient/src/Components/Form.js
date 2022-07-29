import React, { useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
    prop, map, values, keys, compose, evolve, assoc, omit, objOf, mergeRight, any, hasPath, props, pick, path, has, apply, pickBy, complement, includes, propEq, allPass, when, of, toPairs, concat
} from 'ramda'

import { CheckIcon, TimesIcon, ChevronCircleDownIcon } from 'react-line-awesome'

import Select, { createFilter } from 'react-select'
import { areEqual, FixedSizeList as List } from 'react-window'

import Toggle from '@juice789/react-toggle'
import { selectStyle, toggleStyle } from '../globalStyle'

import { safeItems as items } from '@juice789/tf2items'

import categories, { skuFromForm } from './Schema'

import multiEffectList from './Schema/multiEffect'

import { Form, FormInner, FormRow, FormLabel, FormSelect, Filters, FilterHeader, Save, InputOuter, FilterContent, FilterIcon, SaveOptions, SaveMain, FormInput } from './FormStyles'

const getItems = compose(
    values,
    map(({ defindex, item_name, propername }) => [defindex, (propername ? 'The ' : '') + item_name])
)

const makeFilters = (filterName, filterValue) => compose(
    includes(filterValue),
    when(complement(Array.isArray), of),
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

    const hiddenControlNames = useSelector(compose(
        keys,
        pickBy(propEq('hidden', true)),
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
                return <FormInput type={'number'} onChange={propChange(name)} />
            case 'toggle':
                return (
                    <Toggle disabled={hiddenControlNames[name]} key={name} styles={toggleStyle} isOn={isOn} onChange={propChange(name)} remap={remap}>
                        <Toggle.Left><CheckIcon /></Toggle.Left>
                        <Toggle.Right><TimesIcon /></Toggle.Right>
                    </Toggle>
                )
            default:
                return (
                    <FormSelect>
                        <Select
                            onChange={propChange(name)}
                            options={map(([value, label]) => ({ value, label }), options)}
                            styles={selectStyle()}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            components={type === 'virtual' ? { MenuList } : {}}
                            filterOption={createFilter({ ignoreAccents: false })}
                        />
                    </FormSelect>
                )
        }
    }

    const getRow = ({ name, label, type, ...rest }) => (
        <FormRow key={name} hidden={includes(name, hiddenControlNames)}>
            <FormLabel>{label}:</FormLabel>
            <InputOuter>
                {getControl(name, type, rest)}
            </InputOuter>
        </FormRow >
    )

    const createItem = skuFromForm(
        omit(
            concat(['defindex'], hiddenControlNames),
            mergeRight(formState.controls, formState.defaults)
        )
    )

    const save = () => dispatch({
        type: 'PREVIEW_ITEMS',
        items: [createItem({ defindex: formState.controls.defindex })]
    })

    const saveAll = () => dispatch({
        type: 'PREVIEW_ITEMS',
        items: map(
            compose(createItem, objOf('defindex')),
            keys(filteredItems)
        )
    })

    const saveMultiEffect = () => {
        return dispatch({
            type: 'PREVIEW_ITEMS',
            items: map(
                compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('effect')),
                keys(multiEffectList[formState.props.multiEffect])
            )
        })
    }

    const saveAllTargets = () => dispatch({
        type: 'PREVIEW_ITEMS',
        items: map(
            compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('target')),
            keys(filteredTargets)
        )
    })

    const isSaveDisabled = (validationType) =>
        hasPath(['validation', validationType], formState)
        && any(complement(Boolean), props(formState.validation[validationType], formState.controls))

    return (
        <Form>
            <FormInner>
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
            </FormInner>
            <SaveOptions>
                <FormRow>
                    <SaveMain
                        disabled={isSaveDisabled('single')}
                        onClick={save}>
                        Save
                    </SaveMain>
                </FormRow>
            </SaveOptions>
            <SaveOptions>
                <FormRow>
                    <FormLabel>Save all filtered items:</FormLabel>
                    <Save
                        disabled={isSaveDisabled('multi')}
                        onClick={category.targetFn ? saveAllTargets : saveAll}>
                        Save all ({keys(category.targetFn ? filteredTargets : filteredItems).length})
                    </Save>
                </FormRow>
            </SaveOptions>
            <SaveOptions>
                {
                    categories[formState.category].multiEffect && formState.controls.quality === '5' &&
                    <>
                        <FormRow>Save multiple effects for the selected item:</FormRow>
                        {getRow(categories[formState.category].multiEffect)}
                        <FormRow>
                            <Save
                                disabled={isSaveDisabled('effect')}
                                onClick={saveMultiEffect}>
                                Save effects{formState.props.multiEffect ? ' (' + keys(multiEffectList[formState.props.multiEffect]).length + ')' : ''}
                            </Save>
                        </FormRow>
                    </>
                }

            </SaveOptions>
        </Form>
    )
}

export default FormActual