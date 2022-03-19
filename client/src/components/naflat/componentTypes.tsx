
// Declaration of cell renderer components.
// This file contains definitions which should be defined BEFORE defining render strategies for each types.

interface CellComponentProps{
    className?: string;
    style?: React.CSSProperties;

    cellId : string;
}
type CellComponent = (props: CellComponentProps) => JSX.Element

type CellRenderStrategy = {
    'display' : CellComponent;
    'preview' : CellComponent;
    'editor' : CellComponent;
}

export type { CellComponentProps, CellRenderStrategy };
