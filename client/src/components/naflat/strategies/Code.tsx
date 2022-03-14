import React from 'react';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

function DisplayCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell renderedCodeCell'>
                <code>{contents}</code>
            </pre>
        </>
    );
}


function PreviewCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell previewCodeCell'>
                <code>{contents}</code>
            </pre>
        </>
    );
}


function EditorCodeCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <SingletonTextArea
            name={'cell' + props.cellId}
            className='editorCodeCell editorCell'
            onChange={handleChangeFactory(dispatch,props.cellId)}
            value={contents}
        />
    );
}


const CodeCellStrategy : CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor' : EditorCodeCell
}

export default CodeCellStrategy;