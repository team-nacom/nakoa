
// Declaration of cell renderer components.
// This file contains definitions which should be defined BEFORE defining render strategies for each types.

import React, { useMemo } from 'react';

interface CellComponentProps{
    cellId : string;
}
type CellComponent = React.FC<CellComponentProps>;

type CellRenderStrategy<T extends CellComponentProps = CellComponentProps> = {
    'display' : React.FC<T>;
    'preview' : React.FC<T>;
    'editor' : React.FC<T>;
}

export type { CellComponentProps, CellRenderStrategy };
