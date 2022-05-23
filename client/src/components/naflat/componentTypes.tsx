
// Declaration of cell renderer components.
// This file contains definitions which should be defined BEFORE defining render strategies for each types.

import React, { useMemo } from 'react';

interface CellComponentProps{
    cellId : string;
}
type CellComponent = React.FC<CellComponentProps>;

//cache by timestamp.
interface CachedCellComponentProps extends CellComponentProps{
    editedTimestamp: number;
    contextTimestamp: number;
}

type CachedCellComponent = React.FC<CachedCellComponentProps>;

function Cached(Comp: CellComponent): CachedCellComponent{
    return React.memo(({cellId, editedTimestamp, contextTimestamp}) => {
        // console.log(cellId, editedTimestamp, contextTimestamp);
        //editedTimestamp and contextTimestamp is for caching.
        return <Comp cellId = { cellId } />;
    });
}

type CellRenderStrategy<T extends CellComponentProps = CellComponentProps> = {
    'display' : React.FC<T>;
    'preview' : React.FC<T>;
    'editor' : React.FC<T>;
}

function applyCache(strategy: CellRenderStrategy): CellRenderStrategy<CachedCellComponentProps>{
    return {
        display: Cached(strategy.display),
        preview: Cached(strategy.preview),
        editor: Cached(strategy.editor)
    }
}

// function applyMemo(strategy: CellRenderStrategy): CellRenderStrategy<CellComponentProps>{
//     return {
//         display: React.memo(strategy.display),
//         preview: React.memo(strategy.preview),
//         editor: React.memo(strategy.editor)
//     }
// }

export type { CellComponentProps, CellRenderStrategy, CellComponent };
export type { CachedCellComponentProps, CachedCellComponent };
export { applyCache };