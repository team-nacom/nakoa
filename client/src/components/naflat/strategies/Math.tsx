import React from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
const MemoizedTeX = React.memo(TeX);

function DisplayMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'math'>;

    let contents = cell.value;

    const label = state.typedLabel;
    const labelStr = label[props.cellId].join('.');

    if (typeof contents !== 'string') return <></>;

    return (
        <div className='mathCell'>
            <summary className='mathCellLabel'>
                수식
            </summary>
            <div className='mathCellPreview' >
                <MemoizedTeX block
                    settings={{ macros: state.mathMacroObj }}
                >
                    {`\\tag{${labelStr}}` + contents}
                </MemoizedTeX>
            </div>
        </div>
    );
}


function PreviewMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'math'>;

    let contents = cell.value;

    const label = state.typedLabel;
    const labelStr = label[props.cellId].join('.');

    if (typeof contents !== 'string') return <></>;

    return (
        <div className='mathCell'>
            <summary className='mathCellLabel'>
                수식
            </summary>
            <div className='mathCellPreview' >
                <MemoizedTeX block
                    settings={{ macros: state.mathMacroObj }}
                >
                    {`\\tag{${labelStr}}` + contents}
                </MemoizedTeX>
            </div>
        </div>
    );
}


function EditorMathCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'math'>;

    let contents = cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <div className='editorMathCellWrapper'>
            <SingletonTextArea
                className='editorMathCell editorCell'
                onChange={handleChangeFactory(dispatch, props.cellId)}
                value={contents}
            />
            <PreviewMathCell {...props} />
        </div>
    );
}


const MathCellStrategy: CellRenderStrategy = {
    'display': DisplayMathCell,
    'preview': PreviewMathCell,
    'editor': EditorMathCell
}

export default MathCellStrategy;