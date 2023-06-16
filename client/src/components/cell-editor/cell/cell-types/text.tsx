import React, { useCallback } from 'react';

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCellEditorAction,
    useParentIds, useStructData,
} from '#/components/cell-editor/editor/EditorState'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

// import Markdown from '#/components/markdown/MarkdownRenderer'
import Markdown from '#/components/markdown/Markdown'
import { useFileMapState } from '#/components/editor/FileMapState';

// export const textCellName = 'text'
export interface TextCellField{
    value: string
}
export const textCellDefault: TextCellField = {
    value: ''
}
type TextCell = BasicCell<TextCellField,'text'> // only used in this file

// renderers

function TextCellViewer({ mode, cell } : CellTypeRendererProps<TextCell>){
    const { mathMacroObj, label, labelTypewise } = useRenderData();
    const { map } = useFileMapState();

    return (
        <div className='textCell'>
            <Markdown
                mathMacroObj={ mathMacroObj }
                perrefMap={ labelTypewise }
                fileMap={ map }
            >
                {cell.value}
            </Markdown>
        </div>
    )
}



function TextCellEditor({ cell }: Omit<CellTypeRendererProps<TextCell>,'mode'>){
    // const {} = useRenderData()
    const editorAction = useCellEditorAction();

    const parentId = useParentIds()[cell.id] ?? ''; // parentId should exist
    const idx = useStructData()[parentId].indexOf(cell.id);

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        let change: Partial<TextCellField> = {
            value: ev.target.value
        };

        editorAction.update(cell.id, change);
    }, [cell.id]);

    // todo: should have separate module for shortcuts
    const keyDownHandler: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((ev) => {
        if(ev.ctrlKey && ev.key === 'Enter'){ // cell split

            let change1: Partial<TextCellField> = {
                value: ev.currentTarget.value.slice(0, ev.currentTarget.selectionStart)
            };
            let change2: Partial<TextCellField> = {
                value: ev.currentTarget.value.slice(ev.currentTarget.selectionStart)
            };

            editorAction.update(cell.id, change1);
            editorAction.createChild('text', parentId, idx+1, change2, true); // immediate focus after creation

            ev.preventDefault();
        }

        if(ev.ctrlKey && ev.key === 'Backspace'){ // cell merge forward
            // if cursor is not on cell's head, fallback into default action.
            if(ev.currentTarget.selectionStart > 0 || ev.currentTarget.selectionEnd > 0) return;

            // only text-text merge is supported now
            // TODO : if target cell is math or code, then wrapping the value with $$ or ``` will help a lot
            editorAction.merge(
                cell.id, 'forward',
                (targ, dest) => (/* targ.cellType === 'text' && */ dest.cellType === 'text'),
                (targ, dest) => ({ value: (dest as TextCell).value + (targ as TextCell).value } as Partial<TextCellField>)
            );
            ev.preventDefault();
        }
        if(ev.ctrlKey && ev.key === 'Delete'){ // cell merge forward
            // if cursor is not on cell's tail, fallback into default action.
            if(ev.currentTarget.selectionStart < ev.currentTarget.value.length || ev.currentTarget.selectionEnd < ev.currentTarget.value.length) return;

            // only text-text merge is supported now
            editorAction.merge(
                cell.id, 'backward',
                (targ, dest) => (/* targ.cellType === 'text' && */ dest.cellType === 'text'),
                (targ, dest) => ({ value: (targ as TextCell).value + (dest as TextCell).value } as Partial<TextCellField>)
            );
            ev.preventDefault();
        }
    }, [cell.id, parentId]);

    return (
        <div className='editorTextCellWrapper'>
            <SingletonTextArea
                className='editorTextCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
                onKeyDown={ keyDownHandler }
            />
            <TextCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    );
}


export function TextCellRenderer({ mode, cell }: CellTypeRendererProps<TextCell>){
    if(mode !== RenderMode.EDITOR){
        return <TextCellViewer mode={ mode } cell={ cell } />
    }

    return <TextCellEditor cell={ cell } />
}