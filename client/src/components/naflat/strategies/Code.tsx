import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

function DisplayCodeCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='codeCell renderedCodeCell'>
                <summary className='codeCellPreview'>
                    코드
                </summary>
                <code>{contents}</code>
            </div>
        </>
    );
}


function PreviewCodeCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='codeCell previewCodeCell'>
                <summary className='codeCellPreview'>
                    코드
                </summary>
                <code>{contents}</code>
            </div>
        </>
    );
}


function EditorCodeCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={props.style as any}
            name={'cell' + props.cellId}
            className='editorCodeCell editorCell'
            onChange={handleChangeFactory(props.cellId, dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const CodeCellStrategy: CellRenderStrategy = {
    'display': DisplayCodeCell,
    'preview': PreviewCodeCell,
    'editor': EditorCodeCell
}

export default CodeCellStrategy;