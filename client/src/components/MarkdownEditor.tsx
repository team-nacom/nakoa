import React, { useState, Component } from 'react';
import styled from 'styled-components';
import Markdown from './Markdown';

const MarkdownArea = styled.textarea`
    resize: vertical;
`

interface EditorState extends React.HTMLAttributes<HTMLTextAreaElement>{
    body?: string;
    update: (c : string) => void; //can we do this w/o callback?
}

function MarkdownEditor({ body, update, ...rest } : EditorState) {
    const [content,setContent] = useState(body || '');

    const innerUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        update(e.target.value);
    }

    return (
        <MarkdownArea {...rest} placeholder='Markdown 및 LaTeX 수식 입력 가능' onChange={ innerUpdate } value={ content } />
    );
}

export default MarkdownEditor;