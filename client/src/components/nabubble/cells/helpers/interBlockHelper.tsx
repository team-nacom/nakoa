// import { FlatAction, FlatSubAction } from '../../action';
import { BubbleType, bubbleBehavior } from '../../types';

import { dispatchType, refsType } from './handlers';
import { focusSibling } from './handlers'

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    idx : number,
    evalSiblingId : () => string[]
    refs : refsType
    dispatch : dispatchType
}

function AddCellButton({ parentId, idx, refs, evalSiblingId, dispatch, ...others }: AddCellButtonProps){

    const addCellHandler = (e: any) => {
        let newType : BubbleType = 'text';
        dispatch({ type: 'add', parentId: parentId, idx: idx, bubble: {
            type : newType || 'text',
            value : '',
            // children : (newType === 'parent' ? [] : undefined)
        } });
        focusSibling(refs, evalSiblingId, idx, 0);
    }

    return (
        <button className='addCellButton material-icons' onClick = { addCellHandler }>
            add
        </button>
    )
}

function InterBlockHelper(props: AddCellButtonProps) {
    return (
        <div className='interBlockHelper'>
            <AddCellButton {...props} />
        </div>
    )
}

export default InterBlockHelper;