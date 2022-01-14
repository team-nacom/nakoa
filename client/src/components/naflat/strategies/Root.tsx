import React from 'react';
import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

function DisplayRootCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return <h1>{ contents }</h1>;
}


function PreviewRootCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return <h1>{ contents }</h1>;
}


function EditRootCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let title = cell.value;

    if(typeof title !== 'string') return <></>;

    return <input
        className='title'
        value={ title }
        onChange={ handleChangeFactory(props.cellId, props.dispatch) }
    />
}


const RootCellStrategy : CellRenderStrategy = {
    'display': DisplayRootCell,
    'preview': PreviewRootCell,
    'edit' : EditRootCell
}

export default RootCellStrategy;