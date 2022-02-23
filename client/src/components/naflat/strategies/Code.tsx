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
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell renderedCodeCell'>
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
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell previewCodeCell'>
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
            <div className='editorCellDividor'></div> {/* only for css */}
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