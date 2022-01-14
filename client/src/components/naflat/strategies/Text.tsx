import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayTextCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
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


function PreviewTextCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
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


function EditTextCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={ props.style as any }
            name={'cell' + props.cellId}
            className='editorTextCell editorCell'
            onChange={handleChangeFactory(props.cellId,props.dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const TextCellStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'edit' : EditTextCell
}

export default TextCellStrategy;