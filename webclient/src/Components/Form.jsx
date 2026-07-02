import { useState, useMemo, memo } from 'react'
import styled, { useTheme } from 'styled-components'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FaCheck, FaTimes, FaChevronCircleDown } from 'react-icons/fa'
import Select, { createFilter, components as SelectComponents } from 'react-select'
import { areEqual, FixedSizeList as List } from 'react-window'
import Toggle from '@juice789/react-toggle/themed'
import { safeItems as items } from '@juice789/tf2items'

import { selectStyle, toggleStyle } from '../globalStyle'
import categories, { skuFromForm } from './Schema'
import multiEffectList from './Schema/multiEffect'
import { SaveButton } from './styles'

const Group = styled.div`
display:flex;
flex-direction:column;
border-bottom: 1px solid ${({ theme }) => theme.background4};
padding: 1rem 1rem 0.5rem 1rem;
font-size: 0.9rem;
color: ${({ theme }) => theme.fontColorDim};
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
color:${({ theme }) => theme.mainColor};
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
visibility:${({ $hidden }) => $hidden ? 'hidden' : 'visible'};
> ${Row} > ${Label}{
    padding-left: 0.5rem;
}`

const Filters = styled.div`
display: ${({ $isDisabled }) => $isDisabled ? 'none' : 'flex'};
flex-direction: column;
max-height: ${({ $isOpen }) => $isOpen ? '50rem' : '2.5rem'};
transition: max-height 0.2s ease;
border: 1px solid ${({ theme }) => theme.background4};
padding: 0 0.5rem;
border-radius: 0.5rem;
flex: 0 0 auto;
overflow: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
margin-bottom:0.5rem;
box-sizing: content-box;
> ${FilterHeader} > ${FilterIcon}{
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
}
`

const Input = styled.input`
border: 1px solid ${({ theme }) => theme.background3};
outline: none;
width: 100%;
background-color: ${({ theme }) => theme.background3};
color: ${({ theme }) => theme.fontColorHighlight};
height: 35px;
border-radius: 0.2rem;
padding-left: 0.6rem;
font-weight:300 !important;
&:hover{
    border-color: ${({ theme }) => theme.mainColor};
}
`

const getItems = items =>
    Object
        .values(items)
        .map(({ defindex, item_name, propername }) => [defindex, (propername ? 'The ' : '') + item_name])

const makeFilters = (filterName, filterValue) => (filter) =>
    (
        Array.isArray(filter[filterName])
            ? filter[filterName]
            : [filter[filterName]]
    ).includes(filterValue)

const getFilters = filters => Object
    .entries(filters)
    .filter(([, value]) => !!value)
    .map(([filterName, filterValue]) => makeFilters(filterName, filterValue))

const MenuListOption = memo(({ index, style, data }) => <div style={style}>{data[index]}</div>, areEqual)

const VirtualOption = ({ innerProps, label, ...props }) => (
    <SelectComponents.Option
        {...props}
        label={label}
        innerProps={{ ...innerProps, onMouseMove: undefined, onMouseOver: undefined, title: label }}
    />
)

const MenuList = ({ children }) => (
    <List
        itemCount={children.length}
        itemSize={40}
        height={200}
        itemData={children}
    >
        {MenuListOption}
    </List>
)

const FormActual = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [isFilterOpen, toggleFilter] = useState(false)
    const formState = useSelector(state => state.addItems, shallowEqual)
    const usePages = useSelector(state => state.usePages)
    const pages = useSelector(state => state.pages)

    const hiddenControlNames = useSelector(({ addItems }) => Object
        .entries(addItems.rules)
        .filter(([, rule]) => rule.hidden)
        .map(([name]) => name)
    )

    const category = categories[formState.category]

    const filteredItems = useMemo(() => Object.fromEntries(
        Object
            .entries(category.itemFn(items))
            .filter(([, items]) => category.targetFn || getFilters(formState.filters).every(filter => filter(items)))
    ), [category, formState.filters])

    const filteredTargets = useMemo(() => category.controls.target
        ? category.targetFn
            ? Object.fromEntries(
                Object
                    .entries(category.targetFn(items))
                    .filter(([, items]) => getFilters(formState.filters).every(filter => filter(items)))
            )
            : items
        : false, [category, formState.filters])

    const controls = useMemo(() => ({
        ...category.controls,
        ...(category.controls.defindex && {
            defindex: {
                ...category.controls.defindex,
                options: getItems(filteredItems)
            }
        }),
        ...(category.controls.target && {
            target: {
                ...category.controls.target,
                options: getItems(filteredTargets || [])
            }
        })
    }), [category, filteredItems, filteredTargets])

    const propChange = (name) => (e) => dispatch({
        type: name in controls ? 'NEWITEM_PROP_CHANGE' : 'NEWITEM_FILTER_CHANGE',
        key: name,
        val: e?.value || e?.target?.value || ''
    })

    const getControl = (name, type, { options, isOn, isClearable, isSearchable, remap }) => {
        switch (type) {
            case 'input':
                return <Input type={'number'} onChange={propChange(name)} />
            case 'toggle':
                return (
                    <Toggle disabled={hiddenControlNames[name]} key={name} styles={toggleStyle} isOn={isOn} onChange={propChange(name)} remap={remap}>
                        <Toggle.Left><FaCheck /></Toggle.Left>
                        <Toggle.Right><FaTimes /></Toggle.Right>
                    </Toggle>
                )
            default:
                return (
                    <SelectOuter>
                        <Select
                            onChange={propChange(name)}
                            options={options.map(([value, label]) => ({ value, label }))}
                            styles={selectStyle(theme, { menuStyles: { width: '200%', left: '-100%' } })}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            components={type === 'virtual' ? { MenuList, Option: VirtualOption } : {}}
                            filterOption={createFilter({ ignoreAccents: false })}
                        />
                    </SelectOuter>
                )
        }
    }

    const getRow = ({ name, label, type, ...rest }) => (
        <Row key={name} hidden={hiddenControlNames.includes(name)}>
            <Label>{label}:</Label>
            <InputOuter>
                {getControl(name, type, rest)}
            </InputOuter>
        </Row>
    )

    const createItem = skuFromForm(
        Object.fromEntries(
            Object
                .entries({ ...formState.controls, ...formState.defaults })
                .filter(([key]) => ![...hiddenControlNames, 'defindex'].includes(key))
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
        items: Object.keys(filteredItems).map(key => createItem({ defindex: key }))
    })

    const saveMultiEffect = () => {
        return dispatch({
            type: 'PREVIEW_ITEMS',
            page: usePages ? formState.props.page : '0',
            items: Object.keys(multiEffectList[formState.props.multiEffect]).map(
                key => createItem({ defindex: formState.controls.defindex, effect: key })
            )
        })
    }

    const saveAllTargets = () => dispatch({
        type: 'PREVIEW_ITEMS',
        page: usePages ? formState.props.page : '0',
        items: Object.keys(filteredTargets).map(
            key => createItem({ defindex: formState.controls.defindex, target: key })
        )
    })

    const isSaveDisabled = (validationType) =>
        (
            validationType in (formState.validation || {})
            && formState.validation[validationType].some(key => !formState.controls[key])
        )
        || (validationType === 'effect' && !formState.props.multiEffect)
        || (usePages && !formState.props.page)

    const lastControlNames = ['defindex', 'target', 'craftNumber', 'crateSeries']
    const mainControls = Object.entries(controls).filter(([key]) => !lastControlNames.includes(key)).map(([, value]) => value)
    const lastControls = Object.entries(controls).filter(([key]) => lastControlNames.includes(key)).map(([, value]) => value)

    return <>
        <Group>
            {usePages && getRow({ name: 'page', label: 'Page', options: Object.entries(pages) })}
            {mainControls.map(getRow)}
            <Filters
                $isDisabled={Object.values(category.filters || {}).length === 0}
                $isOpen={isFilterOpen}>
                <FilterHeader onClick={() => toggleFilter(!isFilterOpen)}>
                    Filters:
                    <FilterIcon><FaChevronCircleDown /></FilterIcon>
                </FilterHeader>
                <FilterContent>
                    {Object.values(category.filters || {}).map(getRow)}
                </FilterContent>
            </Filters>
            {lastControls.map(getRow)}
        </Group>
        <Group>
            <Row>
                <SaveButton
                    disabled={isSaveDisabled('single')}
                    onClick={save}
                    $full={true}>
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
                    Save all ({Object.keys(category.targetFn ? filteredTargets : filteredItems).length})
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
                        Save effects{formState.props.multiEffect ? ' (' + Object.keys(multiEffectList[formState.props.multiEffect]).length + ')' : ''}
                    </SaveButton>
                </Row>
            </Group>
        }
    </>
}

export default FormActual