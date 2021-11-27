import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { StaticCellComponentProps, EditorCellComponentProps } from './componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from './helpers/handlers';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

//type : 'math'
//value : contents

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedMathCell(props: StaticCellComponentProps){
    const [ flat ] = useNaBubbleState('flat');
    const contents = flat.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <>
            <summary className='mathCellPreview'>
                수식
            </summary>
            <div className='mathCell renderedMathCell' >
                <TeX block math = { contents } />
            </div>
        </>
    );
}

function PreviewMathCell(props: StaticCellComponentProps){
    const [ flat ] = useNaBubbleState('previewFlat');
    const contents = flat?.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <>
            <summary className='mathCellPreview'>
                수식
            </summary>
            <div className='mathCell previewMathCell' >
                <TeX block math = { contents } />
            </div>
        </>
    );
}

function EditorMathCell(props: EditorCellComponentProps){
    const [ flat ] = useNaBubbleState('flat');

    const cid = props.cellId;
    const contents = makeString(flat.record[cid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref = { (el) => { props.refs.current[cid] = el } }
            name={ 'cell' + cid }
            className='editorMathCell editorCell'
            onChange={ handleChangeFactory(flat, cid, dispatch) } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDownFactory(flat, cid, dispatch, props.refs) }
            // onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedMathCell, PreviewMathCell, EditorMathCell };