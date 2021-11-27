import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { StaticCellComponentProps, EditorCellComponentProps } from './componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from './helpers/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

//type : 'text'
//value : contents

function makeString(v: unknown): string {
    return typeof v !== 'string' ? '' : v;
}

function RenderedTextCell(props: StaticCellComponentProps) {
    const [flat] = useNaBubbleState('flat');
    const contents = flat.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <div className='textCell renderedTextCell'>
            <MemoizedRenderer>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}

function PreviewTextCell(props: StaticCellComponentProps) {
    const [flat] = useNaBubbleState('previewFlat');
    const contents = flat.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <div className='textCell previewTextCell'>
            <MemoizedRenderer openDetails>
                {contents}
            </MemoizedRenderer>
        </div>
    );
}

function EditorTextCell(props: EditorCellComponentProps) {
    const [flat] = useNaBubbleState('flat');

    const cid = props.cellId;
    const contents = makeString(flat.record[cid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref={(el) => { props.refs.current[cid] = el }}
            name={'cell' + cid}
            className='editorTextCell editorCell'
            onChange={handleChangeFactory(flat, cid, dispatch)} // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={handleKeyDownFactory(flat, cid, dispatch, props.refs)}
            onPaste={props.onPaste} // pasteHandler
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedTextCell, PreviewTextCell, EditorTextCell };