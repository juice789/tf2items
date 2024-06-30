import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { SaveIcon, TimesIcon } from 'react-line-awesome'
import { selectStyle } from '../globalStyle'
import { propEq, prop, compose, map, pickBy, T, path, toPairs, assoc, when, gte, __, indexOf, chain, toLower, filter, keys } from 'ramda'
import Select from 'react-select'
import { itemNameFromSku } from '@juice789/tf2items'
import { Aside, AsideInner, Header, HeaderButton, SaveButton } from './Blocks'

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
padding-top: 0.5rem;
padding-right: ${({ inner }) => inner ? '1rem' : '0'};
align-items:center;
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
const FileInput = styled.input`
display:none;
`

const FileLabel = styled.label`
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
margin:0;
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
    const searchTerm = useSelector(path(['search', 'value']))
    const selectedPage = useSelector(prop('selectedPage'))
    const usePages = useSelector(prop('usePages'))
    const selectedItems = useSelector(prop('selectedItems'))
    const pages = useSelector(prop('pages'))
    const [newPage, setNewPage] = useState(null)

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
            pickBy(propEq(selectedPage, 'page')),
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

    const noSelection = keys(selectedItems).length === 0

    const resetState = () => {
        dispatch({
            type: 'NOTIFICATION_PUSH',
            notification: {
                id: Date.now().toString(),
                type: 'info',
                label: 'Are you sure? This will reset all items.',
                blocking: true,
                payload: {
                    type: 'RESET_STATE'
                },
                buttons: 'yesNo'
            }
        })
    }

    const exportState = () => {
        dispatch({
            type: 'EXPORT_STATE'
        })
    }

    const onUpload = (e) => {
        var reader = new FileReader()
        reader.onload = onReaderLoad
        reader.readAsText(e.target.files[0])
    }

    function onReaderLoad(e) {
        var importedState = JSON.parse(e.target.result)
        dispatch({
            type: 'IMPORT_STATE',
            importedState
        })
    }

    return (
        <Aside>
            <Header>
                Settings
                <HeaderButton onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'settings' })}>
                    <TimesIcon />
                </HeaderButton>
            </Header>
            <AsideInner>
                <Group padBottom={true}>
                    <GroupHeader>Use Pages:</GroupHeader>
                    <ControlOuter>
                        <Select
                            isSearchable={false}
                            styles={selectStyle()}
                            options={usePagesOptions}
                            value={usePagesOptions.find(propEq(usePages, 'value'))}
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
                                    <Control inner={true}>
                                        <ControlOuter>
                                            <Select
                                                isSearchable={false}
                                                isClearable={true}
                                                styles={selectStyle()}
                                                options={pageOptions}
                                                value={pageOptions.find(propEq(newPage, 'value'))}
                                                onChange={(props) => setNewPage(props?.value)}
                                            />
                                        </ControlOuter>
                                    </Control>
                                </Row>
                                <Row inner={true}>
                                    <Label></Label>
                                    <Control inner={true}>
                                        <ControlOuter>
                                            <SaveButton
                                                disabled={!Boolean(newPage) || noSelection}
                                                onClick={setVal('page', newPage)}>
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
                            <Control inner={true}>
                                <SaveButton
                                    disabled={noSelection}
                                    full={true}
                                    danger={true}
                                    onClick={setVal('toRemove', '1')}>
                                    Remove
                                </SaveButton>
                            </Control>
                        </Row>
                    </Group>
                </Group>
                <Group padBottom={true}>
                    <ControlOuter>
                        <SaveButton
                            full={true}
                            danger={true}
                            onClick={resetState}>
                            Reset state
                        </SaveButton>
                    </ControlOuter>
                </Group>
                <Group padBottom={true}>
                    <ControlOuter>
                        <SaveButton
                            full={true}
                            onClick={exportState}>
                            Export state
                        </SaveButton>
                    </ControlOuter>
                </Group>
                <Group padBottom={true}>
                    <ControlOuter>
                        <SaveButton full={true}>
                            <FileLabel htmlFor="importstate">Import state</FileLabel>
                        </SaveButton>
                        <FileInput type="file" id="importstate" name="importstate" accept="application/JSON" multiple={false} onChange={onUpload} />
                    </ControlOuter>
                </Group>
            </AsideInner>
        </Aside>
    )
}

export default SettingsActual