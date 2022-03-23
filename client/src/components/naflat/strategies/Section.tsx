import React from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

function DisplaySectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    let val = cell.value;
    if(typeof (val as any) === 'string'){ //backward compatability
        val = {
            heading: (val as any),
            hideChildren: false
        };
    }
    let { heading, hideChildren } = val;
    
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
            { '#'.repeat(depth) + ' ' + heading }
        </MarkdownRenderer>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    let val = cell.value;
    if(typeof (val as any) === 'string'){ //backward compatability
        val = {
            heading: (val as any),
            hideChildren: false
        };
    }
    let { heading, hideChildren } = val;

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
            { '#'.repeat(depth) + ' ' + heading }
        </MarkdownRenderer>
    );
}


function EditorSectionCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;
    
    let val = cell.value;
    if(typeof (val as any) === 'string'){ //backward compatability
        val = {
            heading: (val as any),
            hideChildren: false
        };
    }
    let { heading, hideChildren } = val;

    return <div className='editorSectionCell'>
        <input autoFocus
            className='editorSectionCellInput'
            value={ heading }
            onChange={
                handleChangeFactory(
                    dispatch,
                    props.cellId,
                    (str)=>({heading: str, hideChildren})
                )
            }
        />
    </div>
}


const SectionCellStrategy: CellRenderStrategy = {
    'display': DisplaySectionCell,
    'preview': PreviewSectionCell,
    'editor': EditorSectionCell
}

export default SectionCellStrategy;