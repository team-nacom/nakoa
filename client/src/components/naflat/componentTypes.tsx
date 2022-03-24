
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

function withCache(Comp: CellComponent): CachedCellComponent{
    return React.memo(({cellId, editedTimestamp, contextTimestamp}) => {
        // console.log(cellId, editedTimestamp, contextTimestamp);
        //editedTimestamp and contextTimestamp is for caching.
        return <Comp cellId = { cellId } />;
    })
}

type CellRenderStrategy<T extends CellComponentProps = CellComponentProps> = {
    'display' : React.FC<T>;
    'preview' : React.FC<T>;
    'editor' : React.FC<T>;
}

function applyCache(strategy: CellRenderStrategy): CellRenderStrategy<CachedCellComponentProps>{
    return {
        display: withCache(strategy.display),
        preview: withCache(strategy.preview),
        editor: withCache(strategy.editor)
    }
}

export type { CellComponentProps, CellRenderStrategy };
export type { CachedCellComponentProps, CachedCellComponent };
export { applyCache };
