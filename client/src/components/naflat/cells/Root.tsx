import React from 'react';
import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

function DisplayRootCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return <h1>{ contents }</h1>;
}


function PreviewRootCell(props: CellFragmentProps){
    return <></>;
}


function EditRootCell(props: CellFragmentProps){
    return <></>;
}


const RootStrategy : CellRenderStrategy = {
    'display': DisplayRootCell,
    'preview': PreviewRootCell,
    'edit' : EditRootCell
}

export default RootStrategy;