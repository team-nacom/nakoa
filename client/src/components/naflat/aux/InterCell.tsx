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
            onClick = {(ev) => { ev.stopPropagation(); dispatch({ type: 'createEmpty', parentId, pos, cellType: defaultCellType})}}>
            add
        </button>
    )
}

function InterCell(props: AddCellButtonProps) {
    return (
        <div className='interBlockHelper'>
            <div className='interBlockLine'></div>
            <div className='addCellMask'></div>
            <AddCellButton {...props} />
        </div>
    )
}

export default InterCell;