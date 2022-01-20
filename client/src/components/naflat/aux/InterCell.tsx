import React from 'react';
import { Flat, CellType, defaultCellType } from '../flat';
import {  FlatContext } from '../componentTypes';

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    pos : number,
}

function AddCellButton({ parentId, pos, ...others }: AddCellButtonProps){
    const { state, dispatch } = React.useContext(FlatContext);

    const addCellHandler = (e: any) => {
        dispatch({ type: 'createEmpty', parentId, pos, cellType: defaultCellType});
    }

    return (
        <button className='addCellButton material-icons'
            onClick = {() => { dispatch({ type: 'createEmpty', parentId, pos, cellType: defaultCellType})}}>
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