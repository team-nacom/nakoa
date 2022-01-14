import React from 'react';
import { Flat, CellType } from '../flat';
import { FlatStateAction } from '../reducer';

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    pos : number,
    dispatch : React.Dispatch<FlatStateAction>
}

function AddCellButton({ parentId, pos, dispatch, ...others }: AddCellButtonProps){

    const addCellHandler = (e: any) => {
        let newType : CellType = 'text';
        dispatch({ type: 'createEmpty', parentId, pos, cellType: newType});
    }

    return (
        <button className='addCellButton material-icons' onClick = { addCellHandler }>
            add
        </button>
    )
}

function InterCell(props: AddCellButtonProps) {
    return (
        <div className='interBlockHelper'>
            <AddCellButton {...props} />
        </div>
    )
}

export default InterCell;