import { useSelector, useDispatch } from 'react-redux'

import { useItemSelector } from '@juice789/tf2items-selector/internal'
import { Aside } from './styles'

const AddItemsActual = () => {
    const dispatch = useDispatch()
    const usePages = useSelector(state => state.usePages)
    const pages = useSelector(state => state.pages)

    const { ItemSelector } = useItemSelector({
        pages: usePages ? pages : undefined,
        onSave: (items, { clear }) => {
            dispatch({ type: 'SAVE_ITEMS', items })
            clear()
        },
        onClose: () => dispatch({ type: 'ASIDE_CLOSE', name: 'addItems' })
    })

    return <Aside>
        <ItemSelector />
    </Aside>
}

export default AddItemsActual
