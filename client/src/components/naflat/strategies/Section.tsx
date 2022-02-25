import React from 'react';
import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplaySectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    const label = state.renderInfo.label;

    let cell = state.flat[props.cellId];
    let depth = label[props.cellId].auto.length;

    return (
        <MemoizedRenderer inlineRenderClassName='sectionCell' inlineRenderPrefix={
            '§' + (label[props.cellId].custom || label[props.cellId].auto.join('.')) + '. '
        }>
            { '#'.repeat(depth) + ' ' + cell.value }
        </MemoizedRenderer>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    const label = state.renderInfo.label;

    let cell = state.flat[props.cellId];
    let depth = label[props.cellId].auto.length;

    return (
        <MemoizedRenderer inlineRenderClassName='sectionCell' inlineRenderPrefix={
            '§' + (label[props.cellId].custom || label[props.cellId].auto.join('.')) + '. '
        }>
            { '#'.repeat(depth) + ' ' + cell.value }
        </MemoizedRenderer>
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