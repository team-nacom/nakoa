import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
    id: number;
    title?: string;
    content: string;
    answer: string;
}

function Exercise({ id, title, content, answer } : Props) {
    return (
        <div className='exercise box'>
            <div className='label'>
                { `Exercise ${id}` }
            </div>
            <h1> 
                { title && <MarkdownRenderer source={title} />}
            </h1>
            <div> <MarkdownRenderer source={content}/> </div>
        </div>
    )
}

export default Exercise;