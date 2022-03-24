import React from 'react';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
const MemoizedTeX = React.memo(TeX);

function DisplayMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    const label = state.renderInfo.label;

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    const labelStr = (label[props.cellId].custom || label[props.cellId].autoType.join('.'));

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='mathCell renderedMathCell' >
                <MemoizedTeX block
                    settings={{ macros: state.renderInfo.macros.math }}
                >
                    {`\\tag{${labelStr}}` + contents}
                </MemoizedTeX>
            </div>
        </>
    );
}


function PreviewMathCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    const label = state.renderInfo.label;

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    const labelStr = (label[props.cellId].custom || label[props.cellId].autoType.join('.'));

    if (typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='mathCell previewMathCell' >
                <MemoizedTeX block
                    settings={{ macros: state.renderInfo.macros.math }}
                >
                    {`\\tag{${labelStr}}` + contents}
                </MemoizedTeX>
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
        <>
            <div className='editorMathCellWrapper'>
                <SingletonTextArea
                    className='editorMathCell editorCell'
                    onChange={handleChangeFactory(dispatch, props.cellId)}
                    value={contents}
                />
            </div>
            <div className='previewMathCellWrapper'>
                <PreviewMathCell {...props} />
            </div>
        </>
    );
}


const MathCellStrategy: CellRenderStrategy = {
    'display': DisplayMathCell,
    'preview': PreviewMathCell,
    'editor': EditorMathCell
}

export default MathCellStrategy;