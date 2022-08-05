import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { TimesIcon } from 'react-line-awesome'
import { selectStyle } from '../globalStyle'
import { propEq, prop, compose, map, pickBy, T, path, toPairs, omit, assoc, when, gte, __, indexOf, chain, toLower } from 'ramda'
import Select from 'react-select'

const Settings = styled.div`
display: flex;
flex-direction: column;
position: relative;
flex: 0 1 auto;
overflow-y: auto;
width: 25%;
`

const Header = styled.div`
height:3rem;
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

const Content = styled.div`
display: flex;
position: relative;
flex: 1 1 auto;
overflow-y: auto;
`

const PageInner = styled.div`
display:flex;
flex-direction:column;
font-size:0.9rem;
color:#8a879a;
width:100%;
`

const Group = styled.div`
display:flex;
flex-direction:column;
border-bottom: ${({ inner }) => inner ? 0 : '1px solid #403d4f'};
padding: ${({ inner }) => inner ? 0 : '1rem'};
width:100%;
`

const GroupHeader = styled.div`
display:flex;
align-items:center;
justify-content:center;
padding-bottom:1rem;
`

const Label = styled.div`
width:50%;
min-width:50%;
display:flex;
align-items:center;
padding: 0.5rem 1rem 0 1rem;
`

const Control = styled.div`
min-width:50%;
display:flex;
justify-content:space-around;
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
display:flex;
width:100%;
> * {
    flex-grow:1;
}
`

const Button = styled.div`
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
}`

const getPageOptions = compose(
    map(([value, label]) => ({ value, label })),
    toPairs,
    omit(['0'])
)

const SettingsActual = () => {

    const dispatch = useDispatch()

    const searchTerm = useSelector(path(['search', 'value']))
    const selectedPage = useSelector(prop('selectedPage'))
    const selectedItems = useSelector(prop('selectedItems'))
    const pages = useSelector(prop('pages'))

    const pageItems = useSelector(
        compose(
            map(T),/*
            when(() => Boolean(searchTerm), pickBy(compose(gte(__, 0), indexOf(toLower(searchTerm)), prop('name')))),
            map(chain(assoc('name'), compose(toLower, prop('name'), itemFromSku, prop('sku')))),
            pickBy(propEq('page', selectedPage)),*/
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

    return (
        <Settings>
            <Header>
                Settings
                <Close onClick={() => dispatch({ type: 'ASIDE_TOGGLE', name: 'settings' })}>
                    <TimesIcon />
                </Close>
            </Header>
            <Content>
                <PageInner>
                    <Group>
                        <GroupHeader>Select all items on this page:</GroupHeader>
                        <Control>
                            <Button onClick={selectAll}>Select</Button>
                            <Button onClick={deselectAll}>Deselect</Button>
                        </Control>
                    </Group>
                    <Group>
                        <GroupHeader>Perform action on every selected item:</GroupHeader>
                        <Group inner={true}>
                            <Row>
                                <Label>Page:</Label>
                                <Control>
                                    <ControlOuter>
                                        <Select
                                            isSearchable={false}
                                            styles={selectStyle()}
                                            options={pageOptions}
                                            value={pageOptions.find(propEq('value', selectedPage))}
                                            onChange={({ value }) => setVal('page', value)()}
                                        />
                                    </ControlOuter>
                                </Control>
                            </Row>
                        </Group>
                    </Group>
                    <Group>
                        <GroupHeader>Remove every selected item:</GroupHeader>
                        <Control>
                            <Button danger={true} onClick={setVal('toRemove', '1')}>Remove</Button>
                        </Control>
                    </Group>
                </PageInner>
            </Content>
        </Settings>
    )
}

export default SettingsActual