import styled, { useTheme } from 'styled-components'
import { FaTimes, FaList } from 'react-icons/fa'
import Select from 'react-select'

import { Aside, AsideInner, Header, HeaderButton, ChangeCounter } from './styles'
import categories from './Schema'
import Form from './Form'
import Preview from './Preview'

const CategoriesOuter = styled.div`
display: flex;
align-items: center;
justify-content: center;
background: ${({ theme }) => theme.background2};
width: 100%;
min-height: 3rem;
padding: 0 0.25rem 0 1rem;
border-bottom: 1px solid ${({ theme }) => theme.background2};
font-size: 0.9rem;
color: ${({ theme }) => theme.fontColorHighlight};
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

const Controls = styled.div`
display:flex;
`

const FormOuter = styled.div`
display: ${({ $isHidden }) => $isHidden ? 'none' : 'flex'};
flex-direction:column;
`

const categoryOptions = Object
    .keys(categories)
    .map((name) => ({ value: name, label: name }))

const ItemSelector = ({ state, dispatch, config }) => {
    const theme = useTheme()
    const { form, formKey, preview, previewOpen } = state
    const { pages, selectStyle, toggleStyle, onSave, onClose } = config
    const usePages = !!pages && Object.keys(pages).length > 0

    const clear = () => dispatch({ type: 'CLEAR_PREVIEW' })
    const close = () => dispatch({ type: 'CLOSE' })

    const save = () => onSave(preview, { clear, close })

    const closeClicked = () => {
        close()
        onClose({ clear })
    }

    const changeCounter = Object.keys(preview).length

    return <Aside>
        <Header>
            <span>Add items</span>
            <Controls>
                <HeaderButton $active={previewOpen} onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}>
                    <FaList />
                    {changeCounter > 0 ? <ChangeCounter>{changeCounter}</ChangeCounter> : null}
                </HeaderButton>
                <HeaderButton onClick={closeClicked}>
                    <FaTimes />
                </HeaderButton>
            </Controls>
        </Header>
        {
            previewOpen === false
            && <CategoriesOuter>
                Category:
                <SelectOuter>
                    <Select
                        onChange={({ value }) => dispatch({ type: 'CATEGORY_CHANGE', category: value })}
                        styles={selectStyle(theme)}
                        options={categoryOptions}
                        value={categoryOptions.find(({ value }) => value === form.category)}
                        isSearchable={false}
                    />
                </SelectOuter>
            </CategoriesOuter>
        }
        <AsideInner>
            {previewOpen && <Preview
                previewItems={Object.values(preview)}
                pages={usePages ? pages : null}
                dispatch={dispatch}
                onSave={save}
                onClear={clear}
            />}
            <FormOuter $isHidden={previewOpen}>
                <Form
                    key={form.category + formKey}
                    formState={form}
                    dispatch={dispatch}
                    pages={usePages ? pages : null}
                    selectStyle={selectStyle}
                    toggleStyle={toggleStyle}
                />
            </FormOuter>
        </AsideInner>
    </Aside>
}

export default ItemSelector
