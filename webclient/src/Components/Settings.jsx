import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { FaSave, FaTimes } from 'react-icons/fa'
import { selectStyle } from '../globalStyle'
import Select from 'react-select'
import { itemNameFromSku } from '@juice789/tf2items'
import { Aside, AsideInner, Header, HeaderButton, SaveButton } from './styles'

const Group = styled.div`
display: flex;
flex-direction: column;
border-bottom: ${({ $inner, theme }) => $inner ? 0 : `1px solid ${theme.background4}`};
padding: ${({ $inner }) => $inner ? 0 : '1rem'};
font-size: 0.9rem;
width:100%;
color: ${({ theme }) => theme.fontColorDim};
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
padding-right: ${({ $inner }) => $inner ? '1rem' : '0'};
align-items:center;
`

const Row = styled.div`
display: flex;
border: ${({ $inner, theme }) => $inner ? 0 : `1px solid ${theme.background4}`};
margin-bottom: ${({ $inner }) => $inner ? 0 : '0.5rem'};
padding-bottom: ${({ $inner }) => $inner ? 0 : '0.5rem'};
border-radius: ${({ $inner }) => $inner ? 0 : '0.5rem'};
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

const usePagesOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const SettingsActual = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const usePages = useSelector(state => state.usePages)
    const selectedItems = useSelector(state => state.selectedItems)
    const pages = useSelector(state => state.pages)
    const [newPage, setNewPage] = useState(null)

    const pageItems = useSelector(({ items, search, selectedPage }) => Object.fromEntries(
        Object
            .entries(items)
            .filter(([, item]) => item.page === selectedPage)
            .map(([sku, item]) => [sku, { ...item, name: itemNameFromSku(item.sku).toLowerCase() }])
            .filter(([, item]) => !search.value || item.name.indexOf(search.value.toLowerCase()) >= 0)
            .map(([sku]) => [sku, true])
    ))

    const pageOptions = Object.entries(pages).map(([value, label]) => ({ value, label }))

    const selectAll = () => dispatch({
        type: 'SET_SELECTION',
        items: pageItems
    })

    const deselectAll = () => dispatch({ type: 'DESELECT_ALL' })

    const setVal = (propName, value) => () => dispatch({
        type: 'MASS_PROP_CHANGE',
        items: Object.fromEntries(Object
            .entries(selectedItems)
            .map(([sku]) => [sku, { ['__' + propName]: value }])
        )
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

    const noSelection = Object.keys(selectedItems).length === 0

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

    return <Aside>
        <Header>
            Settings
            <HeaderButton onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'settings' })}>
                <FaTimes />
            </HeaderButton>
        </Header>
        <AsideInner>
            <Group $padBottom={true}>
                <GroupHeader>Use Pages:</GroupHeader>
                <ControlOuter>
                    <Select
                        isSearchable={false}
                        styles={selectStyle(theme)}
                        options={usePagesOptions}
                        value={usePagesOptions.find(option => option.value === usePages)}
                        onChange={setUsePages}
                    />
                </ControlOuter>
            </Group>
            <Group $padBottom={true}>
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
                        <Group $inner={true}>
                            <Row $inner={true}>
                                <Label>Page:</Label>
                                <Control $inner={true}>
                                    <ControlOuter>
                                        <Select
                                            isSearchable={false}
                                            isClearable={true}
                                            styles={selectStyle(theme)}
                                            options={pageOptions}
                                            value={pageOptions.find(option => option.value === newPage)}
                                            onChange={(props) => setNewPage(props?.value)}
                                        />
                                    </ControlOuter>
                                </Control>
                            </Row>
                            <Row $inner={true}>
                                <Label></Label>
                                <Control $inner={true}>
                                    <ControlOuter>
                                        <SaveButton
                                            disabled={!Boolean(newPage) || noSelection}
                                            onClick={setVal('page', newPage)}>
                                            <FaSave />
                                        </SaveButton>
                                    </ControlOuter>
                                </Control>
                            </Row>
                        </Group>
                    </Row>
                }
                <Group $inner={true}>
                    <Row>
                        <Label>Remove selected:</Label>
                        <Control $inner={true}>
                            <SaveButton
                                disabled={noSelection}
                                $full={true}
                                $danger={true}
                                onClick={setVal('toRemove', '1')}>
                                Remove
                            </SaveButton>
                        </Control>
                    </Row>
                </Group>
            </Group>
            <Group $padBottom={true}>
                <ControlOuter>
                    <SaveButton
                        $full={true}
                        $danger={true}
                        onClick={resetState}>
                        Reset state
                    </SaveButton>
                </ControlOuter>
            </Group>
            <Group $padBottom={true}>
                <ControlOuter>
                    <SaveButton
                        $full={true}
                        onClick={exportState}>
                        Export state
                    </SaveButton>
                </ControlOuter>
            </Group>
            <Group $padBottom={true}>
                <ControlOuter>
                    <SaveButton $full={true}>
                        <FileLabel htmlFor="importstate">Import state</FileLabel>
                    </SaveButton>
                    <FileInput type="file" id="importstate" name="importstate" accept="application/JSON" multiple={false} onChange={onUpload} />
                </ControlOuter>
            </Group>
        </AsideInner>
    </Aside>
}

export default SettingsActual