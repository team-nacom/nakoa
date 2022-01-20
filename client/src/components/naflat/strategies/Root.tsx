import React from 'react';
import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = '# ' + cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <h1>
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </h1>
    );
}


function PreviewRootCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = '# ' + cell.value;

    if (typeof contents !== 'string') return <></>;

    return (
        <h1>
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </h1>
    );
}


function EditorRootCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let title = '# ' + cell.value;

    if (typeof title !== 'string') return <></>;

    return <input
        className='title'
        value={title}
        onChange={handleChangeFactory(props.cellId, dispatch)}
    />
}


const RootCellStrategy: CellRenderStrategy = {
    'display': DisplayRootCell,
    'preview': PreviewRootCell,
    'editor': EditorRootCell
}

export default RootCellStrategy;