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

    let prefix = '§' + (label[props.cellId].custom || label[props.cellId].auto.join('.')) + '. '

    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <MemoizedRenderer
            inlineRenderClassName='sectionCell'
            inlineRenderPrefix={ prefix }
            mathMacros = { state.renderInfo.macros.math }
            perrefMap = { perrefMap }
        >
            { '#'.repeat(depth) + ' ' + cell.value }
        </MemoizedRenderer>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    const label = state.renderInfo.label;

    let cell = state.flat[props.cellId];
    let depth = label[props.cellId].auto.length;

    let prefix = '§' + (label[props.cellId].custom || label[props.cellId].auto.join('.')) + '. '

    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <MemoizedRenderer
            inlineRenderClassName='sectionCell'
            inlineRenderPrefix={ prefix }
            mathMacros = { state.renderInfo.macros.math }
            perrefMap = { perrefMap }
        >
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
            className='editorSectionCellInput'
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