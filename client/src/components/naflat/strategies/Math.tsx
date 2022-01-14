import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
const MemoizedTeX = React.memo(TeX);

function DisplayMathCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <summary className='mathCellPreview'>
                수식
            </summary>
            <div className='mathCell renderedMathCell' >
                <MemoizedTeX block math = { contents } />
            </div>
        </>
    );
}


function PreviewMathCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <summary className='mathCellPreview'>
                수식
            </summary>
            <div className='mathCell previewMathCell' >
                <MemoizedTeX block math = { contents } />
            </div>
        </>
    );
}


function EditMathCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={ props.style as any }
            name={'cell' + props.cellId}
            className='editorMathCell editorCell'
            onChange={handleChangeFactory(props.cellId,props.dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const MathCellStrategy : CellRenderStrategy = {
    'display': DisplayMathCell,
    'preview': PreviewMathCell,
    'edit' : EditMathCell
}

export default MathCellStrategy;