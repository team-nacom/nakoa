import React from 'react';

import { CellFragmentProps, CellFragment, CellRenderStrategy } from '../componentTypes';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayTextCell(props: CellFragmentProps){
    let cell = props.getState().flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell renderedTextCell'>
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}


function PreviewTextCell(props: CellFragmentProps){
    return <></>;
}


function EditTextCell(props: CellFragmentProps){
    return <></>;
}


const TextStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'edit' : EditTextCell
}

export default TextStrategy;