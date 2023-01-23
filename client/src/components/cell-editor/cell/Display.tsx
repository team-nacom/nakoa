import React, { useEffect } from 'react';

import { CellRenderer,  } from "./CellRenderer";
import { RenderMode } from "./types-render";

import { CellData } from "./types";
import { StructData } from "../types";

import { useEditorInit as useCellEditorInit, useSingleCellChildren, useSingleCellHideChildren } from '#/components/cell-editor/store/EditorState'
import { ChildrenWrapper } from '../editor/ChildrenWrapper';

//TODO : 이 타입도 많이 보던 타입임. 밖으로 빼기
interface CellContent{
    rootId: string;
    structData: StructData;
    cellData: CellData;
}

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

function Display(props: CellContent){
    const cellInit = useCellEditorInit();
    useEffect(() => {
        cellInit(props.cellData, props.rootId, props.structData);
    }, [props]);

    return (<div className='allCellsWrapper'>
        <CellDisplay id={ props.rootId } />
    </div>);

}

export { Display };