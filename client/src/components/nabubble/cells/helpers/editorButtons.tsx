import { FlatAction, FlatSubAction } from '../../action';
import { BubbleType, bubbleBehavior } from '../../types';

import { dispatchType, refsType } from './handlers';
import { focusSibling } from './handlers'

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    idx : number,
    evalChildrenId : () => string[]
    cellType? : BubbleType,
    refs : refsType
    dispatch : dispatchType
}

function AddCellButton({ parentId, idx, cellType, refs, evalChildrenId, dispatch, ...others }: AddCellButtonProps){

    const addCellHandler = (e: any) => {
        dispatch({ type: 'add', parentId: parentId, idx: idx, bubble: {
            type : cellType || 'text',
            value : '',
            children : (cellType === 'parent' ? [] : undefined)
        } });
        focusSibling(refs, evalChildrenId, idx, 0);
    }

    return (<button className='addCellButton' onClick = { addCellHandler }>
        add cell
    </button>)
}

export { AddCellButton };