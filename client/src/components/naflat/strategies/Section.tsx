import React from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

function DisplaySectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;
    
    const label = state.typedLabel;

    let depth = label[props.cellId].length;
    let prefix = '§' + label[props.cellId].join('.') + '. '

    return (
        <MarkdownRenderer
            inlineRenderClassName='sectionCell'
            inlineRenderPrefix={ prefix }
            mathMacroObj = { state.mathMacroObj }
            perrefMap = { state.typedLabel }
        >
            { '#'.repeat(depth) + ' ' + cell.value }
        </MarkdownRenderer>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    const label = state.typedLabel;
    let depth = label[props.cellId].length;
    let prefix = '§' + label[props.cellId].join('.') + '. '

    return (
        <MarkdownRenderer
            inlineRenderClassName='sectionCell'
            inlineRenderPrefix={ prefix }
            mathMacroObj = { state.mathMacroObj }
            perrefMap = { state.typedLabel }
        >
            { '#'.repeat(depth) + ' ' + cell.value }
        </MarkdownRenderer>
    );
}


function EditorSectionCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

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