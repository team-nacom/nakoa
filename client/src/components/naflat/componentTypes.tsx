
// Declaration of cell renderer components.
// The cell renderer will be fully implemented in ./renderer.tsx

import { Dispatch } from 'react';
import { FlatState, FlatStateAction } from './reducer';

interface CellComponentProps extends React.HTMLAttributes<HTMLElement>{
    cellId : string;
    editMode? : boolean;
}

interface CellFragmentProps extends CellComponentProps{
    getState : () => FlatState;
    dispatch : Dispatch<FlatStateAction>;
}

// type CellFragment = React.Component<CellFragmentProps>;
type CellFragment = (props: CellFragmentProps) => JSX.Element

type CellRenderStrategy = {
    'display' : CellFragment;
    'preview' : CellFragment;
    'edit' : CellFragment;
}

// the cell fragment type should match to the cell type,
// but we won't strictly check that elsewhere.

export type { CellComponentProps, CellFragmentProps, CellFragment, CellRenderStrategy };
