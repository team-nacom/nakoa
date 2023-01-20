import React, { useEffect } from 'react';

import { CellRenderer,  } from "./CellRenderer";
import { RenderMode } from "./types-render";

import { CellData } from "./types";
import { StructData } from "../types";

import { useEditorInit as useCellEditorInit } from '#/components/cell-editor/store/EditorState'

//TODO : 이 타입도 많이 보던 타입임. 밖으로 빼기
interface CellContent{
    rootId: string;
    structData: StructData;
    cellData: CellData;
}

function Display(props: CellContent){
    const cellInit = useCellEditorInit();
    useEffect(() => {
        cellInit(props.cellData, props.rootId, props.structData)
    }, [props]);

    return <CellRenderer mode={ RenderMode.DISPLAY } id={ props.rootId } />;
}

export { Display };