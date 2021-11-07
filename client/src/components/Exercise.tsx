import React from 'react';
import MarkdownRenderer from './markdown/MarkdownRenderer';

interface Props {
    id: number;
    title?: string;
    content: string;
    answer: string;
}

function Exercise({ id, title, content, answer } : Props) {
    return (
        <div className='exercise'>
            <div className='label'>
                { `Exercise ${id}` }
            </div>
            <h1> 
                { title && <MarkdownRenderer source={title} />}
            </h1>
            <div> <MarkdownRenderer usePriority useTOC source={content}/> </div>
        </div>
    )
}

export default Exercise;