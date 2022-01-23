import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell renderedTextCell'
            style={ props.style }
        >
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}


function PreviewTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell renderedTextCell'
            style={ props.style }
        >
            <MemoizedRenderer openDetails>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}


function EditorTextCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={ props.style as any }
            name={'cell' + props.cellId}
            className='editorTextCell editorCell'
            onChange={handleChangeFactory(props.cellId,dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const TextCellStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'editor' : EditorTextCell
}

export default TextCellStrategy;