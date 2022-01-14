import React from 'react';
import { Flat, CellType } from '../flat';
import {  FlatContext } from '../componentTypes';

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    pos : number,
}

function AddCellButton({ parentId, pos, ...others }: AddCellButtonProps){
    const { state, dispatch } = React.useContext(FlatContext);

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