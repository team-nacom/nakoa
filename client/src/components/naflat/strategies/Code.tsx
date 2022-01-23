import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

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
        <TextareaAutosize autoFocus style={ props.style as any }
            name={'cell' + props.cellId}
            className='editorCodeCell editorCell'
            onChange={handleChangeFactory(props.cellId,dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const CodeCellStrategy : CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor' : EditorCodeCell
}

export default CodeCellStrategy;