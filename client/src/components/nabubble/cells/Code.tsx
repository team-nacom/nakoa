import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { StaticCellComponentProps, EditorCellComponentProps } from './componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from './helpers/handlers';

import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
// import 'react-highlight.js/node_modules/highlight.js/styles/github.css';

//type : 'code'
//value : contents

function makeString(v: unknown): string {
    return typeof v !== 'string' ? '' : v;
}

function RenderedCodeCell(props: StaticCellComponentProps) {
    const [flat] = useNaBubbleState('flat');
    const contents = flat.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    // return ( 
    //     <Highlight className = { '' } >
    //         { contents }
    //     </Highlight>
    // ); 
    return (
        <>
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell renderedCodeCell'>
                <code>{contents}</code>
            </pre>
        </>
    );
}

function PreviewCodeCell(props: StaticCellComponentProps) {
    const [flat] = useNaBubbleState('previewFlat');
    const contents = flat?.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    // return ( 
    //     <Highlight className = { '' } >
    //         { contents }
    //     </Highlight>
    // ); 
    return (
        <>
            <summary className='codeCellPreview'>
                코드
            </summary>
            <pre className='codeCell previewCodeCell'>
                <code>{contents}</code>
            </pre>
        </>
    );
}

function EditorCodeCell(props: EditorCellComponentProps) {
    const [flat] = useNaBubbleState('flat');

    const cid = props.cellId;
    const contents = makeString(flat.record[cid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref={(el) => { props.refs.current[cid] = el }}
            name={'cell' + cid}
            className='editorCodeCell editorCell'
            onChange={handleChangeFactory(flat, cid, dispatch)} // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={handleKeyDownFactory(flat, cid, dispatch, props.refs)}
            // onPaste={ props.onPaste } // pasteHandler
            value={contents}
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedCodeCell, PreviewCodeCell, EditorCodeCell };