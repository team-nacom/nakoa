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
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <pre className='codeCellPreview'>
                <code>{contents}</code>
            </pre>
        </div>
    );
}


function PreviewCodeCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='codeCell'>
            <summary className='codeCellLabel'>
                코드
            </summary>
            <pre className='codeCellPreview'>
                <code>{contents}</code>
            </pre>
        </div>
    );
}


function EditorCodeCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='editorCodeCellWrapper'>
            <SingletonTextArea
                style={ props.style as any }
                name={'cell' + props.cellId}
                className='editorCodeCell editorCell'
                onChange={handleChangeFactory(dispatch,props.cellId)}
                value={contents}
            />
            <PreviewCodeCell {...props}/>
        </div>
    );
}


const CodeCellStrategy : CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor' : EditorCodeCell
}

export default CodeCellStrategy;