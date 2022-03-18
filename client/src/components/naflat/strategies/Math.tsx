import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
const MemoizedTeX = React.memo(TeX);

function DisplayMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='mathCell renderedMathCell' >
                <summary className='mathCellPreview'>
                    수식
                </summary>
                <MemoizedTeX block math={contents} />
            </div>
        </>
    );
}


function PreviewMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='mathCell previewMathCell' >
                <summary className='mathCellPreview'>
                    수식
                </summary>
                <MemoizedTeX block math={contents} />
            </div>
        </>
    );
}


function EditorMathCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <TextareaAutosize autoFocus style={props.style as any}
            name={'cell' + props.cellId}
            className='editorMathCell editorCell'
            onChange={handleChangeFactory(props.cellId, dispatch)}
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}


const MathCellStrategy: CellRenderStrategy = {
    'display': DisplayMathCell,
    'preview': PreviewMathCell,
    'editor': EditorMathCell
}

export default MathCellStrategy;