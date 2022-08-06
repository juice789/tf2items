import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { SaveIcon, TimesIcon } from 'react-line-awesome'
import { selectStyle } from '../globalStyle'
import { propEq, prop, compose, map, pickBy, T, path, toPairs, assoc, when, gte, __, indexOf, chain, toLower, filter } from 'ramda'
import Select from 'react-select'
import { itemNameFromSku } from '@juice789/tf2items'
import { Aside, Header, HeaderButton, SaveButton } from './Blocks'

const Group = styled.div`
display: flex;
flex-direction: column;
border-bottom: ${({ inner }) => inner ? 0 : '1px solid #403d4f'};
padding: ${({ inner }) => inner ? 0 : '1rem'};
font-size: 0.9rem;
width:100%;
color: #8a879a;
`

const GroupHeader = styled.div`
display: flex;
align-items: center;
justify-content: center;
padding-bottom: 1rem;
`

const Label = styled.div`
width: 50%;
min-width: 50%;
display: flex;
align-items: center;
padding: 0.5rem 1rem 0 1rem;
`

const Control = styled.div`
min-width: 50%;
display: flex;
justify-content: space-around;
padding: 0.5rem 1rem 0rem 0;
`

const Row = styled.div`
display: flex;
border: ${({ inner }) => inner ? 0 : '1px solid #403d4f'};
margin-bottom: ${({ inner }) => inner ? 0 : '0.5rem'};
padding-bottom: ${({ inner }) => inner ? 0 : '0.5rem'};
border-radius: ${({ inner }) => inner ? 0 : '0.5rem'};
`

const ControlOuter = styled.div`
display: flex;
width: 100%;
> * {
    flex-grow: 1;
}
`

const getPageOptions = compose(
    map(([value, label]) => ({ value, label })),
    toPairs
)

const usePagesOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const SettingsActual = () => {

    const dispatch = useDispatch()
    const pageRef = useRef()
    const searchTerm = useSelector(path(['search', 'value']))
    const selectedPage = useSelector(prop('selectedPage'))
    const usePages = useSelector(prop('usePages'))
    const selectedItems = useSelector(prop('selectedItems'))
    const pages = useSelector(prop('pages'))

    const pageItems = useSelector(
        compose(
            map(T),
            when(
                () => Boolean(searchTerm),
                filter(compose(gte(__, 0), indexOf(toLower(searchTerm)), prop('name')))
            ),
            map(chain(
                assoc('name'),
                compose(toLower, itemNameFromSku, prop('sku'))
            )),
            pickBy(propEq('page', selectedPage)),
            prop('items')
        )
    )

    const pageOptions = getPageOptions(pages)

    const selectAll = () => dispatch({
        type: 'SET_SELECTION',
        items: pageItems
    })

    const deselectAll = () => dispatch({ type: 'DESELECT_ALL' })

    const setVal = (propName, value) => () => dispatch({
        type: 'MASS_PROP_CHANGE',
        items: map(assoc('__' + propName, value), selectedItems)
    })


    const setUsePages = ({ value }) => {

        const payload = {
            type: 'USE_PAGES',
            value
        }

        value
            ? dispatch(payload)
            : dispatch({
                type: 'NOTIFICATION_PUSH',
                notification: {
                    id: Date.now().toString(),
                    type: 'info',
                    label: 'Are you sure? This will reset all pages.',
                    blocking: true,
                    payload,
                    buttons: 'yesNo'
                }
            })
    }


    const savePage = () => {
        const selected = pageRef.current.state.selectValue[0]?.value
        selected !== undefined &&
            setVal('page', selected)()
    }

    return (
        <Aside>
            <Header>
                Settings
                <HeaderButton onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'settings' })}>
                    <TimesIcon />
                </HeaderButton>
            </Header>
            <Group padBottom={true}>
                <GroupHeader>Use Pages:</GroupHeader>
                <ControlOuter>
                    <Select
                        isSearchable={false}
                        styles={selectStyle()}
                        options={usePagesOptions}
                        value={usePagesOptions.find(propEq('value', usePages))}
                        onChange={setUsePages}
                    />
                </ControlOuter>
            </Group>
            <Group padBottom={true}>
                <GroupHeader>Select all items on this page:</GroupHeader>
                <Control>
                    <SaveButton onClick={selectAll}>Select</SaveButton>
                    <SaveButton onClick={deselectAll}>Deselect</SaveButton>
                </Control>
            </Group>
            <Group>
                <GroupHeader>Perform action on every selected item:</GroupHeader>
                {
                    usePages && <Row>
                        <Group inner={true}>
                            <Row inner={true}>
                                <Label>Page:</Label>
                                <Control>
                                    <ControlOuter>
                                        <Select
                                            isSearchable={false}
                                            isClearable={true}
                                            styles={selectStyle()}
                                            options={pageOptions}
                                            ref={pageRef}
                                        />
                                    </ControlOuter>
                                </Control>
                            </Row>
                            <Row inner={true}>
                                <Label></Label>
                                <Control>
                                    <ControlOuter>
                                        <SaveButton onClick={savePage}>
                                            <SaveIcon />
                                        </SaveButton>
                                    </ControlOuter>
                                </Control>
                            </Row>
                        </Group>
                    </Row>
                }
                <Group inner={true}>
                    <Row>
                        <Label>Remove selected:</Label>
                        <Control>
                            <SaveButton full={true} danger={true} onClick={setVal('toRemove', '1')}>Remove</SaveButton>
                        </Control>
                    </Row>
                </Group>
            </Group>
        </Aside>
    )
}

export default SettingsActual