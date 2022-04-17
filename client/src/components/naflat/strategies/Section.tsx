import React from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import { handleChangeFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
import { strictEqual } from 'assert';

function DisplaySectionCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    let val = cell.value;
    if (typeof (val as any) === 'string') { //backward compatability
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
        <div className='sectionCell'>
            <MarkdownRenderer
                inlineRenderPrefix={prefix}
                mathMacroObj={state.mathMacroObj}
                perrefMap={state.typedLabel}
            >
                {'#'.repeat(depth) + ' ' + heading}
            </MarkdownRenderer>
        </div>
    );
}


function PreviewSectionCell(props: CellComponentProps) {
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    let val = cell.value;
    if (typeof (val as any) === 'string') { //backward compatability
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
        <div className='sectionCell'>
            <MarkdownRenderer
                inlineRenderPrefix={prefix}
                mathMacroObj={state.mathMacroObj}
                perrefMap={state.typedLabel}
            >
                {'#'.repeat(depth) + ' ' + heading}
            </MarkdownRenderer>
        </div>
    );
}


function EditorSectionCell(props: CellComponentProps) {
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'section'>;

    let val = cell.value;
    if (typeof (val as any) === 'string') { //backward compatability
        val = {
            heading: (val as any),
            hideChildren: false
        };
    }
    let { heading, hideChildren } = val;

    return <div className='editorSectionCell'>
        <span>
            접는 셀
        </span>
        <input type="checkbox"
            name="hideChildren"
            checked={hideChildren}
            onChange={() => {
                dispatch({
                    type: 'update',
                    id: props.cellId,
                    value: {
                        heading,
                        hideChildren: !hideChildren
                    }
                });
                dispatch({
                    type: 'toggleHideChildren',
                    id: props.cellId
                });
                //TODO: flat[cellId].hidechildren should be always synced with state.hideChildren[cellId]. how can we ensure this?
            }}
        />
        <br />
        <input autoFocus
            className='editorSectionCellInput'
            value={heading}
            onChange={
                handleChangeFactory(
                    dispatch,
                    props.cellId,
                    (str) => ({ heading: str, hideChildren })
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