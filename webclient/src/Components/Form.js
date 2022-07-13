import React from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
    prop, map, values, keys, compose, evolve, assoc, omit, objOf, mergeRight, any, hasPath, props, pick, path, has, apply, pickBy, complement, includes, propEq, allPass, when, of, toPairs, concat, either
} from 'ramda'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheck,
    faTimes,
    faChevronCircleDown
} from '@fortawesome/free-solid-svg-icons'

import Select from 'react-select'
import SelectVirtual from 'react-select-virtualized'

import Toggle from '@juice789/react-toggle'
import { selectStyle, toggleStyle } from '../globalStyle'

import { safeItems as items } from '@juice789/tf2items'
import categories from './Schema'

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

const skuFromForm = () => { }

const FormActual = () => {

    const dispatch = useDispatch()
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

    const filteredTargets = category.targetFn && pickBy(
        allPass(getFilters(formState.filters)),
        category.targetFn(items)
    )

    const controls = evolve({
        defindex: assoc('options', getItems(filteredItems)),
        target: assoc('options', getItems(filteredTargets || [])),
    })(category.controls)

    const propChange = (name) => (e) => dispatch({
        type: has(name, map(prop('name'), controls)) ? 'NEWITEM_PROP_CHANGE' : 'NEWITEM_FILTER_CHANGE',
        key: name,
        val: e?.value || ''
    })

    const getRow = ({ name, label, options, type, isOn, isClearable = false, remap }) => (
        <FormRow key={name}>
            <FormLabel>{label}:</FormLabel>
            <InputOuter>
                {type === 'input' ?
                    <FormInput name={name} key={name} onChange={propChange(name)} />
                    :
                    type === 'toggle' ?
                        <Toggle styles={toggleStyle} isOn={isOn} onChange={propChange(name)} remap={remap}>
                            <Toggle.Left><FontAwesomeIcon icon={faCheck} /></Toggle.Left>
                            <Toggle.Right><FontAwesomeIcon icon={faTimes} /></Toggle.Right>
                        </Toggle> :
                        type === 'virtual' ?
                            <FormSelect>
                                <SelectVirtual
                                    onChange={propChange(name)}
                                    options={map(([value, label]) => ({ value, label }), options)}
                                    styles={selectStyle()}
                                    isClearable={isClearable}
                                />
                            </FormSelect> :
                            <FormSelect>
                                <Select
                                    onChange={propChange(name)}
                                    options={map(([value, label]) => ({ value, label }), options)}
                                    styles={selectStyle()}
                                    isClearable={isClearable}
                                />
                            </FormSelect>
                }
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
        type: 'ADD_ITEMS',
        items: [createItem({ defindex: formState.controls.defindex })]
    })

    const saveAll = () => dispatch({
        type: 'ADD_ITEMS',
        items: map(
            compose(createItem, objOf('defindex')),
            keys(filteredItems)
        )
    })

    const saveMultiEffect = () => {
        return dispatch({
            type: 'ADD_ITEMS',
            items: map(
                compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('effect')),
                keys(multiEffectList[formState.props.multiEffect])
            )
        })
    }

    const saveAllTargets = () => dispatch({
        type: 'ADD_ITEMS',
        items: map(
            compose(createItem, mergeRight({ defindex: formState.controls.defindex }), objOf('target')),
            keys(filteredTargets)
        )
    })

    const saveDisabled = (validationType) => hasPath(['validation', validationType], formState) && any(complement(Boolean), props(formState.validation[validationType], formState.controls))

    return (
        <Form>
            <FormInner>
                {map(
                    getRow,
                    values(
                        omit(
                            ['defindex', 'target', 'craftNumber', 'crateSeries'],
                            pickBy((v, k) => complement(includes)(k, hiddenControlNames), controls),
                        )
                    )
                )}
                <Filters
                    isDisabled={values(category.filters).length === 0}
                    isOpen={formState.filterOpen}>
                    <FilterHeader onClick={() => dispatch({ type: 'FILTER_TOGGLE' })}>
                        Filters:
                        <FilterIcon><FontAwesomeIcon icon={faChevronCircleDown} /></FilterIcon>
                    </FilterHeader>
                    <FilterContent>
                        {map(getRow, values(category.filters))}
                    </FilterContent>
                </Filters>
                {map(getRow, values(pick(['defindex', 'target', 'craftNumber', 'crateSeries'], controls)))}
            </FormInner>
            <SaveOptions>
                <SaveMain
                    disabled={saveDisabled('single')}
                    onClick={save}>
                    Save
                </SaveMain>
            </SaveOptions>
            <SaveOptions>
                <FormRow>
                    <FormLabel>Save all filtered items:</FormLabel>
                    <Save
                        disabled={saveDisabled('multi')}
                        onClick={category.targetFn ? saveAllTargets : saveAll}>
                        Save all ({Object.keys(category.targetFn ? filteredTargets : filteredItems).length})
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
                                disabled={saveDisabled('effect')}
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