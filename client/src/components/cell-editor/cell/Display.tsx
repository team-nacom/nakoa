import React, { useEffect } from 'react';

import { CellRenderer } from "./CellRenderer";
import { RenderMode } from "./types-render";

import { CellArticleContent } from '#/common/Article';
import { Cell } from '../cell/types';

import { CellEditorProvider, useSingleCellChildren, useSingleCellHideChildren } from '#/components/cell-editor/editor/EditorState'
import { ChildrenWrapper } from '../editor/ChildrenWrapper';
import { FileMapDataProvider } from '#/components/editor/FileMapState';

interface CellDisplayIndicatorProps{
    id: string;
}
function CellDisplayIndicator({ id }: CellDisplayIndicatorProps){
    return (<div id={ id } className='cellContentWrapper' >
        <CellRenderer id = { id } mode = { RenderMode.DISPLAY } />
    </div>);
}

interface CellDisplayProps{
    id: string;
    depth?: number;
}
function CellDisplay({ id, depth }: CellDisplayProps){
    const childIds = useSingleCellChildren(id);
    const hide = useSingleCellHideChildren(id);

    const nextDepth = (depth ?? 0) + 1;

    return <>
        <CellDisplayIndicator id={ id } />
        {childIds !== undefined &&
            <ChildrenWrapper hide={hide}>
            {
                childIds.reduce( (prev: any[], childId, idx) => {
                    prev.push(
                        <CellDisplay key = { 'cell-' + childId }
                            id = { childId }
                            depth = { nextDepth }
                        />
                    )
                    // prev.push(
                    //     <InterCell key = { 'inter-' + id + '-' + (idx + 1) }
                    //         parentId = { id } idx = { idx + 1 }
                    //         depth = { nextDepth }
                    //     />
                    // )
                    return prev;
                }, [
                    // <InterCell key = { 'inter-' + id + '-0' }
                    //     parentId = { id } idx = { 0 }
                    //     depth = { nextDepth }
                    // /> // 0th element
                ])
            }
            </ChildrenWrapper>
        }
    </>
}

interface DisplayProps{
    fileMap: Record<string, File>;
    content: CellArticleContent<Cell>;
    publicIndex?: string;
}

export function Display(props: DisplayProps){
    const { fileMap, content, publicIndex } = props;

    return (<div className='allCellsWrapper'>
        <FileMapDataProvider map={ fileMap }>
        <CellEditorProvider
            init={ content }
            publicIndex={ publicIndex }
        >
            <CellDisplay id={ content.rootId } />
        </CellEditorProvider>
        </FileMapDataProvider>
    </div>);

}