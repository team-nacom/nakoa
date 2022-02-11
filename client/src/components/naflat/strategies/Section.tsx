import React from 'react';
import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplaySectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = '# ' + cell.value;

    const label = state.renderInfo.label;

    return (
        <h1 className='sectionCell'>
            { '§' + (label[props.cellId].custom || label[props.cellId].auto.join('.')) + '.' }
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </h1>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = '# ' + cell.value;

    return (
        <h1 className='sectionCell'>
            { '§##.' }
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </h1>
    );
}


function EditorSectionCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let title = '' + cell.value;

    return <div className='editorSectionCell'>
        <input autoFocus
            className='title'
            value={title}
            onChange={handleChangeFactory(dispatch,props.cellId)}
        />
    </div>
}


const SectionCellStrategy: CellRenderStrategy = {
    'display': DisplaySectionCell,
    'preview': PreviewSectionCell,
    'editor': EditorSectionCell
}

export default SectionCellStrategy;