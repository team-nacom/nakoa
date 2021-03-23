import React, { useState, Component } from 'react';
import styled from 'styled-components';

import { useMediaQuery } from 'react-responsive';

import MarkdownRenderer from './MarkdownRenderer';

const MarkdownArea = styled.textarea`
    width: 100% !important;
    height: 300px !important;
    overflow-y: scroll;
    box-sizing:border-box;

    padding: 4px;

    resize: none;
`

const PreviewArea = styled.div`
    width: 100%;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing:border-box;

    margin: 10px 0px;
    padding: 4px 10px;

    border: 1px solid #888888;
`

interface PanelProps extends React.HTMLAttributes<HTMLDivElement>{
    count: number;
    activeIndex: number | string;
    index: number | string;
}

function Panel({children, count, activeIndex, index, ...other} : PanelProps){
    const isMobile = useMediaQuery({ query: `(max-width:768px)` });

    return(
        <div style={ {
            float: 'left',
            width: isMobile? '100%' : `calc(100% / ${ count.toString() })`
        } } hidden={ isMobile && activeIndex !== index }>
            { children }
        </div>
    )
}

interface EditorProps extends React.HTMLAttributes<HTMLTextAreaElement>{
    body?: string;
    update: (c : string) => void; //can we do this w/o callback?
}

function MarkdownEditor({ body, update, ...other } : EditorProps) {
    const [value,setValue] = useState(body || '');

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        update(e.target.value);
    }

    return (
        <>
            <Panel count={2} activeIndex={1} index={1} >
                <MarkdownArea {...other} placeholder='Markdown 및 LaTeX 수식 입력 가능' onChange={ innerUpdate } value={ value } />
            </Panel>
            <Panel count={2} style={ { float: 'right'} } activeIndex={1} index={2}>
                <PreviewArea className='blog'>
                    <MarkdownRenderer style={ {padding: '4px'} } source={ value } />
                </PreviewArea>
            </Panel>
            <div style={ {clear:'both'} }></div>
        </>
    );
}

export default MarkdownEditor;