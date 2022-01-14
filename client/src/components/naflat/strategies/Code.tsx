import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

function DisplayCodeCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
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


function PreviewCodeCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
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


function EditorCodeCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={ props.style as any }
            name={'cell' + props.cellId}
            className='editorCodeCell editorCell'
            onChange={handleChangeFactory(props.cellId,props.dispatch)}
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